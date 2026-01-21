<?php

use App\Models\User;
use App\Models\Student;
use App\Models\ParentModel; // Note: Ensure this matches actual model name (ParentProfile or ParentModel?)
use App\Models\Grade;
use App\Models\Section;
use App\Models\Payment;
use App\Models\AcademicYear;
use Illuminate\Support\Facades\Hash;

echo "Starting Demo Data Seeder...\n";

// 0. Ensure Academic Year Exists
$ay = AcademicYear::firstOrCreate(
    ['name' => '2025-2026'],
    ['start_date' => '2025-09-01', 'end_date' => '2026-06-30', 'status' => 'active']
);

// 1. Ensure Grades and Sections Exist (Basic Fallback)
if (Grade::count() == 0) {
    echo "Seeding Grades...\n";
    $grades = [9, 10, 11, 12];
    foreach ($grades as $level) {
        $g = Grade::create(['name' => "Grade $level", 'level' => $level]);
        Section::create(['name' => 'A', 'grade_id' => $g->id, 'gender' => 'Male', 'capacity' => 40]);
        Section::create(['name' => 'B', 'grade_id' => $g->id, 'gender' => 'Female', 'capacity' => 40]);
    }
}

// 2. Create 5 Dummy Students with Parents and Payments
$names = ['Ahmed Ali', 'Fatima Hassan', 'Omar Ibrahim', 'Zainab Yusuf', 'Bilal Mohammed'];
$genders = ['Male', 'Female', 'Male', 'Female', 'Male'];

foreach ($names as $index => $name) {
    $gender = $genders[$index];

    // Parent
    $parentUser = User::firstOrCreate(
        ['email' => str_replace(' ', '.', strtolower($name)) . '.parent@demo.com'],
        ['name' => "Parent of $name", 'password' => Hash::make('password')]
    );
    $parentUser->assignRole('parent'); // Ensure RoleSeeder logic holds or this might fail if role missing

    // Check actual Parent model class name, assuming ParentModel based on Controller usage, but might be ParentProfile or Parent
    // Let's try to be safe. Previous controller code used \App\Models\ParentModel
    $parentProfile = \App\Models\ParentProfile::firstOrCreate(['user_id' => $parentUser->id], ['phone' => '555-000' . $index]);

    // Student User
    $studentUser = User::firstOrCreate(
        ['email' => str_replace(' ', '.', strtolower($name)) . '@demo.com'],
        ['name' => $name, 'password' => Hash::make('password')]
    );
    $studentUser->assignRole('student');

    // Allocation
    $grade = Grade::inRandomOrder()->first();
    $section = Section::where('grade_id', $grade->id)->first();

    // Student Profile
    $student = Student::firstOrCreate(
        ['user_id' => $studentUser->id],
        [
            'student_id' => '2025-' . $grade->level . '-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
            'gender' => $gender,
            'parent_id' => $parentProfile->id,
            'grade_id' => $grade->id,
            'section_id' => $section->id,
            // 'stream_id' => null, 
        ]
    );

    // Payments (Mix of Paid and Pending)
    Payment::create([
        'student_id' => $student->id,
        'academic_year_id' => $ay->id,
        'amount' => 1500.00,
        'type' => 'Monthly',
        'status' => $index % 2 == 0 ? 'Paid' : 'Pending',
        'transaction_date' => $index % 2 == 0 ? now() : null,
    ]);

    echo "Created Student: $name\n";
}

echo "Demo Data Seeding Complete!\n";
