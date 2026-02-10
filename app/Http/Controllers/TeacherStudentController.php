<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Mark;
use App\Models\Ranking;
use App\Models\Student;
use App\Models\Grade;
use App\Models\Section;
use App\Models\Subject;
use App\Models\Assessment;
use App\Models\AcademicYear;
use App\Models\TeacherAssignment;
use App\Models\SemesterStatus;
use App\Models\Attendance;

class TeacherStudentController extends Controller
{
    /**
     * Display a listing of students in the teacher's classes.
     */
    public function index()
    {
        // Mock data for student list
        $students = [
            [
                'id' => 1,
                'name' => 'John Doe',
                'class' => '10A',
                'average_score' => 85.5,
                'attendance' => 92,
                'status' => 'Excellent',
                'trend' => 'up',
            ],
            [
                'id' => 2,
                'name' => 'Jane Smith',
                'class' => '10A',
                'average_score' => 72.0,
                'attendance' => 88,
                'status' => 'Good',
                'trend' => 'stable',
            ],
            [
                'id' => 3,
                'name' => 'Alice Johnson',
                'class' => '10B',
                'average_score' => 45.0,
                'attendance' => 75,
                'status' => 'Critical',
                'trend' => 'down',
            ],
            // Add more mock students...
        ];

        return Inertia::render('Teacher/Students/Index', [
            'students' => $students
        ]);
    }

    public function show($studentId)
    {
        $academicYear = AcademicYear::whereRaw('is_current = true')->first();
        if (!$academicYear)
            $academicYear = AcademicYear::orderBy('id', 'desc')->first();

        $student = Student::with(['user', 'grade', 'section'])->findOrFail($studentId);

        // Get all marks for this student
        $allMarks = Mark::where('student_id', $studentId)
            ->where('academic_year_id', $academicYear->id)
            ->with(['subject', 'assessment'])
            ->get();

        // Calculate subject performance vs Class Average
        $subjectPerformance = $allMarks->groupBy('subject_id')->map(function ($subjectMarks) use ($student, $academicYear) {
            $subject = $subjectMarks->first()->subject;

            // Student Subject Average
            $studentSubjectTotals = $subjectMarks->groupBy('subject_id')->map(function ($m) {
                $score = $m->sum('score');
                $max = $m->sum('max_score') ?: (count($m) * 100);
                return $max > 0 ? ($score / $max) * 100 : 0;
            });
            $avg = $studentSubjectTotals->first() ?? 0;

            // Section Subject Average
            $sectionStudents = Student::where('section_id', $student->section_id)->pluck('id');
            $sectionMarks = Mark::whereIn('student_id', $sectionStudents)
                ->where('subject_id', $subject->id)
                ->where('academic_year_id', $academicYear->id)
                ->get();

            $sectionAvg = 0;
            if ($sectionMarks->isNotEmpty()) {
                $sectionScoresByStudent = $sectionMarks->groupBy('student_id')->map(function ($sm) {
                    $s = $sm->sum('score');
                    $m = $sm->sum('max_score') ?: (count($sm) * 100);
                    return $m > 0 ? ($s / $m) * 100 : 0;
                });
                $sectionAvg = $sectionScoresByStudent->avg();
            }

            return [
                'subject' => $subject->name,
                'score' => round($avg, 1),
                'class_avg' => round($sectionAvg, 1),
                'letter' => $this->calculateGrade($avg)
            ];
        })->values();

        // Calculate history for trend chart with REAL class averages
        $performanceHistory = $allMarks->filter(fn($mark) => $mark->assessment_id !== null)
            ->sortBy('created_at')
            ->map(function ($mark) use ($student) {
                // Get class average for this specific assessment
                $assessmentAvg = Mark::where('assessment_id', $mark->assessment_id)
                    ->whereIn('student_id', Student::where('section_id', $student->section_id)->pluck('id'))
                    ->avg('score');

                return [
                    'assessment' => $mark->assessment->name,
                    'score' => $mark->score,
                    'average' => round($assessmentAvg, 1),
                    'date' => $mark->created_at->format('M d'),
                ];
            })->values();

        // Overall Average (Average of subject percentages)
        $overallAverage = $subjectPerformance->avg('score');

        // Attendance Stats
        $attendance = Attendance::where('student_id', $studentId)
            ->where('academic_year_id', $academicYear->id)
            ->get();

        $attendanceStats = [
            'rate' => $attendance->count() > 0
                ? round(($attendance->where('status', 'Present')->count() / $attendance->count()) * 100, 1)
                : 100,
            'present' => $attendance->where('status', 'Present')->count(),
            'total' => $attendance->count()
        ];

        // Rank (Using common helper logic)
        $rankingController = new SemesterRecordController();
        $rankData = $rankingController->calculateSemesterRank($student, 1, $academicYear->id); // Default to current/general rank

        $studentInfo = [
            'id' => $student->id,
            'student_id' => $student->student_id,
            'name' => $student->user->name,
            'class' => $student->grade->name . ' - ' . $student->section->name,
            'email' => $student->user->email,
            'parent_email' => $student->parent && $student->parent->user ? $student->parent->user->email : 'N/A',
            'average' => $overallAverage ? round($overallAverage, 1) : 0,
            'rank' => $rankData['rank'] ?? '-',
            'total_students' => $rankData['total'] ?? 0,
            'attendance' => $attendanceStats
        ];

        return Inertia::render('Teacher/Students/Show', [
            'student' => $studentInfo,
            'history' => $performanceHistory,
            'subjects' => $subjectPerformance,
        ]);
    }

