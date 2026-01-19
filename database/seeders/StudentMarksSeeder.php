<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;
use App\Models\Subject;
use App\Models\AcademicYear;
use App\Models\Mark;
use App\Models\AssessmentType;

class StudentMarksSeeder extends Seeder
{
    public function run(): void
    {
        // Find the student_alice user
        $user = User::where('username', 'student_alice')->first();
        
        if (!$user) {
            $this->command->error("User 'student_alice' not found!");
            return;
        }

        $student = Student::where('user_id', $user->id)->first();
        
        if (!$student) {
            $this->command->error("Student record not found for 'student_alice'!");
            return;
        }

        // Get or create the active academic year
        $academicYear = AcademicYear::firstOrCreate(
            ['status' => 'active'],
            [
                'name' => '2025-2026',
                'start_date' => '2025-09-01',
                'end_date' => '2026-06-30'
            ]
        );

        // Get all subjects for the student's grade
        $subjects = Subject::where('grade_id', $student->grade_id)->get();

        if ($subjects->isEmpty()) {
            $this->command->error("No subjects found for this student's grade!");
            return;
        }

        // Create or get assessment types
        $assessmentTypes = [
            'Assignment' => 10,
            'Quiz' => 10,
            'Midterm' => 20,
            'Final Exam' => 60,
        ];

        $types = [];
        foreach ($assessmentTypes as $name => $weight) {
            $types[$name] = AssessmentType::firstOrCreate(
                ['name' => $name],
                ['weight_percentage' => $weight]
            );
        }

        // Delete existing marks for this student to avoid duplicates
        Mark::where('student_id', $student->id)->delete();

        // Create marks for each subject
        $this->command->info("Creating marks for student: {$user->name}");

        foreach ($subjects as $subject) {
            // Generate realistic scores (between 70-95 for variety)
            $baseScore = rand(70, 95);
            
            foreach ($types as $typeName => $type) {
                // Create slight variations in scores
                $scoreValue = min(100, max(0, $baseScore + rand(-10, 10)));
                
                Mark::create([
                    'student_id' => $student->id,
                    'subject_id' => $subject->id,
                    'academic_year_id' => $academicYear->id,
                    'semester' => '1',
                    'assessment_type' => $typeName,
                    'score' => $scoreValue,
                ]);
            }
            
            $this->command->info("  ✓ Created marks for: {$subject->name}");
        }

        $this->command->info("✅ Successfully created marks for " . $subjects->count() . " subjects!");
    }

    private function getRandomComment($score): ?string
    {
        if ($score >= 90) {
            $comments = [
                'Excellent work! Keep it up.',
                'Outstanding performance.',
                'Exceptional understanding of the subject.',
                'Brilliant work, well done!',
            ];
        } elseif ($score >= 80) {
            $comments = [
                'Very good work.',
                'Good understanding of concepts.',
                'Well done, keep practicing.',
                'Nice progress!',
            ];
        } elseif ($score >= 70) {
            $comments = [
                'Good effort, needs more practice.',
                'Satisfactory performance.',
                'Keep working hard.',
                'Good progress, can improve.',
            ];
        } else {
            $comments = [
                'Needs improvement.',
                'Requires more attention to detail.',
                'Please see me for extra help.',
                'More practice needed.',
            ];
        }

        return rand(0, 1) ? $comments[array_rand($comments)] : null;
    }
}
