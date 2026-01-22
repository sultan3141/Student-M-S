<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;
use App\Models\Student;
use Carbon\Carbon;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = Student::all();
        
        if ($students->isEmpty()) {
            $this->command->info('No students found. Please run StudentSeeder first.');
            return;
        }

        // Get current academic year
        $academicYear = \App\Models\AcademicYear::whereRaw('is_current::boolean = TRUE')->first();
        if (!$academicYear) {
            $this->command->info('No current academic year found. Please create one first.');
            return;
        }

        $paymentTypes = ['Monthly', 'Semester', 'Annual'];
        $statuses = ['Paid', 'Pending', 'Partial'];
        
        foreach ($students as $student) {
            // Create 2-4 payments per student
            $paymentCount = rand(2, 4);
            
            for ($i = 0; $i < $paymentCount; $i++) {
                Payment::create([
                    'student_id' => $student->id,
                    'academic_year_id' => $academicYear->id,
                    'type' => $paymentTypes[array_rand($paymentTypes)],
                    'amount' => rand(100, 1000), // Random amount between $100-$1000
                    'status' => $statuses[array_rand($statuses)],
                    'transaction_date' => Carbon::now()->subDays(rand(1, 180)),
                    'created_at' => Carbon::now()->subDays(rand(1, 180)),
                    'updated_at' => Carbon::now()->subDays(rand(1, 90)),
                ]);
            }
        }

        $this->command->info('Sample payment data created successfully!');
    }
}