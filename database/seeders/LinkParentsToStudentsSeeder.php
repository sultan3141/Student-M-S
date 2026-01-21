<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\ParentProfile;
use App\Models\Student;
use Illuminate\Support\Facades\DB;

class LinkParentsToStudentsSeeder extends Seeder
{
    public function run(): void
    {
        // Get parent users
        $parent1 = User::where('username', 'parent_mary')->first();
        $parent2 = User::where('username', 'p_david')->first();
        
        if (!$parent1 || !$parent2) {
            $this->command->error('Parent users not found! Run UserSeeder first.');
            return;
        }

        // Create or get parent profiles
        $parentProfile1 = ParentProfile::firstOrCreate(
            ['user_id' => $parent1->id],
            [
                'phone' => '+251-911-123456',
                'address' => '789 Parent Street, Addis Ababa',
            ]
        );

        $parentProfile2 = ParentProfile::firstOrCreate(
            ['user_id' => $parent2->id],
            [
                'phone' => '+251-911-654321',
                'address' => '321 Guardian Avenue, Addis Ababa',
            ]
        );

        // Get student users
        $student1User = User::where('username', 'student_alice')->first();
        $student2User = User::where('username', 's_12345')->first();
        
        if (!$student1User || !$student2User) {
            $this->command->error('Student users not found! Run UserSeeder first.');
            return;
        }

        $student1 = $student1User->student;
        $student2 = $student2User->student;
        
        if (!$student1 || !$student2) {
            $this->command->error('Student records not found! Run StudentTestDataSeeder first.');
            return;
        }

        // Link parent1 (Mary) to student1 (Alice)
        if (!DB::table('parent_student')
            ->where('parent_id', $parentProfile1->id)
            ->where('student_id', $student1->id)
            ->exists()) {
            
            $parentProfile1->students()->attach($student1->id);
            $this->command->info("✅ Linked {$parent1->name} to {$student1User->name}");
        } else {
            $this->command->info("ℹ️  {$parent1->name} already linked to {$student1User->name}");
        }

        // Link parent2 (David) to student2 (Bob)
        if (!DB::table('parent_student')
            ->where('parent_id', $parentProfile2->id)
            ->where('student_id', $student2->id)
            ->exists()) {
            
            $parentProfile2->students()->attach($student2->id);
            $this->command->info("✅ Linked {$parent2->name} to {$student2User->name}");
        } else {
            $this->command->info("ℹ️  {$parent2->name} already linked to {$student2User->name}");
        }

        // Optional: Link parent1 to both students (if Mary is guardian of both)
        if (!DB::table('parent_student')
            ->where('parent_id', $parentProfile1->id)
            ->where('student_id', $student2->id)
            ->exists()) {
            
            $parentProfile1->students()->attach($student2->id);
            $this->command->info("✅ Also linked {$parent1->name} to {$student2User->name}");
        }

        $this->command->info('');
        $this->command->info('✅ Parent-Student relationships created successfully!');
        $this->command->info('');
        $this->command->info('Test Credentials:');
        $this->command->info('  Parent 1: username=parent_mary, password=password');
        $this->command->info('  Parent 2: username=p_david, password=password');
    }
}
