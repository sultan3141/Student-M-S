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
}
