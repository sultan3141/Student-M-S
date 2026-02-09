<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Mark;
use App\Models\AcademicYear;
use App\Models\SemesterStatus;
use App\Models\SemesterPeriod;
use App\Models\Registration;
use App\Models\Subject;
use App\Models\Assessment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SemesterRecordController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $student = $user->student()->with(['grade', 'section', 'user'])->first();

        if (!$student) {
            return redirect()->route('student.dashboard')->with('error', 'Student profile not found');
        }

        // Get all official registrations (history of grades/years)
        $registrations = Registration::where('student_id', $student->id)
            ->with(['grade', 'academicYear', 'section'])
            ->orderBy('academic_year_id', 'desc')
            ->get();

        $history = $registrations->map(function ($reg) use ($student) {
            $semestersData = collect([1, 2])->map(function ($semesterNum) use ($reg, $student) {
                // Check if any marks exist for this specific grade/year/semester
                $hasMarks = Mark::where('student_id', $student->id)
                    ->where('academic_year_id', $reg->academic_year_id)
                    ->where('grade_id', $reg->grade_id)
                    ->where('semester', $semesterNum)
                    ->exists();

                // Check if any assessments exist for this class
                $hasAssessments = Assessment::where('academic_year_id', $reg->academic_year_id)
                    ->where('grade_id', $reg->grade_id)
                    ->where('section_id', $reg->section_id)
                    ->where('semester', $semesterNum)
                    ->exists();

                // Check if this is the current academic year
                $isCurrentYear = $reg->academicYear->is_current;

                if (!$hasMarks && !$hasAssessments && !$isCurrentYear) {
                    return null;
                }

                $academicYearId = $reg->academic_year_id;

                // Get semester status (released or open)
                $semesterPeriod = SemesterPeriod::where('academic_year_id', $academicYearId)
                    ->where('semester', $semesterNum)
                    ->first();
                $status = $semesterPeriod ? $semesterPeriod->status : 'closed';

                // Fetch marks to calculate average
                $marks = Mark::where('student_id', $student->id)
                    ->where('academic_year_id', $academicYearId)
                    ->where('grade_id', $reg->grade_id) // Match the grade from the registration
                    ->where('semester', $semesterNum)
                    ->get();

                // Subject count for this specific GRADE
                $subjectsCount = Subject::where('grade_id', $reg->grade_id)
                    ->when($reg->stream_id, function ($q) use ($reg) {
                        $q->where(function ($sq) use ($reg) {
                            $sq->where('stream_id', $reg->stream_id)->orWhereNull('stream_id');
                        });
                    })->count();

                $gradedSubjectsCount = $marks->where('is_submitted', true)->unique('subject_id')->count();
                $isComplete = $gradedSubjectsCount >= $subjectsCount && $subjectsCount > 0;

                $rankData = ['rank' => '-', 'total' => 0];
                $average = 0;

                if ($isComplete) {
                    // Pass correct section_id from registration for historical ranking
                    $rankData = $this->calculateSemesterRankFast($student->id, $reg->section_id, $semesterNum, $academicYearId);

                    $subjectTotals = $marks->groupBy('subject_id')->map(function ($m) {
                        $score = $m->sum('score');
                        $max = $m->sum('max_score') ?: ($m->count() * 100);
                        return $max > 0 ? ($score / $max) * 100 : 0;
                    });
                    $average = round($subjectTotals->avg(), 2);
                }

                return [
                    'semester' => $semesterNum,
                    'academic_year_id' => $academicYearId,
                    'academic_year' => $reg->academicYear,
                    'average' => $average,
                    'rank' => $rankData['rank'] ?? '-',
                    'total_students' => $rankData['total'] ?? 0,
                    'status' => $status,
                    'is_complete' => $isComplete,
                ];
            })->filter()->values();

            return [
                'id' => $reg->id,
                'grade' => $reg->grade,
                'academic_year' => $reg->academicYear,
                'section' => $reg->section,
                'semesters' => $semestersData
            ];
        })->filter(function ($item) {
            return count($item['semesters']) > 0;
        })->values();

        return Inertia::render('Student/SemesterRecord/Index', [
            'student' => $student,
            'history' => $history,
        ]);
    }

    public function show($semester, $academicYearId)
    {
        \Log::info('SemesterRecordController::show called', ['semester' => $semester, 'academicYear' => $academicYearId]);

        $user = auth()->user();
        \Log::info('User authenticated', ['user_id' => $user?->id, 'is_authenticated' => !!$user]);

        $student = $user->student()->with(['grade', 'section'])->first();
        \Log::info('Student found', ['student_id' => $student?->id, 'has_student' => !!$student]);

        if (!$student) {
            return redirect()->route('student.dashboard')->with('error', 'Student profile not found');
        }

        $academicYear = AcademicYear::findOrFail($academicYearId);

        if (!$academicYear) {
            return redirect()->route('student.academic.semesters')->with('error', 'Academic year not found');
        }

        // Find the registration for this year/student to get the correct grade_id
        $registration = Registration::where('student_id', $student->id)
            ->where('academic_year_id', $academicYearId)
            ->first();

        // If no registration found for that year, fallback to current student grade (though registration SHOULD exist)
        $viewGradeId = $registration ? $registration->grade_id : $student->grade_id;
        $viewSectionId = $registration ? $registration->section_id : $student->section_id;

        // Get semester status to display to student (but don't block access)
        $semesterStatus = SemesterStatus::where('academic_year_id', $academicYearId)
            ->where('grade_id', $viewGradeId)
            ->where('semester', $semester)
            ->first();

        $status = $semesterStatus ? $semesterStatus->status : 'open';

        // Get all subjects for this grade/stream
        $subjectsQuery = Subject::where('grade_id', $viewGradeId);
        if ($student->stream_id) {
            $subjectsQuery->where(function ($q) use ($student) {
                $q->where('stream_id', $student->stream_id)
                    ->orWhereNull('stream_id');
            });
        }
        $assignedSubjects = $subjectsQuery->get();

        // Get ALL assessments for this semester (Published AND Draft)
        // This allows students to see pending assessments in their dashboard
        $assessments = \App\Models\Assessment::where('grade_id', $viewGradeId)
            ->where('section_id', $viewSectionId)
            ->where('semester', $semester)
            ->where('academic_year_id', $academicYearId)
            ->with(['subject', 'assessmentType'])
            ->get();

        $marks = \App\Models\Mark::where('student_id', $student->id)
            ->where('semester', $semester)
            ->where('academic_year_id', $academicYearId)
            ->with(['subject', 'assessment.assessmentType'])
            ->get();

        $marksByAssessment = $marks->whereNotNull('assessment_id')->groupBy('assessment_id');
        $orphanedMarks = $marks->whereNull('assessment_id');

        // Get teacher names for these subjects in this section
        $teacherAssignments = \App\Models\TeacherAssignment::with('teacher.user')
            ->where('section_id', $viewSectionId)
            ->where('academic_year_id', $academicYearId)
            ->get()
            ->keyBy('subject_id');

        // Build subject records by iterating over all assigned subjects
        $subjectRecords = $assignedSubjects->map(function ($subject) use ($assessments, $marks, $marksByAssessment, $orphanedMarks, $teacherAssignments) {
            $subjectAssessments = $assessments->where('subject_id', $subject->id);
            $subjectMarks = $marks->where('subject_id', $subject->id);

            // Marks linked to formal assessments
            $assessmentMarks = $subjectAssessments->map(function ($assessment) use ($marksByAssessment) {
                $mark = $marksByAssessment->get($assessment->id)?->first();

                return [
                    'id' => $mark?->id,
                    'assessment_id' => $assessment->id,
                    'score' => $mark?->score,
                    'assessment_name' => $assessment->name,
                    'max_score' => $assessment->max_score,
                    'weight' => $assessment->weight_percentage ?? 0,
                    'type' => $assessment->assessmentType?->name ?? 'General',
                    'is_submitted' => $mark ? true : false,
                    'status' => $mark ? 'graded' : 'pending',
                ];
            });

            // Marks NOT linked to formal assessments (e.g., legacy or quick entry)
            $extraMarks = $subjectMarks->whereNull('assessment_id')->map(function ($mark) {
                return [
                    'id' => $mark->id,
                    'assessment_id' => null,
                    'score' => $mark->score,
                    'assessment_name' => $mark->assessment_type ?? 'Grade Entry',
                    'max_score' => $mark->max_score ?? 100,
                    'weight' => 0,
                    'type' => 'General',
                    'is_submitted' => true,
                    'status' => 'graded',
                ];
            });

            $allDetailedMarks = $assessmentMarks->concat($extraMarks);

            // Calculate totals for this subject
            $gradedMarks = $allDetailedMarks->filter(fn($m) => $m['is_submitted']);
            $totalScore = $gradedMarks->sum('score');
            $totalMaxScore = $gradedMarks->sum('max_score');

            return [
                'subject' => [
                    'id' => $subject->id,
                    'name' => $subject->name,
                    'code' => $subject->code,
                    'credit_hours' => $subject->credit_hours ?? 3,
                    'teacher_name' => $teacherAssignments->get($subject->id)?->teacher?->user?->name ?? 'Not Assigned',
                ],
                'marks' => $allDetailedMarks->values(),
                'total_score' => $totalScore,
                'total_max_score' => $totalMaxScore,
                'average' => $totalMaxScore > 0 ? round(($totalScore / $totalMaxScore) * 100, 2) : 0,
                'total_assessments' => $allDetailedMarks->count(),
                'graded_assessments' => $gradedMarks->count(),
            ];
        })->values();

        // Only calculate stats if ALL subjects are graded
        $allSubjectsGraded = $subjectRecords->every(fn($r) => $r['graded_assessments'] > 0);

        if ($allSubjectsGraded) {
            $subjectPercentages = $subjectRecords->filter(fn($r) => $r['graded_assessments'] > 0)
                ->map(fn($r) => $r['average']);
            $semesterAverage = $subjectPercentages->isNotEmpty() ? round($subjectPercentages->avg(), 2) : 0;
            $rankData = $this->calculateSemesterRankFast($student->id, $viewSectionId, $semester, $academicYearId);
        } else {
            $semesterAverage = 0;
            $rankData = ['rank' => '-', 'total' => 0];
        }

        return Inertia::render('Student/SemesterRecord/Show', [
            'student' => $student,
            'semester' => (int) $semester,
            'academic_year' => $academicYear,
            'subject_records' => $subjectRecords,
            'semester_average' => $semesterAverage,
            'rank' => $rankData['rank'] ?? '-',
            'total_students' => $rankData['total'] ?? 0,
            'semester_status' => $status, // 'open' or 'closed'
        ]);
    }

    /**
     * Invalidate semester rankings cache for a specific section
     * Call this whenever marks are updated to ensure rankings stay current
     */
    public static function invalidateSemesterRankings($sectionId, $semester, $academicYearId)
    {
        $cacheKey = "section_rankings_{$sectionId}_{$semester}_{$academicYearId}";
        cache()->forget($cacheKey);
    }

    /**
     * Calculate class rank for a student in a specific semester - with caching
     */
    private function calculateSemesterRankFast($studentId, $sectionId, $semester, $academicYearId)
    {
        $cacheKey = "section_rankings_{$sectionId}_{$semester}_{$academicYearId}";

        $rankings = cache()->remember($cacheKey, 300, function () use ($sectionId, $semester, $academicYearId) {
            // Get all students in the same section
            $sectionStudents = Student::where('section_id', $sectionId)->pluck('id');

            // Calculate percentage average for each student for ranking
            // Using same logic as show() method for consistency (lines 208-212)
            return Mark::whereIn('student_id', $sectionStudents)
                ->where('semester', $semester)
                ->where('academic_year_id', $academicYearId)
                ->get()
                ->groupBy('student_id')
                ->map(function ($marks, $sid) {
                    // Calculate per-subject percentages
                    $subjectAvg = $marks->groupBy('subject_id')->map(function ($m) {
                        $score = $m->sum('score');
                        $max = $m->sum('max_score') ?: (count($m) * 100);
                        return $max > 0 ? ($score / $max) * 100 : 0;
                    });
                    // Return average of subject percentages
                    return [
                        'student_id' => $sid,
                        'avg' => $subjectAvg->count() > 0 ? round($subjectAvg->avg(), 2) : 0
                    ];
                })
                ->filter(fn($item) => $item['avg'] > 0) // Only include students with grades
                ->sortByDesc('avg')
                ->values();
        });

        // Find this student's rank from the cached list
        $rankIndex = $rankings->search(fn($item) => $item['student_id'] == $studentId);

        // Use rankings collection length for total (students with grades)
        // Or fall back to section count if student not in rankings
        $totalStudents = $rankings->count();
        if ($totalStudents === 0) {
            $totalStudents = Student::where('section_id', $sectionId)->count();
        }

        return [
            'rank' => $rankIndex !== false ? $rankIndex + 1 : '-',
            'total' => $totalStudents,
        ];
    }

    /**
     * Calculate class rank for a student in a specific semester
     */
    public function calculateSemesterRank($student, $semester, $academicYearId)
    {
        return $this->calculateSemesterRankFast($student->id, $student->section_id, $semester, $academicYearId);
    }
}
