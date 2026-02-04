<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Teacher;

class CreateTeacherProfile extends Command
{
    protected $signature = 'teacher:create-profile {user_id}';
    protected $description = 'Create a teacher profile for a user';

    public function handle()
    {
        $userId = $this->argument('user_id');
        
        $user = User::find($userId);
        
        if (!$user) {
            $this->error("User with ID {$userId} not found.");
            return 1;
        }
        
        $this->info("User found: {$user->name} ({$user->email})");
        
        // Check if teacher profile exists
        $teacher = Teacher::where('user_id', $user->id)->first();
        
        if ($teacher) {
            $this->info("Teacher profile already exists (ID: {$teacher->id})");
            return 0;
        }
        
        $this->info("Creating teacher profile...");
        
        $teacher = Teacher::create([
            'user_id' => $user->id,
            'employee_id' => 'T' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
            'first_name' => $user->name,
            'last_name' => '',
            'email' => $user->email,
            'phone' => '',
            'date_of_birth' => null,
            'hire_date' => now(),
            'qualification' => '',
            'specialization' => '',
            'status' => 'active',
        ]);
        
        $this->info("Teacher profile created successfully (ID: {$teacher->id})");
        
        // Check if user has teacher role
        if (!$user->hasRole('teacher')) {
            $this->info("Adding teacher role to user...");
            $user->assignRole('teacher');
            $this->info("Teacher role assigned.");
        }
        
        $this->info("Done!");
        return 0;
    }
}
