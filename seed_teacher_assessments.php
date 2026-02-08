<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== SEEDING TEACHER ASSESSMENTS ===\n\n";

// Get current academic year
$academicYear = \App\Models\AcademicYear::whereRaw('is_current = true')->first();

if (!$academicYear) {
    echo "❌ No current academic year found!\n";
    exit(1);
}

echo "Academic Year: {$academicYear->name}\n\n";

// Get teacher John Smith
$user = \App\Models\User::where('username', 'teacher_john')->first();
$teacher = $user->teacher;

// Get teacher's assignments
$assignments = $teacher->assignments()->with(['subject', 'grade', 'section'])->get();

echo "Creating assessments for {$assignments->count()} assignments...\n\n";

$created = 0;

foreach ($assignments as $assignment) {
    // Create a Quiz assessment for Semester 1
    $assessment = \App\Models\Assessment::create([
        'teacher_id' => $teacher->id,
        'name' => 'Quiz 1',
        'description' => 'First quiz of the semester',
        'subject_id' => $assignment->subject_id,
        'grade_id' => $assignment->grade_id,
        'section_id' => $assignment->section_id,
        'academic_year_id' => $academicYear->id,
        'semester' => 1,
        'max_score' => 20,
        'weight_percentage' => 10,
        'due_date' => now()->addDays(7),
        'status' => 'published',
    ]);
    
    echo "✅ Created: {$assessment->name} - {$assignment->subject->name} | Grade {$assignment->grade->level} | Section {$assignment->section->name}\n";
    $created++;
}

echo "\n=== SUMMARY ===\n";
echo "Created {$created} assessments\n";
echo "Teacher can now enter marks for these assessments\n";
