<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== DEBUGGING SEMESTER RECORDS ===\n\n";

// Find student with ID 0001/26
$student = \App\Models\Student::where('student_id', '0001/26')->first();

if (!$student) {
    echo "❌ Student with ID 0001/26 not found!\n";
    exit(1);
}

echo "✅ Student: {$student->user->name} (ID: {$student->id})\n";
echo "   Grade: {$student->grade->name}\n";
echo "   Section: {$student->section->name}\n\n";

// Get registrations
$registrations = \App\Models\Registration::where('student_id', $student->id)
    ->with(['grade', 'academicYear', 'section'])
    ->orderBy('academic_year_id', 'desc')
    ->get();

echo "📋 Total Registrations: {$registrations->count()}\n\n";

foreach ($registrations as $reg) {
    echo "Registration #{$reg->id}:\n";
    echo "  Year: {$reg->academicYear->name}\n";
    echo "  Grade: {$reg->grade->name}\n";
    echo "  Section: {$reg->section->name}\n";
    
    // Check for marks in each semester
    foreach ([1, 2] as $semesterNum) {
        echo "\n  Semester {$semesterNum}:\n";
        
        // Check marks
        $hasMarks = \App\Models\Mark::where('student_id', $student->id)
            ->where('academic_year_id', $reg->academic_year_id)
            ->where('grade_id', $reg->grade_id)
            ->where('semester', $semesterNum)
            ->exists();
        
        $markCount = \App\Models\Mark::where('student_id', $student->id)
            ->where('academic_year_id', $reg->academic_year_id)
            ->where('grade_id', $reg->grade_id)
            ->where('semester', $semesterNum)
            ->count();
        
        echo "    Marks: " . ($hasMarks ? "✅ YES ({$markCount})" : "❌ NO") . "\n";
        
        // Check assessments
        $hasAssessments = \App\Models\Assessment::where('academic_year_id', $reg->academic_year_id)
            ->where('grade_id', $reg->grade_id)
            ->where('section_id', $reg->section_id)
            ->where('semester', $semesterNum)
            ->exists();
        
        $assessmentCount = \App\Models\Assessment::where('academic_year_id', $reg->academic_year_id)
            ->where('grade_id', $reg->grade_id)
            ->where('section_id', $reg->section_id)
            ->where('semester', $semesterNum)
            ->count();
        
        echo "    Assessments: " . ($hasAssessments ? "✅ YES ({$assessmentCount})" : "❌ NO") . "\n";
        
        // This is the condition in the controller
        if (!$hasMarks && !$hasAssessments) {
            echo "    ⚠️  FILTERED OUT (no marks and no assessments)\n";
        } else {
            echo "    ✅ WILL BE SHOWN\n";
        }
    }
    
    echo "\n";
}

echo "\n=== SUMMARY ===\n";
echo "The controller filters out semesters that have neither marks nor assessments.\n";
echo "If all semesters are filtered out, the registration won't appear in the UI.\n";
