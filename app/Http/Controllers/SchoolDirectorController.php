<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SchoolDirectorController extends Controller
{
    public function dashboard()
    {
        // specific stats for director
        $totalStudents = \App\Models\Student::count();
        $totalTeachers = \App\Models\Teacher::count();
        $newAdmissions = \App\Models\Admission::where('status', 'New')->count();
        
        return inertia('Director/Dashboard', [
            'stats' => [
                'students' => $totalStudents,
                'teachers' => $totalTeachers,
                'admissions' => $newAdmissions,
            ]
        ]);
    }

    public function teachersIndex()
    {
        $teachers = \App\Models\Teacher::with('user')->paginate(10);
        return inertia('Director/Teachers/Index', [
            'teachers' => $teachers,
        ]);
    }

    public function teachersCreate()
    {
        return inertia('Director/Teachers/Create');
    }

    public function teachersStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'qualification' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        // Create User
        $user = \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => \Illuminate\Support\Facades\Hash::make('password'), // Default password
        ]);

        $user->assignRole('teacher');

        // Create Teacher Profile
        \App\Models\Teacher::create([
            'user_id' => $user->id,
            'qualification' => $validated['qualification'],
            // Add phone if Teacher model supports it, otherwise exclude or add migration
        ]);

        return redirect()->route('director.teachers.index')->with('success', 'Teacher account created successfully.');
    }

    /**
     * Show teacher assignments management page
     */
    public function teacherAssignments()
    {
        $teachers = \App\Models\Teacher::with(['user', 'assignments.grade', 'assignments.section', 'assignments.subject'])
            ->get()
            ->map(function ($teacher) {
                return [
                    'id' => $teacher->id,
                    'name' => $teacher->user->name,
                    'email' => $teacher->user->email,
                    'employee_id' => $teacher->employee_id,
                    'assignments' => $teacher->assignments->map(function ($assignment) {
                        return [
                            'id' => $assignment->id,
                            'subject' => $assignment->subject->name,
                            'grade' => $assignment->grade->name,
                            'section' => $assignment->section->name,
                            'academic_year_id' => $assignment->academic_year_id,
                        ];
                    }),
                ];
            });

        $grades = \App\Models\Grade::with('sections')->get();
        $subjects = \App\Models\Subject::all();
        $academicYears = \App\Models\AcademicYear::all();

        return inertia('Director/Teachers/Assignments', [
            'teachers' => $teachers,
            'grades' => $grades,
            'subjects' => $subjects,
            'academicYears' => $academicYears,
        ]);
    }

    /**
     * Assign teacher to grade, section, and subject
     */
    public function assignTeacher(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'subject_id' => 'required|exists:subjects,id',
            'grade_id' => 'required|exists:grades,id',
            'section_id' => 'required|exists:sections,id',
            'academic_year_id' => 'required|exists:academic_years,id',
        ]);

        // Check if assignment already exists
        $existingAssignment = \App\Models\TeacherAssignment::where([
            'teacher_id' => $validated['teacher_id'],
            'subject_id' => $validated['subject_id'],
            'grade_id' => $validated['grade_id'],
            'section_id' => $validated['section_id'],
            'academic_year_id' => $validated['academic_year_id'],
        ])->first();

        if ($existingAssignment) {
            return back()->withErrors(['assignment' => 'This assignment already exists.']);
        }

        \App\Models\TeacherAssignment::create($validated);

        return back()->with('success', 'Teacher assigned successfully.');
    }

    /**
     * Remove teacher assignment
     */
    public function removeTeacherAssignment($assignmentId)
    {
        $assignment = \App\Models\TeacherAssignment::findOrFail($assignmentId);
        $assignment->delete();

        return back()->with('success', 'Teacher assignment removed successfully.');
    }

    /**
     * Get sections for a specific grade (AJAX endpoint)
     */
    public function getSectionsByGrade($gradeId)
    {
        $sections = \App\Models\Section::where('grade_id', $gradeId)->get(['id', 'name']);
        return response()->json($sections);
    }
}
