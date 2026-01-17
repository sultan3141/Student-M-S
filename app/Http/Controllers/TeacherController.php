<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        // Ensure user has teacher role check hidden in middleware usually
        
        // Detailed teacher profile if needed
        // $teacher = $user->teacher; 

        return inertia('Teacher/Dashboard', [
            'academicYear' => \App\Models\AcademicYear::where('status', 'active')->first(),
        ]);
    }

    public function marksIndex()
    {
        // Fetch classes/sections assigned to teacher (Mocking for now as assignments table not fully built/seeded)
        // Ideally: $teacher->sections / $teacher->subjects
        // For demo: Fetch all sections
        $sections = \App\Models\Section::with('grade')->get();
        
        return inertia('Teacher/Marks/Index', [
            'sections' => $sections,
        ]);
    }

    public function marksCreate(Request $request)
    {
        $section = \App\Models\Section::with(['grade', 'grade.subjects'])->findOrFail($request->section_id);
        $subject = \App\Models\Subject::findOrFail($request->subject_id);
        
        // Fetch students in this section
        $students = \App\Models\Student::where('section_id', $section->id)
            ->with('user')
            ->orderBy('student_id')
            ->get();

        return inertia('Teacher/Marks/Create', [
            'section' => $section,
            'subject' => $subject,
            'students' => $students,
            'assessmentTypes' => ['Test 1', 'Test 2', 'Midterm', 'Final Exam', 'Assignment'],
        ]);
    }

    public function marksStore(Request $request)
    {
        $validated = $request->validate([
            'section_id' => 'required',
            'subject_id' => 'required',
            'semester' => 'required',
            'assessment_type' => 'required',
            'marks' => 'required|array', // [student_id => score]
            'marks.*' => 'nullable|numeric|min:0|max:100',
        ]);

        $academicYear = \App\Models\AcademicYear::where('status', 'active')->first();

        foreach ($validated['marks'] as $studentId => $score) {
            if ($score !== null) {
                \App\Models\Mark::updateOrCreate(
                    [
                        'student_id' => $studentId, 
                        'subject_id' => $validated['subject_id'],
                        'academic_year_id' => $academicYear->id,
                        'semester' => $validated['semester'],
                        'assessment_type' => $validated['assessment_type'],
                    ],
                    ['score_obtained' => $score, 'max_score' => 100]
                );
            }
        }

        return redirect()->route('teacher.marks.index')->with('success', 'Marks saved successfully.');
    }
}
