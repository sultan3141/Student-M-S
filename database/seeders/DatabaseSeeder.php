<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            RoleSeeder::class,
            AcademicStructureSeeder::class,
            SubjectSeeder::class,
        ]);

        // Create Director User
        $director = User::factory()->create([
            'name' => 'School Director',
            'email' => 'director@school.com',
            'password' => bcrypt('password'),
        ]);
        $director->assignRole('school_director');

        // Create Registrar User
        $registrar = User::factory()->create([
            'name' => 'School Registrar',
            'email' => 'registrar@school.com',
            'password' => bcrypt('password'),
        ]);
        $registrar->assignRole('registrar');

        // Create Test User (Super Admin)
        $admin = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@school.com',
            'password' => bcrypt('password'),
        ]);
        $admin->assignRole('super_admin');
        // Give admin director access for simplicity in MVP
        $admin->assignRole('school_director');

        // Create Student User
        $studentUser = User::factory()->create([
            'name' => 'Ali Student',
            'email' => 'student@school.com',
            'password' => bcrypt('password'),
        ]);
        $studentUser->assignRole('student');
        
        // Create properties for student profile
        $grade = \App\Models\Grade::where('level', 10)->first();
        $section = \App\Models\Section::where('grade_id', $grade->id)->first();
        
        \App\Models\Student::create([
            'user_id' => $studentUser->id,
            'student_id' => 'STU-'.rand(1000,9999),
            'dob' => '2010-01-01',
            'gender' => 'Male',
            'grade_id' => $grade->id,
            'section_id' => $section->id,
            'phone' => '1234567890',
            'address' => '123 Student St',
        ]);
    }
}
