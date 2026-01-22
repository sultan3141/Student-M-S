<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Teacher;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;

class TeacherAssignmentController extends Controller
{
    public function getAssignedSubjects(Request $request)
    {
        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
        
        // Get subjects from teacher_assignments table only
        $query = $teacher->assignments()
            ->with(['subject', 'grade', 'section']);
            
        if ($request->grade_id) {
            $query->where('grade_id', $request->grade_id);
        }
        
        if ($request->section_id) {
            $query->where('section_id', $request->section_id);
        }
        
        $assignments = $query->get();
        
        $subjects = $assignments->map(function($assignment) {
            return [
                'id' => $assignment->subject->id,
                'name' => $assignment->subject->name,
                'code' => $assignment->subject->code,
                'grade_name' => $assignment->grade->name,
                'section_name' => $assignment->section->name,
            ];
        })->unique('id');
            
        return response()->json($subjects->values());
    }
    
    public function getStudents(Request $request)
    {
        $request->validate([
            'section_id' => 'required|exists:sections,id',
        ]);
        
        // Ensure teacher is assigned to this section
        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
        
        $hasAssignment = $teacher->assignments()
            ->where('section_id', $request->section_id)
            ->exists();
            
        if (!$hasAssignment) {
            return response()->json(['error' => 'You are not assigned to this section'], 403);
        }

        $students = Student::where('section_id', $request->section_id)
            ->with(['user:id,name,profile_photo_path'])
            ->get()
            ->map(function($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->user->name,
                    'student_id' => $student->student_id,
                    'student_id_number' => $student->student_id, // For frontend compatibility
                    'photo' => $student->user->profile_photo_path,
                ];
            });
            
        return response()->json($students);
    }
}
