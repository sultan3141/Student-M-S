<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$teacher = \App\Models\Teacher::first();
$academicYear = \App\Models\AcademicYear::where('is_current', true)->first();

if (!$teacher || !$academicYear) {
    echo "Teacher or Academic Year not found!\n";
    exit;
}

// Get Grade 10
$grade = \App\Models\Grade::where('level', 10)->first();
$subject = \App\Models\Subject::where('grade_id', $grade->id)
    ->where('name', 'Mathematics')
    ->first();

if (!$grade || !$subject) {
    echo "Grade 10 or Mathematics subject not found!\n";
    exit;
}

// Get all sections for Grade 10
$sections = \App\Models\Section::where('grade_id', $grade->id)->get();

echo "Creating test assessments...\n\n";

$count = 0;
foreach ($sections as $section) {
    $assessment = \App\Models\Assessment::create([
        'name' => 'Midterm Exam',
        'teacher_id' => $teacher->id,
        'grade_id' => $grade->id,
        'section_id' => $section->id,
        'subject_id' => $subject->id,
        'assessment_type_id' => null,
        'due_date' => now()->addDays(7),
        'max_score' => 100,
        'description' => 'Test assessment for Grade 10 Mathematics',
        'academic_year_id' => $academicYear->id,
        'weight_percentage' => 0,
        'semester' => '1',
        'status' => 'published',
    ]);
    
    echo "✓ Created: {$assessment->name} for Grade {$grade->level} Section {$section->name}\n";
    $count++;
}

echo "\n=== Summary ===\n";
echo "Total Assessments Created: {$count}\n";
echo "Grade: {$grade->name}\n";
echo "Subject: {$subject->name}\n";
echo "Teacher: {$teacher->user->name}\n";
echo "\nYou can now test Declare Result!\n";
