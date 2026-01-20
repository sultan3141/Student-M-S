<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure Roles Exist First
        $roles = ['admin', 'teacher', 'student', 'parent', 'registrar'];
        foreach ($roles as $role) {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        // Admin User
        $admin = User::firstOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email' => null,
            ]
        );
        $admin->assignRole('admin');

        // Registrar User
        $registrar = User::firstOrCreate(
            ['username' => 'registrar_jane'],
            [
                'name' => 'Jane Registrar',
                'password' => Hash::make('password'),
                'email' => null,
            ]
        );
        $registrar->assignRole('registrar');

        // Teacher Users
        $teacher1 = User::firstOrCreate(
            ['username' => 'teacher_john'],
            [
                'name' => 'John Smith',
                'password' => Hash::make('password'),
                'email' => null,
            ]
        );
        $teacher1->assignRole('teacher');
        
        // Create teacher record for John
        \App\Models\Teacher::updateOrCreate(
            ['user_id' => $teacher1->id],
            [
                'employee_id' => 'TCH-2024-001',
                'specialization' => 'Mathematics',
                'phone' => '0911111111',
                'department' => 'Science',
            ]
        );

        $teacher2 = User::firstOrCreate(
            ['username' => 't_sarah'],
            [
                'name' => 'Sarah Johnson',
                'password' => Hash::make('password'),
                'email' => null,
            ]
        );
        $teacher2->assignRole('teacher');
        
        // Create teacher record for Sarah
        \App\Models\Teacher::updateOrCreate(
            ['user_id' => $teacher2->id],
            [
                'employee_id' => 'TCH-2024-002',
                'specialization' => 'English',
                'phone' => '0922222222',
                'department' => 'Languages',
            ]
        );

        // Student Users
        $student1 = User::firstOrCreate(
            ['username' => 'student_alice'],
            [
                'name' => 'Alice Brown',
                'password' => Hash::make('password'),
                'email' => null,
            ]
        );
        $student1->assignRole('student');
        
        // Create student record for Alice
        $grade1 = \App\Models\Grade::where('level', 9)->first();
        $section1 = $grade1 ? \App\Models\Section::where('grade_id', $grade1->id)->first() : null;
        if ($grade1 && $section1) {
            \App\Models\Student::updateOrCreate(
                ['user_id' => $student1->id],
                [
                    'student_id' => 'STU-2024-001',
                    'dob' => '2009-05-15',
                    'gender' => 'Female',
                    'grade_id' => $grade1->id,
                    'section_id' => $section1->id,
                    'phone' => '0912345678',
                    'address' => '123 Main Street, Addis Ababa',
                ]
            );
        }

        $student2 = User::firstOrCreate(
            ['username' => 's_12345'],
            [
                'name' => 'Bob Wilson',
                'password' => Hash::make('password'),
                'email' => null,
            ]
        );
        $student2->assignRole('student');
        
        // Create student record for Bob
        $grade2 = \App\Models\Grade::where('level', 10)->first();
        $section2 = $grade2 ? \App\Models\Section::where('grade_id', $grade2->id)->first() : null;
        if ($grade2 && $section2) {
            \App\Models\Student::updateOrCreate(
                ['user_id' => $student2->id],
                [
                    'student_id' => 'STU-2024-002',
                    'dob' => '2008-08-20',
                    'gender' => 'Male',
                    'grade_id' => $grade2->id,
                    'section_id' => $section2->id,
                    'phone' => '0923456789',
                    'address' => '456 Second Avenue, Addis Ababa',
                ]
            );
        }

        // Parent Users
        $parent1 = User::firstOrCreate(
            ['username' => 'parent_mary'],
            [
                'name' => 'Mary Jones',
                'password' => Hash::make('password'),
                'email' => null,
            ]
        );
        $parent1->assignRole('parent');

        $parent2 = User::firstOrCreate(
            ['username' => 'p_david'],
            [
                'name' => 'David Lee',
                'password' => Hash::make('password'),
                'email' => null,
            ]
        );
        $parent2->assignRole('parent');

        $this->command->info('✅ Created 8 test users with valid roles');
    }
}
