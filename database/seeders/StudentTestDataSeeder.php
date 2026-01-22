<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\User;
use App\Models\AcademicYear;
use App\Models\Registration;
use App\Models\Mark;
use App\Models\Attendance;
use App\Models\Subject;
use App\Models\SemesterResult;
use Carbon\Carbon;

class StudentTestDataSeeder extends Seeder
{
    public function run(): void
    {
        // Get test students
        $aliceUser = User::where('username', 'student_alice')->first();
        $bobUser = User::where('username', 's_12345')->first();
        
        if (!$aliceUser || !$bobUser) {
            $this->command->error('Test student users not found!');
            return;
        }
        
        $alice = $aliceUser->student;
        $bob = $bobUser->student;
        
        if (!$alice || !$bob) {
            $this->command->error('Student records not found!');
            return;
        }
        
        // Get or create current academic year
        $academicYear = AcademicYear::firstOrCreate(
            ['name' => '2025-2026'],
            [
                'start_date' => '2025-09-01',
                'end_date' => '2026-06-30',
                'status' => 'active',
            ]
        );
        
        // Set is_current using raw SQL to handle boolean properly
        \DB::statement("UPDATE academic_years SET is_current = TRUE WHERE id = ?", [$academicYear->id]);
        
        // Create registrations for both students
        $this->createRegistration($alice, $academicYear);
        $this->createRegistration($bob, $academicYear);
        
        // Create marks for students
        $this->createMarksForStudent($alice, $academicYear);
        $this->createMarksForStudent($bob, $academicYear);
        
        // Create semester results
        $this->createSemesterResults($alice, $academicYear);
        $this->createSemesterResults($bob, $academicYear);
        
        $this->command->info('✅ Created test data for student dashboards');
    }
    
    private function createRegistration($student, $academicYear)
    {
        Registration::updateOrCreate(
            [
                'student_id' => $student->id,
                'academic_year_id' => $academicYear->id,
            ],
            [
                'grade_id' => $student->grade_id,
                'section_id' => $student->section_id,
                'registration_date' => Carbon::now()->subMonths(4),
                'status' => 'completed',
            ]
        );
    }
    
    private function createMarksForStudent($student, $academicYear)
    {
        // Get subjects for the student's grade
        $subjects = Subject::where('grade_id', $student->grade_id)->get();
        
        if ($subjects->isEmpty()) {
            $this->command->warn("No subjects found for grade {$student->grade_id}");
            return;
        }
        
        // Create assessment types if they don't exist
        $assessmentTypes = [
            'Midterm' => 25,
            'Test' => 20,
            'Assignment' => 15,
            'Final' => 40,
        ];
        
        $typeIds = [];
        foreach ($assessmentTypes as $name => $weight) {
            $type = \App\Models\AssessmentType::firstOrCreate(
                ['name' => $name],
                ['weight_percentage' => $weight, 'description' => $name . ' assessment']
            );
            $typeIds[$name] = $type->id;
        }
        
        foreach ($subjects as $subject) {
            // Create marks for each assessment type
            foreach ($typeIds as $typeName => $typeId) {
                // Semester 1
                $score = rand(60, 95);
                Mark::create([
                    'student_id' => $student->id,
                    'subject_id' => $subject->id,
                    'academic_year_id' => $academicYear->id,
                    'semester' => '1',
                    'assessment_type_id' => $typeId,
                    'score' => $score,
                ]);
                
                // Semester 2 (fewer marks as it's ongoing)
                if (rand(0, 1)) {
                    $score = rand(65, 98);
                    Mark::create([
                        'student_id' => $student->id,
                        'subject_id' => $subject->id,
                        'academic_year_id' => $academicYear->id,
                        'semester' => '2',
                        'assessment_type_id' => $typeId,
                        'score' => $score,
                    ]);
                }
            }
        }
    }
    
    private function createAttendanceForStudent($student, $academicYear)
    {
        // Create 30 days of attendance (mostly present)
        for ($i = 0; $i < 30; $i++) {
            $date = Carbon::now()->subDays($i);
            
            // Skip weekends
            if ($date->isWeekend()) {
                continue;
            }
            
            $status = rand(1, 10) > 2 ? 'Present' : (rand(0, 1) ? 'Absent' : 'Late');
            
            Attendance::updateOrCreate(
                [
                    'student_id' => $student->id,
                    'date' => $date->format('Y-m-d'),
                ],
                [
                    'section_id' => $student->section_id,
                    'status' => $status,
                    'academic_year_id' => $academicYear->id,
                    'remarks' => $status === 'Absent' ? 'Sick' : null,
                ]
            );
        }
    }
    
    private function createSemesterResults($student, $academicYear)
    {
        // Calculate average from marks
        $semester1Marks = Mark::where('student_id', $student->id)
            ->where('academic_year_id', $academicYear->id)
            ->where('semester', '1')
            ->get();
        
        if ($semester1Marks->isNotEmpty()) {
            $average = $semester1Marks->avg('score');
            
            // Get section students for ranking
            $sectionStudents = Student::where('section_id', $student->section_id)->pluck('id');
            $rank = rand(1, max(1, $sectionStudents->count()));
            
            SemesterResult::updateOrCreate(
                [
                    'student_id' => $student->id,
                    'academic_year_id' => $academicYear->id,
                    'semester' => '1',
                ],
                [
                    'grade_id' => $student->grade_id,
                    'average' => round($average, 2),
                    'rank' => $rank,
                    'teacher_remarks' => 'Good performance overall',
                ]
            );
        }
    }
}
