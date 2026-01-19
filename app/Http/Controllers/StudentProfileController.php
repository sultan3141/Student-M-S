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
            'phone' => ['nullable', 'string', 'min:10', 'regex:/^([0-9\s\-\+\(\)]*)$/'], // Detailed phone validation
            'national_id' => 'nullable|string|max:50',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:1024', // Max 1MB, specific formats
        ]);

        // Handle Profile Photo
        if ($request->hasFile('profile_photo')) {
            $path = $request->file('profile_photo')->store('profile-photos', 'public');
            $user->update(['profile_photo_path' => $path]);
        }

        // Update Student Record
        $student->update([
            'address' => $validated['address'] ?? $student->address,
            'phone' => $validated['phone'] ?? $student->phone,
            'national_id' => $validated['national_id'] ?? $student->national_id,
        ]);

        return back()->with('success', 'Profile updated successfully.');
    }

    public function editPassword()
    {
        return Inertia::render('Student/Profile/Password');
    }
}
