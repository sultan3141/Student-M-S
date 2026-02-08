<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\AcademicYear;
use App\Models\Grade;
use App\Models\SemesterStatus;
use App\Models\SemesterPeriod;

$year = AcademicYear::where('is_current', true)->first();

if (!$year) {
    die("No current academic year found.\n");
}

echo "Fixing semesters for year: {$year->name} (ID: {$year->id})\n";

$grades = Grade::all();
if ($grades->isEmpty()) {
    // Create dummy grades if none
    echo "No grades found. Creating default grades...\n";
    foreach(range(1, 12) as $g) {
        Grade::create(['name' => "Grade $g", 'level' => $g]);
    }
    $grades = Grade::all();
}

// 1. Create Per-Grade Semester Statuses
foreach ($grades as $grade) {
    foreach ([1, 2] as $sem) {
        $status = SemesterStatus::firstOrCreate(
            [
                'academic_year_id' => $year->id,
                'grade_id' => $grade->id,
                'semester' => $sem,
            ],
            [
                'status' => 'closed', // Default to closed
                'is_declared' => false,
            ]
        );
        echo " - Grade {$grade->name} Sem $sem: {$status->status}\n";
    }
}

// 2. Create Global Semester Periods (for Controller sync)
foreach ([1, 2] as $sem) {
    SemesterPeriod::firstOrCreate(
        [
            'academic_year_id' => $year->id,
            'semester' => $sem,
        ],
        [
            'status' => 'closed',
            'closed_at' => now(),
        ]
    );
    echo " - Global Period Sem $sem: Created/Exists\n";
}

echo "✅ Semesters fixed. Refresh the page.\n";
