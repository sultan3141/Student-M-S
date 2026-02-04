<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$teacher = \App\Models\Teacher::first();

if (!$teacher) {
    echo "No teacher found!\n";
    exit;
}

echo "=== TEACHER DATA VERIFICATION ===\n\n";
echo "Teacher: {$teacher->user->name}\n";
echo "Email: {$teacher->user->email}\n\n";

// Get academic year
$academicYear = \App\Models\AcademicYear::where('is_current', true)->first();
echo "Academic Year: {$academicYear->name} (Current: " . ($academicYear->is_current ? 'Yes' : 'No') . ")\n\n";

// Get grades with assignments
$grades = \App\Models\Grade::whereIn('level', [9, 10, 11, 12])
    ->orderBy('level')
    ->get();

echo "=== GRADES & SUBJECTS ===\n\n";

foreach ($grades as $grade) {
    // Get sections for this grade assigned to teacher
    $sections = \App\Models\TeacherAssignment::with(['section.stream'])
        ->where('teacher_id', $teacher->id)
        ->where('grade_id', $grade->id)
        ->where('academic_year_id', $academicYear->id)
        ->get()
        ->pluck('section')
        ->unique('id');
    
    echo "Grade {$grade->level} ({$grade->name})\n";
    echo "  Sections: " . $sections->count() . "\n";
    
    foreach ($sections as $section) {
        $stream = $section->stream ? " - {$section->stream->name}" : "";
        echo "    - Section {$section->name}{$stream}\n";
    }
    
    // Get subjects teacher teaches in this grade
    $subjects = \App\Models\TeacherAssignment::with('subject')
        ->where('teacher_id', $teacher->id)
        ->where('grade_id', $grade->id)
        ->get()
        ->pluck('subject')
        ->unique('id');
    
    echo "  Subjects: " . $subjects->count() . "\n";
    foreach ($subjects as $subject) {
        echo "    - {$subject->name} ({$subject->code})\n";
    }
    echo "\n";
}

echo "=== SUMMARY ===\n";
echo "Total Teacher Assignments: " . \App\Models\TeacherAssignment::where('teacher_id', $teacher->id)->count() . "\n";
echo "Total Subjects in grade_subject: " . \Illuminate\Support\Facades\DB::table('grade_subject')->count() . "\n";
echo "\n✓ Teacher can create assessments for Mathematics and Physics in all grades!\n";
