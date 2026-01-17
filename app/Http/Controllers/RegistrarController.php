<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RegistrarController extends Controller
{
    public function dashboard()
    {
        return inertia('Registrar/Dashboard');
    }

    public function create()
    {
        return inertia('Registrar/CreateStudent', [
            // specific data like available grades or sections could be passed here
        ]);
    }

    public function store(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'gender' => 'required|in:Male,Female',
            'grade_level' => 'required|integer|in:9,10,11,12', 
            'parent_name' => 'required|string|max:255',
        ]);

        // 1. Find or Create Parent User (Simplified: Always create new for now, ideally check email/phone)
        // Creating a dummy email for parent based on name + random to avoid unique constraint issues in demo
        $parentUser = \App\Models\User::create([
            'name' => $validated['parent_name'],
            'email' => strtolower(str_replace(' ', '.', $validated['parent_name'])) . rand(100, 999) . '@parent.ipsms.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'), 
        ]);
        $parentUser->assignRole('parent');

        $parentProfile = \App\Models\ParentModel::create([
            'user_id' => $parentUser->id,
            // phone, address skipped for minimal entry
        ]);

        // 2. Create Student User
        $studentUser = \App\Models\User::create([
            'name' => $validated['name'],
            'email' => strtolower(str_replace(' ', '.', $validated['name'])) . rand(100, 999) . '@student.ipsms.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
        ]);
        $studentUser->assignRole('student');

        // 3. Section Assignment
        $grade = \App\Models\Grade::where('level', $validated['grade_level'])->first();
        // Simple logic: find first section matching gender
        $section = \App\Models\Section::where('grade_id', $grade->id)
                    ->where('gender', $validated['gender']) // Assuming strictly separate sections
                    ->first();
        
        // Fallback for mixed or if strictly separate not found (though Seeder ensures A/B exist)
        if (!$section) {
            $section = \App\Models\Section::where('grade_id', $grade->id)->first();
        }

        // 4. Generate Student ID (YYYY-GR-RAND)
        $studentId = date('Y') . '-' . $validated['grade_level'] . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

        // 5. Create Student Profile
        \App\Models\Student::create([
            'user_id' => $studentUser->id,
            'student_id' => $studentId,
            'gender' => $validated['gender'],
            'parent_id' => $parentProfile->id,
            'grade_id' => $grade->id,
            'section_id' => $section->id,
        ]);

        return redirect()->route('registrar.dashboard')->with('success', "Student $studentId registered successfully in Class {$grade->name} Section {$section->name}.");
    }
}
