<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherClassController extends Controller
{
    /**
     * Display a listing of the teacher's classes.
     */
    public function index()
    {
        // Mock data for classes
        $classes = [
            [
                'id' => 1,
                'name' => 'Mathematics 10A',
                'code' => 'MATH-10A',
                'students_count' => 32,
                'average_score' => 78.5,
                'completion_rate' => 85,
                'next_deadline' => 'Final Exam',
                'deadline_date' => '2026-01-25',
                'days_remaining' => 7,
                'attendance_rate' => 92,
                'pending_marks' => 5,
            ],
            [
                'id' => 2,
                'name' => 'Mathematics 10B',
                'code' => 'MATH-10B',
                'students_count' => 28,
                'average_score' => 72.3,
                'completion_rate' => 78,
                'next_deadline' => 'Midterm Exam',
                'deadline_date' => '2026-01-22',
                'days_remaining' => 4,
                'attendance_rate' => 88,
                'pending_marks' => 12,
            ],
            [
                'id' => 3,
                'name' => 'Physics 11A',
                'code' => 'PHY-11A',
                'students_count' => 25,
                'average_score' => 81.2,
                'completion_rate' => 92,
                'next_deadline' => 'Lab Report',
                'deadline_date' => '2026-01-20',
                'days_remaining' => 2,
                'attendance_rate' => 95,
                'pending_marks' => 0,
            ],
        ];

        return Inertia::render('Teacher/Classes/Index', [
            'classes' => $classes
        ]);
    }

    /**
     * Display detailed view of a specific class.
     */
    public function show($classId)
    {
        // Mock data for class details
        $class = [
            'id' => $classId,
            'name' => 'Mathematics 10A',
            'code' => 'MATH-10A',
            'description' => 'Advanced Mathematics for Grade 10',
            'semester' => 'Fall 2025',
            'room' => 'Room 204',
            'schedule' => 'Mon, Wed, Fri 9:00 AM - 10:30 AM',
        ];

        $students = [
            ['id' => 1, 'name' => 'John Doe', 'score' => 85, 'attendance' => 92],
            ['id' => 2, 'name' => 'Jane Smith', 'score' => 78, 'attendance' => 88],
            ['id' => 3, 'name' => 'Alice Johnson', 'score' => 92, 'attendance' => 95],
            // More students...
        ];

        $performance = [
            'average' => 78.5,
            'highest' => 95,
            'lowest' => 45,
            'pass_rate' => 82,
        ];

        return Inertia::render('Teacher/Classes/Show', [
            'class' => $class,
            'students' => $students,
            'performance' => $performance,
        ]);
    }

    /**
     * Get grades taught by the teacher with section counts.
     * For the mark management wizard - Step 1: Grade Selection
     */
    public function getTeacherGrades()
    {
        $teacherId = auth()->user()->teacher->id;
        
        // Get unique grades the teacher teaches
        $grades = \App\Models\Grade::whereHas('sections.subjects.teachers', function ($query) use ($teacherId) {
            $query->where('teachers.id', $teacherId);
        })->with('sections')->get();

        $gradeData = $grades->map(function ($grade) use ($teacherId) {
            $sectionCount = \App\Models\Section::where('grade_id', $grade->id)
                ->whereHas('subjects.teachers', function ($query) use ($teacherId) {
                    $query->where('teachers.id', $teacherId);
                })->count();

            return [
                'id' => $grade->id,
                'name' => $grade->name,
                'level' => $grade->level, // 9, 10, 11, or 12
                'section_count' => $sectionCount,
            ];
        });

        return response()->json($gradeData);
    }

    /**
     * Get sections by grade with student counts, schedules, and completion status.
     * For the mark management wizard - Step 2: Section Selection
     */
    public function getSectionsByGrade($gradeId)
    {
        $teacherId = auth()->user()->teacher->id;

        $sections = \App\Models\Section::where('grade_id', $gradeId)
            ->whereHas('subjects.teachers', function ($query) use ($teacherId) {
                $query->where('teachers.id', $teacherId);
            })
            ->with(['students', 'assessments'])
            ->get();

        $sectionData = $sections->map(function ($section) {
            $totalStudents = $section->students->count();
            
            // Calculate completion status based on recent assessments
            $recentAssessments = $section->assessments()->latest()->take(5)->get();
            $completedAssessments = $recentAssessments->filter(fn($a) => $a->status === 'published')->count();
            $totalAssessments = $recentAssessments->count();
            
            $status = 'pending';
            if ($totalAssessments > 0) {
                $completionRate = ($completedAssessments / $totalAssessments) * 100;
                if ($completionRate === 100) {
                    $status = 'complete';
                } elseif ($completionRate > 0) {
                    $status = 'partial';
                }
            }

            // Mock schedule and room data (replace with actual data if available)
            $schedule = 'Mon, Wed, Fri';
            $room = 'Room ' . (200 + $section->id);

            return [
                'id' => $section->id,
                'name' => $section->name,
                'student_count' => $totalStudents,
                'schedule' => $schedule,
                'room' => $room,
                'status' => $status,
                'last_updated' => $section->updated_at->diffForHumans(),
                'updated_at_raw' => $section->updated_at,
            ];
        });

        return response()->json($sectionData);
    }

    /**
     * Get subjects by section.
     * For the mark management wizard - Step 3: Subject Selection
     */
    public function getSubjectsBySection($sectionId)
    {
        $teacherId = auth()->user()->teacher->id;

        $subjects = \App\Models\Subject::whereHas('teachers', function ($query) use ($teacherId, $sectionId) {
            $query->where('teachers.id', $teacherId);
        })->get();

        $subjectData = $subjects->map(function ($subject) {
            return [
                'id' => $subject->id,
                'name' => $subject->name,
                'code' => $subject->code ?? 'N/A',
            ];
        });

        return response()->json($subjectData);
    }

    /**
     * Get assessments by subject and semester.
     * For the mark management wizard - Step 4: Assessment Selection
     */
    public function getAssessmentsBySubject($subjectId, $semester)
    {
        $teacherId = auth()->user()->teacher->id;

        $assessments = \App\Models\Assessment::where('subject_id', $subjectId)
            ->where('semester', $semester)
            ->forTeacher($teacherId)
            ->with(['assessmentType', 'section'])
            ->get();

        $assessmentData = $assessments->map(function ($assessment) {
            $totalStudents = \App\Models\Student::where('section_id', $assessment->section_id)->count();
            $marksEntered = $assessment->marks()->whereNotNull('marks_obtained')->count();

            return [
                'id' => $assessment->id,
                'name' => $assessment->name,
                'type' => $assessment->assessmentType->name ?? 'Assessment',
                'weight' => $assessment->weight_percentage,
                'due_date' => $assessment->due_date?->format('M d'),
                'status' => $marksEntered === $totalStudents ? 'complete' : 'pending',
                'marks_entered' => $marksEntered,
                'total_students' => $totalStudents,
            ];
        });

        return response()->json($assessmentData);
    }
}
