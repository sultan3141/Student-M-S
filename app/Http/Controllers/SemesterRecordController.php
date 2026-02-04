<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Mark;
use App\Models\AcademicYear;
use App\Models\SemesterStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SemesterRecordController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $student = $user->student()->with(['grade', 'section'])->first();
        
        if (!$student) {
            return redirect()->route('student.dashboard')->with('error', 'Student profile not found');
        }

        // Get semesters where marks exist for PUBLISHED assessments
        $markSemesters = \App\Models\Mark::where('student_id', $student->id)
            ->whereHas('assessment', function($q) {
                $q->where('status', 'published');
            })
            ->select('academic_year_id', 'semester')
            ->distinct()
            ->get();

        // Also get semesters where published assessments exist for this student's class
        $assessmentSemesters = \App\Models\Assessment::where('grade_id', $student->grade_id)
            ->where('section_id', $student->section_id)
            ->where('status', 'published')
            ->select('academic_year_id', 'semester')
            ->distinct()
            ->get();

        // Combine and get detailed data - ONLY SHOW CLOSED SEMESTERS
        $semesters = $markSemesters->concat($assessmentSemesters)
            ->unique(function($item) {
                return $item->academic_year_id . '-' . $item->semester;
            })
            ->map(function($item) use ($student) {
                $academicYearId = $item->academic_year_id;
                $semester = $item->semester;
                $academicYear = \App\Models\AcademicYear::find($academicYearId);
                
                // Check semester status - ONLY INCLUDE CLOSED SEMESTERS
                $semesterPeriod = \App\Models\SemesterPeriod::where('academic_year_id', $academicYearId)
                    ->where('semester', $semester)
                    ->first();
                
                // Skip if semester is not closed
                if (!$semesterPeriod || $semesterPeriod->status !== 'closed') {
                    return null;
                }
                
                $rankData = $this->calculateSemesterRank($student, $semester, $academicYearId);
                
                // Fetch marks for this specific semester to calculate average - with assessment eager loaded
                $group = \App\Models\Mark::where('student_id', $student->id)
                    ->where('academic_year_id', $academicYearId)
                    ->where('semester', $semester)
                    ->with('assessment')
                    ->whereHas('assessment') // Just check if assessment exists
                    ->get();

                // Calculate average based on SUBJECT TOTALS - Include ALL marks with an assessment
                $publishedMarks = $group->filter(fn($m) => $m->assessment);
                
                $subjectTotals = $publishedMarks->groupBy('subject_id')
                    ->map(function($marks) {
                        return $marks->sum('score');
                    });
                
                return [
                    'semester' => $semester,
                    'academic_year_id' => $academicYearId,
                    'academic_year' => $academicYear,
                    'average' => round($subjectTotals->avg(), 2),
                    'rank' => $rankData['rank'] ?? '-',
                    'total_students' => $rankData['total'] ?? 0,
                    'status' => 'closed',
                ];
            })
            ->filter() // Remove null values (open semesters)
            ->values();

        return Inertia::render('Student/SemesterRecord/Index', [
            'student' => $student,
            'semesters' => $semesters,
        ]);
    }

    public function show($semester, $academicYearId)
    {
        $user = auth()->user();
        $student = $user->student()->with(['grade', 'section'])->first();
        
        if (!$student) {
            return redirect()->route('student.dashboard')->with('error', 'Student profile not found');
        }

        $academicYear = \App\Models\AcademicYear::findOrFail($academicYearId);
        
        // Get semester status to display to student (but don't block access)
        $semesterStatus = SemesterStatus::where('academic_year_id', $academicYearId)
            ->where('grade_id', $student->grade_id)
            ->where('semester', $semester)
            ->first();
        
        $status = $semesterStatus ? $semesterStatus->status : 'open';
        
        // Get all subjects for this grade/stream
        $subjectsQuery = \App\Models\Subject::where('grade_id', $student->grade_id);
        if ($student->stream_id) {
            $subjectsQuery->where(function($q) use ($student) {
                $q->where('stream_id', $student->stream_id)
                  ->orWhereNull('stream_id');
            });
        }
        $assignedSubjects = $subjectsQuery->get();

        // Get ALL assessments for this semester (Published AND Draft)
        // This allows students to see pending assessments in their dashboard
        $assessments = \App\Models\Assessment::where('grade_id', $student->grade_id)
            ->where('section_id', $student->section_id)
            ->where('semester', $semester)
            ->where('academic_year_id', $academicYearId)
            ->with(['subject', 'assessmentType'])
            ->get();

        // Get marks for PUBLISHED assessments
        $marks = \App\Models\Mark::where('student_id', $student->id)
            ->where('semester', $semester)
            ->where('academic_year_id', $academicYearId)
            ->whereHas('assessment') // Check assessment exists, ignore status
            ->with(['subject', 'assessment.assessmentType'])
            ->get()
            ->keyBy('assessment_id');

        // Get teacher names for these subjects in this section
        $teacherAssignments = \App\Models\TeacherAssignment::with('teacher.user')
            ->where('section_id', $student->section_id)
            ->where('academic_year_id', $academicYearId)
            ->get()
            ->keyBy('subject_id');

        // Group assessments by subject
        $subjectRecords = $assessments->groupBy('subject_id')->map(function ($subjectAssessments) use ($marks, $teacherAssignments) {
            $subject = $subjectAssessments->first()->subject;
            
            $detailedMarks = $subjectAssessments->map(function($assessment) use ($marks) {
                $mark = $marks->get($assessment->id);
                
                return [
                    'id' => $mark->id ?? null,
                    'assessment_id' => $assessment->id,
                    'score' => $mark->score ?? null,
                    'assessment_name' => $assessment->name,
                    'max_score' => $assessment->max_score,
                    'weight' => $assessment->weight_percentage ?? 0,
                    'type' => $assessment->assessmentType->name ?? 'General',
                    'is_submitted' => $mark ? true : false,
                    'status' => $mark ? 'graded' : 'pending',
                ];
            });

            // Calculate average only from graded assessments
            $gradedMarks = $detailedMarks->filter(fn($m) => $m['is_submitted']);
            
            // Calculate total sum of scores
            $totalScore = 0;
            $totalMaxScore = 0;
            
            foreach ($gradedMarks as $mark) {
                $totalScore += $mark['score'];
                $totalMaxScore += $mark['max_score'];
            }

            return [
                'subject' => [
                    'id' => $subject->id,
                    'name' => $subject->name,
                    'code' => $subject->code,
                    'credit_hours' => $subject->credit_hours ?? 3,
                    'teacher_name' => $teacherAssignments->get($subject->id)?->teacher?->user?->name ?? 'Not Assigned',
                ],
                'marks' => $detailedMarks->values(),
                'total_score' => $totalScore,
                'total_max_score' => $totalMaxScore,
                'average' => $totalMaxScore > 0 ? round(($totalScore / $totalMaxScore) * 100, 2) : 0,
                'total_assessments' => $subjectAssessments->count(),
                'graded_assessments' => $gradedMarks->count(),
            ];
        })->values();

        // Get overall stats - Calculate average of SUBJECT TOTALS
        $subjectMeans = $assessments->groupBy('subject_id')->map(function ($subjectAssessments) use ($marks) {
            $subjMarks = $marks->whereIn('assessment_id', $subjectAssessments->pluck('id'));
            return $subjMarks->sum('score');
        });
        
        $semesterAverage = $subjectMeans->isNotEmpty() ? round($subjectMeans->avg(), 2) : 0;
        
        $rankData = $this->calculateSemesterRank($student, $semester, $academicYearId);
        
        return Inertia::render('Student/SemesterRecord/Show', [
            'student' => $student,
            'semester' => $semester,
            'academic_year' => $academicYear,
            'subject_records' => $subjectRecords,
            'semester_average' => $semesterAverage,
            'rank' => $rankData['rank'] ?? '-',
            'total_students' => $rankData['total'] ?? 0,
            'semester_status' => $status, // 'open' or 'closed'
        ]);
    }

    /**
     * Calculate class rank for a student in a specific semester - with caching
     */
    private function calculateSemesterRankFast($studentId, $sectionId, $semester, $academicYearId)
    {
        $cacheKey = "semester_rank_{$sectionId}_{$semester}_{$academicYearId}";
        
        return cache()->remember($cacheKey, 300, function () use ($studentId, $sectionId, $semester, $academicYearId) {
            // Get all students in the same section
            $sectionStudents = Student::where('section_id', $sectionId)
                ->pluck('id');

            // Calculate TOTAL SCORES for all students in the section - only PUBLISHED
            $rankings = Mark::whereIn('student_id', $sectionStudents)
                ->where('semester', $semester)
                ->where('academic_year_id', $academicYearId)
                ->whereHas('assessment') // Ignore status
                ->select('student_id', DB::raw('SUM(score) as total_score'))
                ->groupBy('student_id')
                ->orderByDesc('total_score')
                ->get();

            // Find this student's rank
            $rank = $rankings->search(function ($item) use ($studentId) {
                return $item->student_id == $studentId;
            });

            return [
                'rank' => $rank !== false ? $rank + 1 : null,
                'total' => $sectionStudents->count(),
            ];
        });
    }
    
    /**
     * Calculate class rank for a student in a specific semester
     */
    private function calculateSemesterRank($student, $semester, $academicYearId)
    {
        return $this->calculateSemesterRankFast($student->id, $student->section_id, $semester, $academicYearId);
    }
}
