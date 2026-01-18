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

        $teacher2 = User::firstOrCreate(
            ['username' => 't_sarah'],
            [
                'name' => 'Sarah Johnson',
                'password' => Hash::make('password'),
                'email' => null,
            ]
        );
        $teacher2->assignRole('teacher');

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

        $student2 = User::firstOrCreate(
            ['username' => 's_12345'],
            [
                'name' => 'Bob Wilson',
                'password' => Hash::make('password'),
                'email' => null,
            ]
        );
        $student2->assignRole('student');

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
