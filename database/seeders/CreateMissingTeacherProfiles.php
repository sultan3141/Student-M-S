<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Teacher;

class CreateMissingTeacherProfiles extends Seeder
{
    public function run()
    {
        // Find all users with teacher role but no teacher profile
        $teacherUsers = User::role('teacher')->get();
        
        $created = 0;
        $existing = 0;
        
        foreach ($teacherUsers as $user) {
            $teacher = Teacher::where('user_id', $user->id)->first();
            
            if (!$teacher) {
                Teacher::create([
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
                
                $this->command->info("Created teacher profile for user: {$user->name} (ID: {$user->id})");
                $created++;
            } else {
                $existing++;
            }
        }
        
        $this->command->info("\nSummary:");
        $this->command->info("- Created: {$created} teacher profiles");
        $this->command->info("- Already existed: {$existing} teacher profiles");
        $this->command->info("- Total teacher users: " . $teacherUsers->count());
    }
}
