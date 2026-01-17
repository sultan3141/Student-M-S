<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentProfileController extends Controller
{
    public function edit()
    {
        $user = auth()->user();
        $student = $user->student;
        
        return inertia('Student/Profile', [
             'user' => $user,
             'student' => $student,
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();
        $student = $user->student;

        $validated = $request->validate([
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:20',
        ]);

        $student->update($validated);

        return back()->with('success', 'Profile updated successfully.');
    }
}
