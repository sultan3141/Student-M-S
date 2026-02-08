<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== CHECKING STUDENT DATA ===\n\n";

// Get first student
$student = \App\Models\Student::with(['user', 'grade', 'section'])->first();

if (!$student) {
    echo "❌ No students found in database!\n";
    exit(1);
}

echo "✅ Student Found:\n";
echo "   ID: {$student->id}\n";
echo "   Name: {$student->user->name}\n";
echo "   Grade: {$student->grade->name}\n";
echo "   Section: " . ($student->section ? $student->section->name : 'NOT ASSIGNED') . "\n\n";

if (!$student->section_id) {
    echo "   ⚠️  Student has no section assigned!\n";
    echo "   Assigning to first available section...\n";
    $section = \App\Models\Section::where('grade_id', $student->grade_id)->first();
    if ($section) {
        $student->update(['section_id' => $section->id]);
        echo "   ✅ Assigned to Section {$section->name}\n\n";
        $student->load('section');
    }
}

// Check registrations
$registrations = \App\Models\Registration::where('student_id', $student->id)->get();
echo "📋 Registrations: " . $registrations->count() . "\n";

if ($registrations->isEmpty()) {
    echo "   ⚠️  No registrations found! Creating one...\n";
    
    $currentYear = \App\Models\AcademicYear::where('is_current', true)->first();
    if (!$currentYear) {
        $currentYear = \App\Models\AcademicYear::first();
    }
    
    if ($currentYear) {
        $registration = \App\Models\Registration::create([
            'student_id' => $student->id,
            'academic_year_id' => $currentYear->id,
            'grade_id' => $student->grade_id,
            'section_id' => $student->section_id,
            'stream_id' => $student->stream_id,
            'registration_date' => now(),
            'status' => 'completed'
        ]);
        echo "   ✅ Registration created for {$currentYear->name}\n";
    }
} else {
    foreach ($registrations as $reg) {
        echo "   - {$reg->academicYear->name}: Grade {$reg->grade->name}, Section {$reg->section->name}\n";
    }
}

echo "\n";

// Check marks
$marks = \App\Models\Mark::where('student_id', $student->id)->get();
echo "📝 Marks: " . $marks->count() . "\n";

if ($marks->isEmpty()) {
    echo "   ⚠️  No marks found!\n";
} else {
    $byYear = $marks->groupBy('academic_year_id');
    foreach ($byYear as $yearId => $yearMarks) {
        $year = \App\Models\AcademicYear::find($yearId);
        echo "   - {$year->name}: {$yearMarks->count()} marks\n";
        
        $bySemester = $yearMarks->groupBy('semester');
        foreach ($bySemester as $sem => $semMarks) {
            echo "     • Semester {$sem}: {$semMarks->count()} marks\n";
        }
    }
}

echo "\n";

// Check assessments
$assessments = \App\Models\Assessment::where('grade_id', $student->grade_id)
    ->where('section_id', $student->section_id)
    ->get();
echo "📊 Assessments for this class: " . $assessments->count() . "\n";

if ($assessments->isEmpty()) {
    echo "   ⚠️  No assessments found for this grade/section!\n";
} else {
    $byYear = $assessments->groupBy('academic_year_id');
    foreach ($byYear as $yearId => $yearAssessments) {
        $year = \App\Models\AcademicYear::find($yearId);
        echo "   - {$year->name}: {$yearAssessments->count()} assessments\n";
    }
}

echo "\n=== SUMMARY ===\n";
if ($registrations->isEmpty()) {
    echo "❌ Student has no registration records - UI will be empty\n";
    echo "   Solution: Create registration records\n";
} elseif ($marks->isEmpty() && $assessments->isEmpty()) {
    echo "⚠️  Student has registrations but no marks or assessments\n";
    echo "   Solution: Teachers need to create assessments and enter marks\n";
} else {
    echo "✅ Student has data - UI should display\n";
    echo "   If UI is still empty, check:\n";
    echo "   1. Is the server running?\n";
    echo "   2. Are you logged in as this student?\n";
    echo "   3. Check browser console for errors\n";
    echo "   4. Try clearing cache: php artisan cache:clear\n";
}

echo "\n";