    private function calculateGrade($score)
    {
        if ($score >= 90)
            return 'A+';
        if ($score >= 80)
            return 'A';
        if ($score >= 70)
            return 'B';
        if ($score >= 60)
            return 'C';
        if ($score >= 50)
            return 'D';
        return 'F';
    }

    /**
     * Manage student results - view and edit marks by grade and section
     */
    public function manageResults(Request $request)
    {
        $teacher = auth()->user()->teacher;
        $academicYear = AcademicYear::whereRaw('is_current = true')->first();

        if (!$teacher || !$academicYear) {
            return redirect()->back()->with('error', 'Teacher profile or academic year not found.');
        }

        // Get grades teacher teaches
        $grades = Grade::whereIn('level', [9, 10, 11, 12])
            ->orderBy('level')
            ->get()
            ->map(function ($grade) use ($teacher, $academicYear) {
                $sections = TeacherAssignment::with(['section.stream'])
                    ->where('teacher_id', $teacher->id)
                    ->where('grade_id', $grade->id)
                    ->where('academic_year_id', $academicYear->id)
                    ->get()
                    ->pluck('section')
                    ->unique('id')
                    ->values();

                return [
                    'id' => $grade->id,
                    'name' => $grade->name,
                    'level' => $grade->level,
                    'sections' => $sections,
                ];
            })
            ->filter(function ($grade) {
                return $grade['sections']->isNotEmpty();
            })
            ->values();

        // If grade and section are selected, get students with result status
        $studentsData = null;
        $selectedGrade = null;
        $selectedSection = null;
        $subjects = [];

        if ($request->has('grade_id')) {
            $gradeId = $request->grade_id;
            $selectedGrade = Grade::find($gradeId);

            if ($request->has('section_id')) {
                $sectionId = $request->section_id;
                $semesterFilter = $request->input('semester');

                $selectedSection = Section::find($sectionId);

                // Get subjects teacher teaches for this grade/section
                $subjects = TeacherAssignment::with('subject')
                    ->where('teacher_id', $teacher->id)
                    ->where('grade_id', $gradeId)
                    ->where('section_id', $sectionId)
                    ->get()
                    ->pluck('subject')
                    ->unique('id')
                    ->values();

                // Get students in this section
                $students = Student::with('user')
                    ->where('grade_id', $gradeId)
                    ->where('section_id', $sectionId)
                    ->orderBy('student_id')
                    ->get();

                // Get assessments for each subject
                $assessmentsBySubject = [];
                foreach ($subjects as $subject) {
                    $assessmentsQuery = Assessment::where('grade_id', $gradeId)
                        ->where('section_id', $sectionId)
                        ->where('subject_id', $subject->id)
                        ->where('academic_year_id', $academicYear->id);

                    if ($semesterFilter) {
                        $assessmentsQuery->bySemester($semesterFilter);
                    }

                    $assessments = $assessmentsQuery->get();

                    $assessmentsBySubject[$subject->id] = $assessments;
                }

                // Get all marks for these students
                $marksQuery = Mark::whereIn('student_id', $students->pluck('id'))
                    ->where('grade_id', $gradeId)
                    ->where('section_id', $sectionId)
                    ->whereNotNull('assessment_id');

                if ($semesterFilter) {
                    $marksQuery->bySemester($semesterFilter);
                }

                $marks = $marksQuery->get()
                    ->groupBy('student_id');

                // Get semester statuses for the selected grade
                $semesterStatuses = [
                    1 => SemesterStatus::isOpen($gradeId, 1),
                    2 => SemesterStatus::isOpen($gradeId, 2),
                ];

                // Build student data with result status
                $studentsData = $students->map(function ($student) use ($subjects, $marks, $assessmentsBySubject, $semesterStatuses) {
                    $studentMarks = $marks->get($student->id, collect());

                    $subjectStatus = [];
                    $totalFilled = 0;
                    $totalAssessments = 0;

                    foreach ($subjects as $subject) {
                        $subjectAssessments = $assessmentsBySubject[$subject->id] ?? collect();
                        $assessmentCount = $subjectAssessments->count();
                        $totalAssessments += $assessmentCount;

                        $filledCount = $studentMarks->where('subject_id', $subject->id)->count();
                        $totalFilled += $filledCount;

                        // Check if ANY assessment for this subject is in an open semester
                        $isEditable = false;
                        foreach ($subjectAssessments as $assessment) {
                            if (isset($semesterStatuses[$assessment->semester]) && $semesterStatuses[$assessment->semester]) {
                                $isEditable = true;
                                break;
                            }
                        }

                        $subjectStatus[$subject->id] = [
                            'filled' => $filledCount,
                            'total' => $assessmentCount,
                            'percentage' => $assessmentCount > 0 ? round(($filledCount / $assessmentCount) * 100) : 0,
                            'is_editable' => $isEditable,
                        ];
                    }

                    return [
                        'id' => $student->id,
                        'student_id' => $student->student_id,
                        'name' => $student->user->name ?? 'Unknown',
                        'gender' => $student->gender,
                        'subject_status' => $subjectStatus,
                        'total_filled' => $totalFilled,
                        'total_assessments' => $totalAssessments,
                        'completion_percentage' => $totalAssessments > 0 ? round(($totalFilled / $totalAssessments) * 100) : 0,
                    ];
                });
            }
        }

        return Inertia::render('Teacher/Students/ManageResults', [
            'grades' => $grades,
            'subjects' => $subjects,
            'students' => $studentsData,
            'selectedGrade' => $selectedGrade,
            'selectedSection' => $selectedSection,
            'academicYear' => $academicYear,
            'semesterStatuses' => $semesterStatuses ?? null,
            'selectedSemester' => $semesterFilter ?? null,
        ]);
    }
    /**
     * Show form to edit marks for a specific student and subject
     */
    public function editStudentResult(Request $request, $studentId, $subjectId)
    {
        $teacher = auth()->user()->teacher;
        $student = \App\Models\Student::with('user')->findOrFail($studentId);
        $subject = \App\Models\Subject::findOrFail($subjectId);

        // Security check: Ensure teacher has access to this student/subject
        // (Simplified check for now, can be expanded to check actual assignments)

        $currentAcademicYear = \App\Models\AcademicYear::whereRaw('is_current = true')->first();

        if (!$currentAcademicYear) {
            return redirect()->back()->with('error', 'No active academic year.');
        }

        // Get assessments for this subject/grade/section
        $assessments = \App\Models\Assessment::where('grade_id', $student->grade_id)
            ->where('section_id', $student->section_id)
            ->where('subject_id', $subjectId)
            ->where('academic_year_id', $currentAcademicYear->id)
            ->with('assessmentType')
            ->get();

        // Get existing marks
        $marks = Mark::where('student_id', $studentId)
            ->where('subject_id', $subjectId)
            ->where('academic_year_id', $currentAcademicYear->id)
            ->get()
            ->keyBy('assessment_id');

        // Check semester status for each assessment
        $assessmentsWithStatus = $assessments->map(function ($assessment) use ($student) {
            return [
                'id' => $assessment->id,
                'name' => $assessment->name,
                'type' => $assessment->assessmentType?->name ?? 'General',
                'max_score' => $assessment->max_score,
                'semester' => $assessment->semester,
                'is_open' => \App\Models\SemesterStatus::isOpen($student->grade_id, $assessment->semester),
            ];
        });

        return Inertia::render('Teacher/Students/EditResult', [
            'student' => $student,
            'subject' => $subject,
            'assessments' => $assessmentsWithStatus,
            'marks' => $marks,
            'grade' => $student->grade,
            'section' => $student->section,
        ]);
    }

