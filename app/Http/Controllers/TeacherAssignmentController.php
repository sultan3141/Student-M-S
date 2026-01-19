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
        
        $subjects = $teacher->subjects()
            ->when($request->grade_id, function($q) use ($request) {
                return $q->wherePivot('grade_id', $request->grade_id);
            })
            ->when($request->section_id, function($q) use ($request) {
                return $q->wherePivot('section_id', $request->section_id);
            })
            ->get(['id', 'name', 'code']);
            
        return response()->json($subjects);
    }
    
    public function getStudents(Request $request)
    {
        $request->validate([
            'section_id' => 'required|exists:sections,id',
        ]);
        
        // Ensure teacher handles this section
        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
        // Add check logic here if needed

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
