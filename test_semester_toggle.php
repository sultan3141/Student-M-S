<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== TESTING SEMESTER TOGGLE FUNCTIONALITY ===\n\n";

// Get current academic year
$currentYear = \App\Models\AcademicYear::whereRaw("is_current = true")->first();

if (!$currentYear) {
    echo "❌ No current academic year found!\n";
    exit(1);
}

echo "✓ Current Academic Year: {$currentYear->name} (ID: {$currentYear->id})\n";
echo "  Status: {$currentYear->status}\n";
echo "  is_current: " . ($currentYear->is_current ? 'TRUE' : 'FALSE') . "\n\n";

// Check semester statuses
echo "=== SEMESTER STATUSES ===\n";
$semesterStatuses = \App\Models\SemesterStatus::where('academic_year_id', $currentYear->id)
    ->with('grade')
    ->orderBy('semester')
    ->orderBy('grade_id')
    ->get();

if ($semesterStatuses->isEmpty()) {
    echo "❌ No semester statuses found! Creating default semesters...\n";
    $currentYear->createDefaultSemesters();
    $semesterStatuses = \App\Models\SemesterStatus::where('academic_year_id', $currentYear->id)
        ->with('grade')
        ->orderBy('semester')
        ->orderBy('grade_id')
        ->get();
}

foreach ([1, 2] as $sem) {
    $statuses = $semesterStatuses->where('semester', $sem);
    $openCount = $statuses->where('status', 'open')->count();
    $closedCount = $statuses->where('status', 'closed')->count();
    
    echo "\nSemester {$sem}:\n";
    echo "  Open: {$openCount} grades\n";
    echo "  Closed: {$closedCount} grades\n";
    echo "  Overall: " . ($openCount > 0 ? 'OPEN' : 'CLOSED') . "\n";
    
    // Show per-grade status
    foreach ($statuses as $status) {
        echo "    - Grade {$status->grade->name}: {$status->status}\n";
    }
}

// Test the isOpen method
echo "\n=== TESTING isOpen() METHOD ===\n";
$grades = \App\Models\Grade::all();
foreach ($grades as $grade) {
    foreach ([1, 2] as $sem) {
        $isOpen = \App\Models\SemesterStatus::isOpen($grade->id, $sem, $currentYear->id);
        echo "Grade {$grade->name}, Semester {$sem}: " . ($isOpen ? 'OPEN' : 'CLOSED') . "\n";
    }
}

// Test canOpenSemester
echo "\n=== TESTING canOpenSemester() METHOD ===\n";
echo "Can open Semester 1: " . ($currentYear->canOpenSemester(1) ? 'YES' : 'NO') . "\n";
echo "Can open Semester 2: " . ($currentYear->canOpenSemester(2) ? 'YES' : 'NO') . "\n";

echo "\n✓ Test completed successfully!\n";
