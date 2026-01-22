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
     * DEPRECATED: Teachers can no longer select grades - they work only with assigned sections
     * This method is kept for backward compatibility but returns empty data
     */
    public function getTeacherGrades()
    {
        // Teachers can no longer select grades independently
        // They can only work with sections assigned to them by school directorate
        return response()->json([]);
    }

    /**
     * Get all assigned sections for the teacher.
     * Teachers can only work with sections bound to them by school directorate
     * This is now the primary method for section selection
     */
    public function getAllAssignedSections()
    {
        $teacherId = auth()->user()->teacher->id;

        // Get sections only from teacher_assignments table (bound by school directorate)
        $sections = \App\Models\Section::whereHas('teacherAssignments', function ($query) use ($teacherId) {
            $query->where('teacher_id', $teacherId);
        })
            ->with(['grade', 'students', 'assessments'])
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

            // Mock schedule and room data
            $schedule = 'Mon, Wed, Fri';
            $room = 'Room ' . (200 + $section->id);

            return [
                'id' => $section->id,
                'name' => $section->name,
                'grade_name' => $section->grade->name,
                'full_name' => $section->grade->name . ' - ' . $section->name,
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
     * Get sections by grade with student counts, schedules, and completion status.
     * DEPRECATED: Teachers can no longer select grades - they work only with assigned sections
     * This method is kept for backward compatibility but returns empty data
     */
    public function getSectionsByGrade($gradeId)
    {
        // Teachers can no longer select grades independently
        // They can only work with sections assigned to them by school directorate
        return response()->json([]);
    }

    /**
     * Get subjects by section.
     * Only returns subjects that the teacher is assigned to teach in this section
     */
    public function getSubjectsBySection($sectionId)
    {
        $teacherId = auth()->user()->teacher->id;

        // Get subjects only from teacher_assignments for this specific section
        $subjects = \App\Models\Subject::whereHas('teacherAssignments', function ($query) use ($teacherId, $sectionId) {
            $query->where('teacher_id', $teacherId)
                  ->where('section_id', $sectionId);
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
