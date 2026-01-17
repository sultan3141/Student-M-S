<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $grades = \App\Models\Grade::all();

        $commonSubjects = [
            ['name' => 'Mathematics', 'code' => 'MATH'],
            ['name' => 'English', 'code' => 'ENG'],
            ['name' => 'Physics', 'code' => 'PHY'],
            ['name' => 'Chemistry', 'code' => 'CHEM'],
            ['name' => 'Biology', 'code' => 'BIO'],
            ['name' => 'History', 'code' => 'HIST'],
            ['name' => 'Holly Quran', 'code' => 'QURAN'],
        ];

        foreach ($grades as $grade) {
            foreach ($commonSubjects as $subject) {
                \App\Models\Subject::firstOrCreate([
                    'name' => $subject['name'],
                    'grade_id' => $grade->id,
                ], [
                    'code' => $subject['code'] . '-' . $grade->level,
                ]);
            }
        }
    }
}