    /**
     * Update marks for a student
     */
    public function updateStudentResult(Request $request, $studentId, $subjectId)
    {
        $request->validate([
            'marks' => 'required|array',
            'marks.*' => 'nullable|numeric|min:0',
        ]);

        $teacher = auth()->user()->teacher;
        $student = \App\Models\Student::findOrFail($studentId);
        $currentAcademicYear = \App\Models\AcademicYear::whereRaw('is_current = true')->first();

        if (!$currentAcademicYear) {
            return back()->withErrors(['error' => 'No active academic year.']);
        }

        \DB::beginTransaction();
        try {
            foreach ($request->marks as $assessmentId => $score) {
                if ($score === null || $score === '')
                    continue;

                $assessment = \App\Models\Assessment::findOrFail($assessmentId);

                // Semester Status Check
                if (!\App\Models\SemesterStatus::isOpen($student->grade_id, $assessment->semester)) {
                    throw new \Exception("Cannot update marks for Semester {$assessment->semester} (Closed).");
                }

                // Max Score Check
                if ($score > $assessment->max_score) {
                    throw new \Exception("Score $score exceeds max {$assessment->max_score} for {$assessment->name}.");
                }

                // Update or Create Mark
                $mark = Mark::updateOrCreate(
                    [
                        'student_id' => $studentId,
                        'assessment_id' => $assessmentId,
                        'subject_id' => $subjectId, // Ensure unique constraint match if present
                    ],
                    [
                        'score' => $score,
                        'max_score' => $assessment->max_score,
                        'teacher_id' => $teacher->id,
                        'grade_id' => $student->grade_id,
                        'section_id' => $student->section_id,
                        'academic_year_id' => $currentAcademicYear->id,
                        'semester' => $assessment->semester,
                        'is_submitted' => true,
                        'submitted_at' => now(),
                    ]
                );

                // Logging could be added here similar to DeclareResult
            }

            \DB::commit();

            // Invalidate semester rankings cache for all semesters affected
            $processedSemesters = collect();
            foreach ($request->marks as $assessmentId => $score) {
                if ($score === null || $score === '')
                    continue;
                $assessment = \App\Models\Assessment::find($assessmentId);
                if ($assessment) {
                    $processedSemesters->push($assessment->semester);
                }
            }

            // Invalidate cache for each unique semester
            foreach ($processedSemesters->unique() as $semester) {
                \App\Http\Controllers\SemesterRecordController::invalidateSemesterRankings(
                    $student->section_id,
                    $semester,
                    $currentAcademicYear->id
                );
            }

            return redirect()->route('teacher.students.manage-results', [
                'grade_id' => $student->grade_id,
                'section_id' => $student->section_id
            ])->with('success', 'Marks updated successfully.');

        } catch (\Exception $e) {
            \DB::rollBack();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
