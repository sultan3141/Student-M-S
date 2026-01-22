<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;
use App\Models\Grade;
use App\Models\Section;

class FixStudentAliceSeeder extends Seeder
{
    public function run()
    {
        $user = User::where('username', 'student_alice')->first();
        
        if (!$user) {
            $this->command->error("User 'student_alice' not found!");
            return;
        }

        // Ensure we have at least one grade
        $grade = Grade::first();
        if (!$grade) {
            $grade = Grade::create([
                'name' => 'Grade 10',
                'level' => 10
            ]);
            $this->command->info("Created Grade 10");
        }

        // Ensure we have at least one section
        $section = Section::where('grade_id', $grade->id)->first();
        if (!$section) {
             $section = Section::create([
                 'name' => 'A',
                 'grade_id' => $grade->id,
                 'capacity' => 30
             ]);
             $this->command->info("Created Section A");
        }

        if (!Student::where('user_id', $user->id)->exists()) {
            Student::create([
                'user_id' => $user->id,
                'student_id' => 'STU-' . rand(10000, 99999),
                'grade_id' => $grade->id,
                'section_id' => $section->id,
                'dob' => '2010-01-01',
                'gender' => 'Female',
                'address' => '123 Fake St'
            ]);
            $this->command->info("✅ Student record created for 'student_alice'");
        } else {
            $this->command->info("ℹ️ Student record already exists for 'student_alice'");
        }
    }
}
