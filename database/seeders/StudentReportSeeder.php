<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StudentReport;
use App\Models\Student;
use Carbon\Carbon;

class StudentReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first student to create reports for
        $student = Student::first();

        if (!$student) {
            $this->command->warn('No students found. Please seed students first.');
            return;
        }

        $reports = [
            [
                'student_id' => $student->id,
                'report_type' => 'behavioral',
                'message' => 'Brought a phone to school for the second time',
                'reported_by' => 'Mr. Ahmed Hassan',
                'reported_at' => Carbon::now()->subDays(3),
                'severity' => 'medium',
            ],
            [
                'student_id' => $student->id,
                'report_type' => 'attendance',
                'message' => "Didn't attend class for last week",
                'reported_by' => 'Ms. Fatima Ali',
                'reported_at' => Carbon::now()->subDays(7),
                'severity' => 'high',
            ],
            [
                'student_id' => $student->id,
                'report_type' => 'behavioral',
                'message' => 'Disrupted class during math lesson',
                'reported_by' => 'Mr. Ibrahim Mohammed',
                'reported_at' => Carbon::now()->subDays(14),
                'severity' => 'low',
            ],
            [
                'student_id' => $student->id,
                'report_type' => 'academic',
                'message' => 'Failed to submit homework assignments for the past two weeks',
                'reported_by' => 'Ms. Sara Ahmed',
                'reported_at' => Carbon::now()->subDays(10),
                'severity' => 'medium',
            ],
            [
                'student_id' => $student->id,
                'report_type' => 'general',
                'message' => 'Outstanding performance in science fair competition',
                'reported_by' => 'Dr. Yusuf Abdi',
                'reported_at' => Carbon::now()->subDays(5),
                'severity' => 'low',
            ],
        ];

        foreach ($reports as $report) {
            StudentReport::create($report);
        }

        $this->command->info('Student reports seeded successfully!');
    }
}
