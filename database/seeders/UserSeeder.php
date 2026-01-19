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
        // Admin User
        $admin = User::create([
            'name' => 'Admin User',
            'username' => 'admin',
            'email' => null,
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('admin');

        // Registrar User
        $registrar = User::create([
            'name' => 'Jane Registrar',
            'username' => 'registrar_jane',
            'email' => null,
            'password' => Hash::make('password'),
        ]);
        $registrar->assignRole('registrar');

        // Teacher Users
        $teacher1 = User::create([
            'name' => 'John Smith',
            'username' => 'teacher_john',
            'email' => null,
            'password' => Hash::make('password'),
        ]);
        $teacher1->assignRole('teacher');

        $teacher2 = User::create([
            'name' => 'Sarah Johnson',
            'username' => 't_sarah',
            'email' => null,
            'password' => Hash::make('password'),
        ]);
        $teacher2->assignRole('teacher');

        // Student Users
        $student1 = User::create([
            'name' => 'Alice Brown',
            'username' => 'student_alice',
            'email' => null,
            'password' => Hash::make('password'),
        ]);
        $student1->assignRole('student');

        $student2 = User::create([
            'name' => 'Bob Wilson',
            'username' => 's_12345',
            'email' => null,
            'password' => Hash::make('password'),
        ]);
        $student2->assignRole('student');

        // Parent Users
        $parent1 = User::create([
            'name' => 'Mary Jones',
            'username' => 'parent_mary',
            'email' => null,
            'password' => Hash::make('password'),
        ]);
        $parent1->assignRole('parent');

        $parent2 = User::create([
            'name' => 'David Lee',
            'username' => 'p_david',
            'email' => null,
            'password' => Hash::make('password'),
        ]);
        $parent2->assignRole('parent');

        $this->command->info('✅ Created 8 test users with username-based authentication');
        $this->command->info('Default password for all users: password');
    }
}
