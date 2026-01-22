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

        // Grades 9-12
        $grades = [9, 10, 11, 12];

        foreach ($grades as $level) {
            $grade = \App\Models\Grade::updateOrCreate(
                ['level' => $level],
                ['name' => "Grade $level"]
            );

            // Create Sections A (Female) and B (Male)
            // Section A
            \App\Models\Section::updateOrCreate(
                ['grade_id' => $grade->id, 'name' => 'A'],
                [
                    'gender' => 'Female',
                    'capacity' => 50,
                ]
            );

            // Section B
            \App\Models\Section::updateOrCreate(
                ['grade_id' => $grade->id, 'name' => 'B'],
                [
                    'gender' => 'Male',
                    'capacity' => 50,
                ]
            );
            
            // For G11/12, we might link streams, but keeping it simple for now as generic sections
        }
        
        // Active Academic Year
        \App\Models\AcademicYear::updateOrCreate(
            ['name' => '2025-2026'],
            [
                'start_date' => '2025-09-01',
                'end_date' => '2026-06-30',
                'status' => 'active',
            ]
        );
    }
}
