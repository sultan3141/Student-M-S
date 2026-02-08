<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== TEACHER DATA CHECK ===\n\n";

// Get teacher John Smith
$user = \App\Models\User::where('username', 'teacher_john')->first();

if (!$user) {
    echo "Teacher 'teacher_john' not found!\n";
    exit(1);
}

$teacher = $user->teacher;

if (!$teacher) {
    echo "No teacher profile found for user!\n";
    exit(1);
}

echo "Teacher: {$user->name}\n";
echo "Username: {$user->username}\n";
echo "Employee ID: {$teacher->employee_id}\n\n";

// Check assignments
$assignments = $teacher->assignments()->with(['subject', 'grade', 'section'])->get();
echo "=== TEACHER ASSIGNMENTS ===\n";
echo "Total Assignments: " . $assignments->count() . "\n\n";

if ($assignments->isEmpty()) {
    echo "⚠️  No assignments found! Run: php artisan db:seed --class=TeacherAssignmentSeeder\n";
} else {
    foreach ($assignments->take(5) as $assignment) {
        echo "- {$assignment->subject->name} | Grade {$assignment->grade->level} | Section {$assignment->section->name}\n";
    }
    if ($assignments->count() > 5) {
        echo "... and " . ($assignments->count() - 5) . " more\n";
    }
}

echo "\n=== STUDENTS IN ASSIGNED SECTIONS ===\n";
$sectionIds = $assignments->pluck('section_id')->unique();
$students = \App\Models\Student::whereIn('section_id', $sectionIds)->count();
echo "Total Students: {$students}\n";

if ($students == 0) {
    echo "⚠️  No students found! Run: php artisan db:seed --class=StudentTestDataSeeder\n";
}

echo "\n=== ASSESSMENTS ===\n";
$academicYear = \App\Models\AcademicYear::whereRaw('is_current = true')->first();
if ($academicYear) {
    $assessments = \App\Models\Assessment::where('academic_year_id', $academicYear->id)
        ->whereIn('grade_id', $assignments->pluck('grade_id')->unique())
        ->whereIn('section_id', $assignments->pluck('section_id')->unique())
        ->whereIn('subject_id', $assignments->pluck('subject_id')->unique())
        ->count();
    
    echo "Academic Year: {$academicYear->name}\n";
    echo "Total Assessments: {$assessments}\n";
    
    if ($assessments == 0) {
        echo "⚠️  No assessments found! Teachers need to create assessments.\n";
    }
} else {
    echo "⚠️  No current academic year found!\n";
}

echo "\n=== MARKS ===\n";
$marks = \App\Models\Mark::where('teacher_id', $teacher->id)->count();
echo "Total Marks Entered: {$marks}\n";

if ($marks == 0) {
    echo "ℹ️  No marks entered yet. This is normal for a new teacher.\n";
}

echo "\n=== STATUS ===\n";
if ($assignments->count() > 0 && $students > 0) {
    echo "✅ Teacher dashboard should work!\n";
    echo "✅ Teacher can create assessments\n";
    echo "✅ Teacher can enter marks\n";
} else {
    echo "⚠️  Missing data - teacher dashboard may be empty\n";
}
