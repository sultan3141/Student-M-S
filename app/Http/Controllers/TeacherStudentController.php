<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Mark;
use App\Models\Ranking;

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

    /**
     * Display detailed performance analytics for a specific student.
     */
    public function show($studentId)
    {
        $academicYear = \App\Models\AcademicYear::where('is_current', true)->first();
        $student = \App\Models\Student::with(['user', 'grade', 'section'])->findOrFail($studentId);
        
        // Get all marks for this student
        $allMarks = \App\Models\Mark::where('student_id', $studentId)
            ->where('academic_year_id', $academicYear->id)
            ->with(['subject', 'assessment'])
            ->get();

        // Calculate subject performance
        $subjectPerformance = $allMarks->groupBy('subject_id')->map(function ($subjectMarks) {
            $subject = $subjectMarks->first()->subject;
            $avg = $subjectMarks->avg('score');
            return [
                'subject' => $subject->name,
                'score' => round($avg, 1),
                'letter' => $this->calculateGrade($avg)
            ];
        })->values();

        // Calculate history for trend chart
        $performanceHistory = $allMarks->filter(function($mark) {
            return $mark->assessment_id !== null;
        })->map(function ($mark) {
            // In a real scenario, we'd calculate the class average for this assessment here
            // For now, we'll use a fixed comparative value or null
            return [
                'assessment' => $mark->assessment->name,
                'score' => $mark->score,
                'average' => $mark->assessment->max_score / 2, // Mock average for now
                'date' => $mark->created_at->format('Y-m-d'),
            ];
        })->values();

        $overallAverage = $allMarks->avg('score');

        $studentInfo = [
            'id' => $student->id,
            'student_id' => $student->student_id,
            'name' => $student->user->name,
            'class' => $student->grade->name . ' - ' . $student->section->name,
            'email' => $student->user->email,
            'parent_email' => $student->parent && $student->parent->user ? $student->parent->user->email : 'N/A',
            'average' => $overallAverage ? round($overallAverage, 1) : 0,
        ];

        return Inertia::render('Teacher/Students/Show', [
            'student' => $studentInfo,
            'history' => $performanceHistory,
            'subjects' => $subjectPerformance,
        ]);
    }

    private function calculateGrade($score) {
        if ($score >= 90) return 'A+';
        if ($score >= 80) return 'A';
        if ($score >= 70) return 'B';
        if ($score >= 60) return 'C';
        if ($score >= 50) return 'D';
        return 'F';
    }

    /**
     * Manage student results - view and edit marks by grade and section
     */
    public function manageResults(Request $request)
    {
        $teacher = auth()->user()->teacher;
        $academicYear = \App\Models\AcademicYear::where('is_current', true)->first();

        if (!$teacher || !$academicYear) {
            return redirect()->back()->with('error', 'Teacher profile or academic year not found.');
        }

        // Get grades teacher teaches
        $grades = \App\Models\Grade::whereIn('level', [9, 10, 11, 12])
            ->orderBy('level')
            ->get()
            ->map(function ($grade) use ($teacher, $academicYear) {
                $sections = \App\Models\TeacherAssignment::with(['section.stream'])
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

        if ($request->has('grade_id') && $request->has('section_id')) {
            $gradeId = $request->grade_id;
            $sectionId = $request->section_id;

            $selectedGrade = \App\Models\Grade::find($gradeId);
            $selectedSection = \App\Models\Section::find($sectionId);

            // Get subjects teacher teaches for this grade/section
            $subjects = \App\Models\TeacherAssignment::with('subject')
                ->where('teacher_id', $teacher->id)
                ->where('grade_id', $gradeId)
                ->where('section_id', $sectionId)
                ->get()
                ->pluck('subject')
                ->unique('id')
                ->map(function ($subject) {
                    return [
                        'id' => $subject->id,
                        'name' => $subject->name,
                        'code' => $subject->code,
                    ];
                })
                ->values();

            // Get students in this section
            $students = \App\Models\Student::with('user')
                ->where('grade_id', $gradeId)
                ->where('section_id', $sectionId)
                ->orderBy('student_id')
                ->get();

            // Get assessments for each subject
            $assessmentsBySubject = [];
            foreach ($subjects as $subject) {
                $assessments = \App\Models\Assessment::where('grade_id', $gradeId)
                    ->where('section_id', $sectionId)
                    ->where('subject_id', $subject['id'])
                    ->where('academic_year_id', $academicYear->id)
                    ->get();
                
                $assessmentsBySubject[$subject['id']] = $assessments;
            }

            // Get all marks for these students
            $marks = \App\Models\Mark::whereIn('student_id', $students->pluck('id'))
                ->where('grade_id', $gradeId)
                ->where('section_id', $sectionId)
                ->whereNotNull('assessment_id')
                ->get()
                ->groupBy('student_id');

            // Build student data with result status
            $studentsData = $students->map(function ($student) use ($subjects, $marks, $assessmentsBySubject) {
                $studentMarks = $marks->get($student->id, collect());
                
                $subjectStatus = [];
                $totalFilled = 0;
                $totalAssessments = 0;

                foreach ($subjects as $subject) {
                    $subjectAssessments = $assessmentsBySubject[$subject['id']] ?? collect();
                    $assessmentCount = $subjectAssessments->count();
                    $totalAssessments += $assessmentCount;

                    $filledCount = $studentMarks->where('subject_id', $subject['id'])->count();
                    $totalFilled += $filledCount;

                    $subjectStatus[$subject['id']] = [
                        'filled' => $filledCount,
                        'total' => $assessmentCount,
                        'percentage' => $assessmentCount > 0 ? round(($filledCount / $assessmentCount) * 100) : 0,
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

        return Inertia::render('Teacher/Students/ManageResults', [
            'grades' => $grades,
            'subjects' => $subjects,
            'students' => $studentsData,
            'selectedGrade' => $selectedGrade,
            'selectedSection' => $selectedSection,
            'academicYear' => $academicYear,
        ]);
    }
}
