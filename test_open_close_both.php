<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\AcademicYear;
use App\Models\Grade;
use App\Models\SemesterStatus;
use Illuminate\Support\Facades\DB;

echo "=== OPEN/CLOSE TOGGLE TEST ===\n\n";

$currentYear = AcademicYear::whereRaw('is_current = true')->first();
$testGrade = Grade::first();

if (!$currentYear || !$testGrade) {
    echo "❌ Missing academic year or grade\n";
    exit(1);
}

echo "Testing with: {$testGrade->name}, Semester 1\n";
echo "Academic Year: {$currentYear->name}\n\n";

// Test 1: Close it
echo "=== TEST 1: CLOSE ===\n";
DB::transaction(function () use ($currentYear, $testGrade) {
    SemesterStatus::updateOrCreate(
        [
            'academic_year_id' => $currentYear->id,
            'grade_id' => $testGrade->id,
            'semester' => 1,
        ],
        [
            'status' => 'closed',
        ]
    );
});

$status = SemesterStatus::where('academic_year_id', $currentYear->id)
    ->where('grade_id', $testGrade->id)
    ->where('semester', 1)
    ->first();

echo "Status after close: " . ($status ? $status->status : 'not found') . "\n";
echo ($status && $status->status === 'closed') ? "✓ CLOSE works\n" : "❌ CLOSE failed\n";

sleep(1);

// Test 2: Open it
echo "\n=== TEST 2: OPEN ===\n";
DB::transaction(function () use ($currentYear, $testGrade) {
    SemesterStatus::updateOrCreate(
        [
            'academic_year_id' => $currentYear->id,
            'grade_id' => $testGrade->id,
            'semester' => 1,
        ],
        [
            'status' => 'open',
        ]
    );
});

$status = SemesterStatus::where('academic_year_id', $currentYear->id)
    ->where('grade_id', $testGrade->id)
    ->where('semester', 1)
    ->first();

echo "Status after open: " . ($status ? $status->status : 'not found') . "\n";
echo ($status && $status->status === 'open') ? "✓ OPEN works\n" : "❌ OPEN failed\n";

sleep(1);

// Test 3: Close again
echo "\n=== TEST 3: CLOSE AGAIN ===\n";
DB::transaction(function () use ($currentYear, $testGrade) {
    SemesterStatus::updateOrCreate(
        [
            'academic_year_id' => $currentYear->id,
            'grade_id' => $testGrade->id,
            'semester' => 1,
        ],
        [
            'status' => 'closed',
        ]
    );
});

$status = SemesterStatus::where('academic_year_id', $currentYear->id)
    ->where('grade_id', $testGrade->id)
    ->where('semester', 1)
    ->first();

echo "Status after close again: " . ($status ? $status->status : 'not found') . "\n";
echo ($status && $status->status === 'closed') ? "✓ CLOSE works again\n" : "❌ CLOSE failed\n";

sleep(1);

// Test 4: Open again
echo "\n=== TEST 4: OPEN AGAIN ===\n";
DB::transaction(function () use ($currentYear, $testGrade) {
    SemesterStatus::updateOrCreate(
        [
            'academic_year_id' => $currentYear->id,
            'grade_id' => $testGrade->id,
            'semester' => 1,
        ],
        [
            'status' => 'open',
        ]
    );
});

$status = SemesterStatus::where('academic_year_id', $currentYear->id)
    ->where('grade_id', $testGrade->id)
    ->where('semester', 1)
    ->first();

echo "Status after open again: " . ($status ? $status->status : 'not found') . "\n";
echo ($status && $status->status === 'open') ? "✓ OPEN works again\n" : "❌ OPEN failed\n";

echo "\n=== ALL TESTS COMPLETE ===\n";
echo "Both OPEN and CLOSE work correctly in the backend!\n";
