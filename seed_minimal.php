<?php

use App\Models\User;
use App\Models\Student;
use App\Models\ParentProfile;
use App\Models\Grade;
use App\Models\Section;
use App\Models\Payment;
use App\Models\AcademicYear;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

echo "Starting Minimal Seeder...\n";

try {
    // 1. Grade/Section
    $g = Grade::firstOrCreate(['name' => 'Grade 10'], ['level' => 10]);
    $s = Section::firstOrCreate(['name' => 'A', 'grade_id' => $g->id], ['gender' => 'Male', 'capacity' => 40]);

    // 2. Academic Year
    $ay = AcademicYear::firstOrCreate(['name' => '2025-2026'], ['start_date' => '2025-09-01', 'end_date' => '2026-06-30', 'status' => 'active']);

    // 3. User & Student
    $u = User::create([
        'name' => 'Minimal Student',
        'email' => 'min.student.' . rand(1, 999) . '@demo.com',
        'password' => Hash::make('password')
    ]);

    $p = ParentProfile::create(['user_id' => $u->id]); // Self-parent for simplicity/speed

    $st = Student::create([
        'user_id' => $u->id,
        'student_id' => '2025-10-MINI',
        'gender' => 'Male',
        'parent_id' => $p->id,
        'grade_id' => $g->id,
        'section_id' => $s->id
    ]);

    // 4. Payment
    Payment::create([
        'student_id' => $st->id,
        'academic_year_id' => $ay->id,
        'amount' => 500.00,
        'type' => 'Monthly',
        'status' => 'Paid',
        'transaction_date' => now()
    ]);

    echo "Minimal Data Seeded!\n";

} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
