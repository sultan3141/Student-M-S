<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\ParentProfile;
use App\Models\Student;
use App\Models\AssessmentType;
use App\Models\AcademicYear;
use App\Models\Grade;
use App\Models\Section;
use App\Models\Subject;
use App\Models\Mark;
use Illuminate\Support\Facades\Hash;

class ParentPortalSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Assessment Types
        $types = ['Midterm', 'Test 1', 'Test 2', 'Assignment', 'Final'];
        $typeModels = [];
        foreach ($types as $type) {
            $typeModels[$type] = AssessmentType::firstOrCreate(
                ['name' => $type],
                ['weight_percentage' => 20] // Default weight
            );
        }

        // 2. Create Academic Structure
        $year = AcademicYear::firstOrCreate(
            ['name' => '2025-2026'],
            [
                'status' => 'active', 
                'start_date' => '2025-09-01', 
                'end_date' => '2026-06-30'
            ]
        );
        
        $grade = Grade::firstOrCreate(['name' => 'Grade 10'], ['level' => 10]);
        $section = Section::firstOrCreate(['name' => 'A', 'grade_id' => $grade->id]);
        
        // Create Subjects
        $subjects = [
            'Mathematics' => 'MTH101',
            'Physics' => 'PHY101',
            'Chemistry' => 'CHM101',
            'Biology' => 'BIO101',
            'English' => 'ENG101',
            'Amharic' => 'AMH101',
            'Civics' => 'CIV101'
        ];
        
        $subjectModels = [];
        foreach ($subjects as $name => $code) {
            $subjectModels[$name] = Subject::firstOrCreate(['code' => $code], ['name' => $name, 'grade_id' => $grade->id]);
        }

        // 3. Create Parent User & Role
        if (!\Spatie\Permission\Models\Role::where('name', 'parent')->exists()) {
            \Spatie\Permission\Models\Role::create(['name' => 'parent']);
        }

        $parentUser = User::firstOrCreate(
            ['username' => 'parent_mary'],
            [
                'name' => 'Mrs. Chen',
                'email' => 'parent@example.com',
                'password' => Hash::make('password'),
            ]
        );
        $parentUser->assignRole('parent');

        $parentProfile = ParentProfile::firstOrCreate(
            ['user_id' => $parentUser->id],
            [
                'phone' => '123-456-7890',
                'address' => '123 Family Lane',
            ]
        );

        // 4. Create Student
        $student = Student::firstOrCreate(
            ['student_id' => 'STU-2025-045'],
            [
                'user_id' => User::factory()->create()->id,
                'parent_id' => $parentProfile->id,
                'grade_id' => $grade->id,
                'section_id' => $section->id,
                'dob' => '2009-05-15',
                'gender' => 'Male',
            ]
        );

        if (!$parentProfile->students()->where('students.id', $student->id)->exists()) {
            $parentProfile->students()->attach($student->id);
        }

        // 5. Create Marks with Realistic Data & Comments
        $comments = [
            'Mathematics' => 'Michael shows strong problem-solving skills.',
            'Physics' => 'Good understanding of concepts, needs more practice on formulas.',
            'Chemistry' => 'Excellent lab work and theoretical knowledge.',
            'English' => 'Participates well in class discussions.',
            'Biology' => 'Very detailed diagrams and notes.',
            'Amharic' => 'Excellent reading comprehension.',
            'Civics' => 'Active participant in debates.'
        ];

        foreach ($subjectModels as $subjectName => $subject) {
            // Semester 1 (Completed)
            foreach ($typeModels as $typeName => $type) {
                Mark::create([
                    'student_id' => $student->id,
                    'subject_id' => $subject->id,
                    'academic_year_id' => $year->id,
                    'semester' => '1',
                    'assessment_type_id' => $type->id,
                    'score' => fake()->numberBetween(75, 95),
                    'comment' => ($typeName === 'Final') ? ($comments[$subjectName] ?? 'Good effort.') : null,
                ]);
            }
            // Semester 2 (Ongoing)
            foreach (['Midterm', 'Test 1'] as $typeName) {
                Mark::create([
                    'student_id' => $student->id,
                    'subject_id' => $subject->id,
                    'academic_year_id' => $year->id,
                    'semester' => '2',
                    'assessment_type_id' => $typeModels[$typeName]->id,
                    'score' => fake()->numberBetween(80, 98),
                    'comment' => null,
                ]);
            }
        }
    }
}
