<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- START DIAGNOSIS ---\n";

try {
    echo "Checking Current Academic Year...\n";
    $currentAcademicYear = \App\Models\AcademicYear::where('is_current', true)->first();
    
    if ($currentAcademicYear) {
        echo "Current Year Found: " . $currentAcademicYear->name . " (ID: " . $currentAcademicYear->id . ")\n";
        
        echo "Checking Semester Periods...\n";
        $semesters = \App\Models\SemesterPeriod::where('academic_year_id', $currentAcademicYear->id)->get();
        echo "Semester Periods Count: " . $semesters->count() . "\n";
        
        foreach ($semesters as $semester) {
            echo " - Semester {$semester->semester}: Status={$semester->status}\n";
            echo "   isOpen() -> " . ($semester->isOpen() ? 'true' : 'false') . "\n";
            echo "   isClosed() -> " . ($semester->isClosed() ? 'true' : 'false') . "\n";
        }
    } else {
        echo "NO Current Academic Year found!\n";
    }
    
    echo "\nChecking Statistics...\n";
    try {
        $students = \App\Models\Student::count();
        echo "Students: $students\n";
        
        $teachers = \App\Models\Teacher::count();
        echo "Teachers: $teachers\n";
        
        $parents = \App\Models\ParentProfile::count();
        echo "Parents: $parents\n";
        
    } catch (\Exception $e) {
        echo "Stats Error: " . $e->getMessage() . "\n";
    }

} catch (\Exception $e) {
    echo "GENERAL ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}

echo "--- END DIAGNOSIS ---\n";
