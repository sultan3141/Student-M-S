<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Teacher;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class TestTeacherSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure Role Exists
        Role::firstOrCreate(['name' => 'teacher', 'guard_name' => 'web']);

        // 2. Create User
        $user = User::firstOrCreate(
            ['email' => 'teacher_test@example.com'],
            [
                'name' => 'Test Teacher',
                'password' => Hash::make('password'),
                'username' => 'teacher_test'
            ]
        );

        $user->assignRole('teacher');

        // 3. Create Teacher Profile
        Teacher::firstOrCreate(
            ['user_id' => $user->id],
            [
                'employee_id' => 'EMP-TEST-001',
                'qualification' => 'PhD',
                'specialization' => 'Computer Science',
                'phone' => '1234567890'
            ]
        );

        $this->command->info('Created/Updated Test Teacher: teacher_test@example.com / password');
    }
}
