<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Mark;
use App\Models\Student;
use App\Models\AcademicYear;
use App\Models\Subject;
use App\Models\Announcement;
use App\Models\Schedule;
use App\Models\SemesterPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    public function dashboard()
    {
        // Get the authenticated user's student profile
        $user = auth()->user();
        $student = $user->student()
            ->with(['grade', 'section', 'parent'])
            ->first();

        if (!$student) {
            abort(403, 'User is not linked to a student profile.');
        }

        // Get academic year
        $academicYear = AcademicYear::where('is_current', true)->first() 
            ?? AcademicYear::orderBy('id', 'desc')->first();
        
        // Get current semester information
        $currentSemester = $this->getCurrentSemesterInfoForStudent($academicYear);
        
        // Get subjects filtered by grade and stream
        $subjectsQuery = Subject::where('grade_id', $student->grade_id);
        if ($student->stream_id) {
            $subjectsQuery->where(function($q) use ($student) {
                $q->where('stream_id', $student->stream_id)
                  ->orWhereNull('stream_id');
            });
        }
        $subjects = $subjectsQuery->get();

        // Get recent assessments (both graded and pending)
        $recentAssessments = Assessment::where('grade_id', $student->grade_id)
            ->where('section_id', $student->section_id)
            ->where('academic_year_id', $academicYear->id)
            ->with(['subject', 'marks' => function($q) use ($student) {
                $q->where('student_id', $student->id);
            }])
            ->latest()
            ->take(5)
            ->get();

        // Get all marks for average calculation
        $allMarks = Mark::where('student_id', $student->id)
            ->where('academic_year_id', $academicYear->id)
            ->whereHas('assessment') // Check assessment exists, ignore status
            ->get();

        // Calculate average from SUBJECT TOTALS (SUM), not individual assessment averages
        $subjectTotals = $allMarks->groupBy('subject_id')->map(fn($marks) => $marks->sum('score'));
        $average = $subjectTotals->isNotEmpty() ? $subjectTotals->avg() : 0;
        
        // Calculate rank within section based on TOTAL SCORE
        $sectionStudentIds = Student::where('section_id', $student->section_id)->pluck('id');
        $studentTotals = Mark::whereIn('student_id', $sectionStudentIds)
            ->where('academic_year_id', $academicYear->id)
            ->whereHas('assessment') // Check assessment exists, ignore status
            ->select('student_id', DB::raw('SUM(score) as total_score'))
            ->groupBy('student_id')
            ->orderByDesc('total_score')
            ->get();

        $rank = $studentTotals->search(function ($item) use ($student) {
            return $item->student_id == $student->id;
        });
        $rank = $rank !== false ? $rank + 1 : 'N/A';

        // Calculate average score for the quick stat (percentage-based)
        $averageScore = $allMarks->count() > 0 
            ? Mark::where('student_id', $student->id)
                ->where('academic_year_id', $academicYear->id)
                ->join('assessments', 'marks.assessment_id', '=', 'assessments.id')
                ->selectRaw('AVG((marks.score / assessments.max_score) * 100) as average')
                ->value('average')
            : 0;

        $marksStats = [
            'average' => round($average, 1),
            'rank' => $rank,
            'totalStudents' => $sectionStudentIds->count(),
            'totalSubjects' => $subjects->count(),
            'recent' => $recentAssessments->map(function ($assessment) {
                $mark = $assessment->marks->first(); // Get the student's mark if it exists
                
                return [
                    'id' => $assessment->id,
                    'subject' => $assessment->subject->name ?? 'Unknown',
                    'assessment' => $assessment->name,
                    'score' => $mark ? $mark->score : null,
                    'maxScore' => $assessment->max_score,
                    'percentage' => $mark ? round(($mark->score / $assessment->max_score) * 100, 1) : null,
                    'date' => $assessment->created_at ? $assessment->created_at->format('M d') : 'N/A',
                    'is_graded' => $mark ? true : false,
                ];
            })->values()
        ];

        // Get recent marks for this student
        $recentMarks = Mark::with(['assessment.subject', 'assessment.academicYear'])
            ->where('student_id', $student->id)
            ->where('academic_year_id', $academicYear->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Real Schedule
        $schedule = Schedule::where('grade_id', $student->grade_id)
            ->where(function($q) use ($student) {
                $q->where('section_id', $student->section_id)
                  ->orWhereNull('section_id');
            })
            ->where('is_active', true)
            ->orderBy('start_time')
            ->get();

        // Real Notifications
        $notifications = Announcement::where('status', 'sent')
            ->where(function($q) use ($student) {
                $q->where('recipient_type', 'all_students')
                  ->orWhere('recipient_type', 'grade_' . $student->grade_id)
                  ->orWhere('recipient_type', 'specific')
                  ->whereJsonContains('recipient_ids', (string)$student->user_id);
            })
            ->latest()
            ->take(5)
            ->get();

        // Upcoming assessments
        $upcomingAssessments = Assessment::with(['subject', 'creator'])
            ->where('grade_id', $student->grade_id)
            ->where('status', 'published')
            ->where('academic_year_id', $academicYear->id)
            ->whereDoesntHave('marks', function($query) use ($student) {
                $query->where('student_id', $student->id);
            })
            ->orderBy('due_date', 'asc')
            ->limit(5)
            ->get();

        return inertia('Student/Dashboard', [
            'auth' => [
                'user' => $user
            ],
            'student' => $student->load('user'),
            'academicYear' => $academicYear,
            'subjects' => $subjects,
            'recentMarks' => $recentMarks,
            'upcomingAssessments' => $upcomingAssessments,
            'averageScore' => round($averageScore ?? 0, 1),
            'marks' => $marksStats,
            'schedule' => $schedule,
            'notifications' => $notifications,
            'currentSemester' => $currentSemester,
        ]);
    }

    /**
     * Get current semester information for student
     */
    private function getCurrentSemesterInfoForStudent($academicYear)
    {
        if (!$academicYear) {
            return null;
        }

        $openSemester = SemesterPeriod::where('academic_year_id', $academicYear->id)
            ->where('status', 'open')
            ->first();

        $closedSemester = SemesterPeriod::where('academic_year_id', $academicYear->id)
            ->where('status', 'closed')
            ->orderBy('semester', 'desc')
            ->first();

        if ($openSemester) {
            return [
                'semester_label' => 'Semester ' . $openSemester->semester,
                'semester' => $openSemester->semester,
                'status' => 'in_progress',
                'is_open' => true,
                'can_view_results' => false,
                'message' => 'Results will be available when semester closes',
            ];
        }

        if ($closedSemester) {
            return [
                'semester_label' => 'Semester ' . $closedSemester->semester,
                'semester' => $closedSemester->semester,
                'status' => 'completed',
                'is_open' => false,
                'can_view_results' => true,
                'message' => 'Results are available',
            ];
        }

        return null;
    }

    public function marks()
    {
        $user = auth()->user();
        $student = $user->student;

        if (!$student) {
            abort(403, 'User is not linked to a student profile.');
        }

        $marks = Mark::with(['assessment.subject', 'assessment.academicYear'])
            ->where('student_id', $student->id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        // Group marks by subject for better organization
        $marksBySubject = Mark::with(['assessment.subject'])
            ->where('student_id', $student->id)
            ->get()
            ->groupBy('assessment.subject.name');

        return inertia('Student/Marks/Index', [
            'student' => $student->load(['grade', 'section']),
            'marks' => $marks,
            'marksBySubject' => $marksBySubject
        ]);
    }
}
