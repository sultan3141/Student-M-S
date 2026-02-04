<?php

use App\Http\Controllers\DirectorDashboardController;
use Illuminate\Support\Facades\Auth;

// Mock Auth if needed, or just instantiate controller
// Since index() calls private methods, we might need to reflect or use a test instance

$controller = new DirectorDashboardController();

// Use Reflection to test private methods or just copy logic
// Let's copy the logic to be safe and simple

echo "Testing Statistics...\n";
try {
    $totalStudents = \App\Models\Student::count();
    echo "Students: $totalStudents\n";
} catch (\Exception $e) {
    echo "Error querying Students: " . $e->getMessage() . "\n";
}

echo "Testing Semester Status...\n";
try {
    $currentAcademicYear = \App\Models\AcademicYear::where('is_current', true)->first();
    if ($currentAcademicYear) {
        echo "Current Year: " . $currentAcademicYear->name . "\n";
        
        $semesters = \App\Models\SemesterPeriod::where('academic_year_id', $currentAcademicYear->id)->get();
        echo "Semester Periods found: " . $semesters->count() . "\n";
        
        foreach ($semesters as $semester) {
            echo "Semester {$semester->semester}: Status={$semester->status}\n";
            echo "Is Open? " . ($semester->isOpen() ? 'Yes' : 'No') . "\n";
        }
    } else {
        echo "No current academic year found.\n";
    }
} catch (\Exception $e) {
    echo "Error querying Semester Status: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}

echo "Done.\n";
