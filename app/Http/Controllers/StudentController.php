<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function dashboard()
    {
        // Get the authenticated user's student profile
        $user = auth()->user();
        $student = $user->student; 

        if (!$student) {
            abort(403, 'User is not linked to a student profile.');
        }

        // Load grade, section, and academic year info
        $student->load(['grade', 'section', 'parent']);
        
        $subjects = \App\Models\Subject::where('grade_id', $student->grade_id)->get();

        return inertia('Student/Dashboard', [
            'student' => $student,
            'subjects' => $subjects,
            'academicYear' => \App\Models\AcademicYear::where('status', 'active')->first(),
        ]);
    }
}
