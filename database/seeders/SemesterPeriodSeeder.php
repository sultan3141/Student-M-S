<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AcademicYear;
use App\Models\SemesterPeriod;

class SemesterPeriodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all academic years
        $academicYears = AcademicYear::all();

        foreach ($academicYears as $academicYear) {
            // Check if semester periods already exist
            $existingPeriods = SemesterPeriod::where('academic_year_id', $academicYear->id)->count();
            
            if ($existingPeriods == 0) {
                // Create semester periods for this academic year
                // S1 starts OPEN, S2 starts CLOSED (as per system design)
                SemesterPeriod::create([
                    'academic_year_id' => $academicYear->id,
                    'semester' => 1,
                    'status' => 'open',
                    'opened_at' => now(),
                    'closed_at' => null,
                ]);

                SemesterPeriod::create([
                    'academic_year_id' => $academicYear->id,
                    'semester' => 2,
                    'status' => 'closed',
                    'opened_at' => null,
                    'closed_at' => null,
                ]);

                $this->command->info("Created semester periods for {$academicYear->name}");
            } else {
                // Update existing periods to correct status
                SemesterPeriod::where('academic_year_id', $academicYear->id)
                    ->where('semester', 1)
                    ->update([
                        'status' => 'open',
                        'opened_at' => now(),
                    ]);
                
                SemesterPeriod::where('academic_year_id', $academicYear->id)
                    ->where('semester', 2)
                    ->update([
                        'status' => 'closed',
                        'opened_at' => null,
                        'closed_at' => null,
                    ]);
                
                $this->command->info("Updated semester periods for {$academicYear->name}");
            }
        }
    }
}