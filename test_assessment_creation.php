<?php

/**
 * Test Assessment Creation
 * Run this file to test if assessment creation works
 * 
 * Usage: php test_assessment_creation.php
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Teacher;
use App\Models\Assessment;
use App\Models\AcademicYear;
use App\Models\User;

echo "=== Testing Assessment Creation ===\n\n";

// Test 1: Check if academic year exists
echo "1. Checking Academic Year...\n";
$academicYear = AcademicYear::whereRaw("is_current = true")->first();
if ($academicYear) {
    echo "   ✓ Active academic year found: {$academicYear->name}\n";
    echo "   - ID: {$academicYear->id}\n";
    echo "   - Current Semester: " . ($academicYear->getCurrentSemester() ?? 'N/A') . "\n";
} else {
    echo "   ✗ NO ACTIVE ACADEMIC YEAR FOUND!\n";
    echo "   Solution: Set an academic year as current in the database\n";
    exit(1);
}

echo "\n";

// Test 2: Check if teacher exists
echo "2. Checking Teachers...\n";
$teachers = Teacher::with('user')->limit(5)->get();
if ($teachers->count() > 0) {
    echo "   ✓ Found {$teachers->count()} teacher(s)\n";
    foreach ($teachers as $teacher) {
        echo "   - Teacher ID: {$teacher->id}, User: {$teacher->user->name} ({$teacher->user->email})\n";
    }
} else {
    echo "   ✗ NO TEACHERS FOUND!\n";
    echo "   Solution: Create teacher profiles in the database\n";
    exit(1);
}

echo "\n";

// Test 3: Try to create a test assessment
echo "3. Testing Assessment Creation...\n";
$teacher = $teachers->first();

try {
    $testAssessment = Assessment::create([
        'name' => 'Test Assessment ' . time(),
        'teacher_id' => $teacher->id,
        'grade_id' => 1, // Assuming grade 1 exists
        'section_id' => 1, // Assuming section 1 exists
        'subject_id' => 1, // Assuming subject 1 exists
        'assessment_type_id' => null,
        'due_date' => now()->addDays(7),
        'max_score' => 10,
        'description' => 'Test assessment created by script',
        'academic_year_id' => $academicYear->id,
        'weight_percentage' => 0,
        'semester' => $academicYear->getCurrentSemester() ?? 1,
        'status' => 'published',
    ]);
    
    echo "   ✓ Assessment created successfully!\n";
    echo "   - ID: {$testAssessment->id}\n";
    echo "   - Name: {$testAssessment->name}\n";
    echo "   - Max Score: {$testAssessment->max_score}\n";
    
    // Clean up - delete the test assessment
    $testAssessment->delete();
    echo "   ✓ Test assessment deleted (cleanup)\n";
    
} catch (\Exception $e) {
    echo "   ✗ FAILED TO CREATE ASSESSMENT!\n";
    echo "   Error: {$e->getMessage()}\n";
    echo "   File: {$e->getFile()}:{$e->getLine()}\n";
    exit(1);
}

echo "\n";

// Test 4: Check database tables
echo "4. Checking Database Tables...\n";
try {
    $gradeCount = \DB::table('grades')->count();
    $sectionCount = \DB::table('sections')->count();
    $subjectCount = \DB::table('subjects')->count();
    
    echo "   ✓ Grades: {$gradeCount}\n";
    echo "   ✓ Sections: {$sectionCount}\n";
    echo "   ✓ Subjects: {$subjectCount}\n";
    
    if ($gradeCount == 0 || $sectionCount == 0 || $subjectCount == 0) {
        echo "   ⚠ Warning: Some tables are empty. Make sure you have grades, sections, and subjects.\n";
    }
} catch (\Exception $e) {
    echo "   ✗ Database error: {$e->getMessage()}\n";
}

echo "\n=== All Tests Passed! ===\n";
echo "Assessment creation should work in the browser.\n";
echo "If it still doesn't work, check:\n";
echo "1. Browser console (F12) for JavaScript errors\n";
echo "2. Network tab for API response\n";
echo "3. Make sure you're logged in as a teacher\n";
