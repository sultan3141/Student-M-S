<?php

use App\Models\User;
use App\Models\Student;
use App\Models\ParentProfile;
use App\Models\Grade;
use App\Models\Section;
use App\Models\Payment;
use App\Models\AcademicYear;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

echo "Starting Debug Seeder...\n";

try {
    DB::beginTransaction();

    // 0. Ensure Roles
    $roles = ['student', 'parent', 'admin', 'teacher', 'registrar'];
    foreach ($roles as $role) {
        Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
    }
    echo "Roles Checked/Created.\n";

    // 1. Ensure Academic Year
    $ay = AcademicYear::firstOrCreate(
        ['name' => '2025-2026'],
        ['start_date' => '2025-09-01', 'end_date' => '2026-06-30', 'status' => 'active']
    );
    echo "Academic Year: {$ay->name}\n";

    // 2. Ensure Grades
    if (Grade::count() == 0) {
        $grades = [9, 10, 11, 12];
        foreach ($grades as $level) {
            $g = Grade::create(['name' => "Grade $level", 'level' => $level]);
            Section::create(['name' => 'A', 'grade_id' => $g->id, 'gender' => 'Male', 'capacity' => 40]);
            Section::create(['name' => 'B', 'grade_id' => $g->id, 'gender' => 'Female', 'capacity' => 40]);
        }
        echo "Grades Created.\n";
    }

    // 3. Create Students
    $names = ['Ahmed Ali', 'Fatima Hassan', 'Omar Ibrahim', 'Zainab Yusuf', 'Bilal Mohammed'];
    $genders = ['Male', 'Female', 'Male', 'Female', 'Male'];

    foreach ($names as $index => $name) {
        $gender = $genders[$index];
        $emailBase = str_replace(' ', '.', strtolower($name));

        // Parent
        $parentUser = User::firstOrCreate(
            ['email' => $emailBase . '.parent@demo.com'],
            ['name' => "Parent of $name", 'password' => Hash::make('password')]
        );
        $parentUser->assignRole('parent');

        $parentProfile = ParentProfile::firstOrCreate(
            ['user_id' => $parentUser->id],
            ['phone' => '555-000' . $index, 'address' => '123 Test St']
        );

        // Student User
        $studentUser = User::firstOrCreate(
            ['email' => $emailBase . '@demo.com'],
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
            ]
        );

        // Payments
        Payment::create([
            'student_id' => $student->id,
            'academic_year_id' => $ay->id,
            'amount' => 1500.00,
            'type' => 'Monthly',
            'status' => $index % 2 == 0 ? 'Paid' : 'Pending',
            'transaction_date' => $index % 2 == 0 ? now() : null,
        ]);

        echo "Created: $name\n";
    }

    DB::commit();
    echo "SUCCESS: Demo Data Seeded!";

} catch (\Exception $e) {
    DB::rollBack();
    echo "ERROR: See laravel.log\n";
    \Illuminate\Support\Facades\Log::error($e);
}
