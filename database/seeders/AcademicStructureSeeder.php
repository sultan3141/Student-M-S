<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AcademicStructureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Streams
        $natural = \App\Models\Stream::firstOrCreate(['name' => 'Natural Science']);
        $social = \App\Models\Stream::firstOrCreate(['name' => 'Social Science']);

        // Grades 1-12
        $grades = range(1, 12);

        foreach ($grades as $level) {
            $grade = \App\Models\Grade::updateOrCreate(
                ['level' => $level],
                ['name' => "Grade $level"]
            );

            // Determine stream for Grade 11 & 12
            $streamId = null;
            if ($level >= 11) {
                // Assign Section A to Natural Science, B to Social Science (for simplicity)
            }

            // Create Sections A (Female) and B (Male)
            // Section A
            $streamIdA = ($level >= 11) ? $natural->id : null;
            \App\Models\Section::updateOrCreate(
                ['grade_id' => $grade->id, 'name' => 'A'],
                [
                    'gender' => 'Female',
                    'capacity' => 50,
                    'stream_id' => $streamIdA,
                ]
            );

            // Section B
            $streamIdB = ($level >= 11) ? $social->id : null;
            \App\Models\Section::updateOrCreate(
                ['grade_id' => $grade->id, 'name' => 'B'],
                [
                    'gender' => 'Male',
                    'capacity' => 50,
                    'stream_id' => $streamIdB,
                ]
            );
        }

        // Active Academic Year - Use raw SQL for PostgreSQL boolean compatibility
        $existingYear = \App\Models\AcademicYear::where('name', '2025-2026')->first();

        if (!$existingYear) {
            \Illuminate\Support\Facades\DB::statement(
                "INSERT INTO academic_years (name, start_date, end_date, status, is_current, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, true, NOW(), NOW())",
                ['2025-2026', '2025-09-01', '2026-06-30', 'active']
            );
        }
    }
}
