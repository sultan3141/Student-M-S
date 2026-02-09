<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use App\Models\Teacher;

class TeacherProfileController extends Controller
{
    public function edit(Request $request)
    {
        return Inertia::render('Teacher/Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'teacher' => Teacher::where('user_id', Auth::id())->firstOrFail(),
        ]);
    }

    public function update(Request $request)
    {
        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'bio' => 'nullable|string|max:1000',
        ]);

        $user->fill($request->only('name', 'email'));

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        $teacher->update($request->only('phone', 'address', 'bio'));

        return redirect()->route('teacher.profile.edit');
    }

    public function updatePhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|max:1024', // 1MB Max
        ]);

        $user = $request->user();

        if ($request->hasFile('photo')) {
             $path = $request->file('photo')->store('profile-photos', 'public');
             $user->profile_photo_path = $path; // Assuming Jetstream/Fortify style or custom
             $user->save();
             
             // Or update teacher table if photo is there
             // $teacher->update(['photo' => $path]);
        }

        return back()->with('status', 'profile-photo-updated');
    }

    public function changePassword(Request $request)
    {
        return Inertia::render('Teacher/Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'teacher' => Teacher::where('user_id', Auth::id())->firstOrFail(),
            'initialTab' => 'password',
        ]);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = $request->user();

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('status', 'password-updated');
    }
}
