<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Teacher;
use Illuminate\Support\Facades\Hash;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create teacher user
        $user = User::firstOrCreate(
            ['username' => 'teacher_demo'],
            [
                'name' => 'Teacher Demo',
                'email' => 'teacher@school.com',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        // Create teacher profile
        Teacher::firstOrCreate(
            ['user_id' => $user->id],
            [
                'phone' => '+1234567890',
                'address' => '123 School Street',
                'bio' => 'Demo teacher account for testing the teacher dashboard.',
                'department' => 'Mathematics',
            ]
        );

        echo "Teacher account created successfully!\n";
        echo "Email: teacher@school.com\n";
        echo "Password: password123\n";
    }
}
