<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

// Simulate being logged in as student ID 5
$student = \App\Models\Student::with(['user', 'grade', 'section'])->find(5);

if (!$student) {
    echo "Student not found\n";
    exit(1);
}

echo "Testing SemesterRecordController::index() logic\n\n";
echo "Student: {$student->user->name}\n\n";

// Get registrations (same as controller)
$registrations = \App\Models\Registration::where('student_id', $student->id)
    ->with(['grade', 'academicYear', 'section'])
    ->orderBy('academic_year_id', 'desc')
    ->get();

echo "Total registrations: {$registrations->count()}\n\n";

$history = $registrations->map(function($reg) use ($student) {
    echo "Processing registration for {$reg->academicYear->name}...\n";
    
    $semestersData = collect([1, 2])->map(function($semesterNum) use ($reg, $student) {
        // Check if any marks exist
        $hasMarks = \App\Models\Mark::where('student_id', $student->id)
            ->where('academic_year_id', $reg->academic_year_id)
            ->where('grade_id', $reg->grade_id)
            ->where('semester', $semesterNum)
            ->exists();

        // Check if any assessments exist
        $hasAssessments = \App\Models\Assessment::where('academic_year_id', $reg->academic_year_id)
            ->where('grade_id', $reg->grade_id)
            ->where('section_id', $reg->section_id)
            ->where('semester', $semesterNum)
            ->exists();

        echo "  Semester {$semesterNum}: marks={$hasMarks}, assessments={$hasAssessments}\n";

        if (!$hasMarks && !$hasAssessments) {
            echo "    -> Filtered out (no data)\n";
            return null;
        }

        echo "    -> Will be included\n";
        
        return [
            'semester' => $semesterNum,
            'academic_year_id' => $reg->academic_year_id,
            'status' => 'open',
        ];
    })->filter()->values();

    echo "  Semesters with data: {$semestersData->count()}\n";

    return [
        'id' => $reg->id,
        'grade' => $reg->grade,
        'academic_year' => $reg->academicYear,
        'section' => $reg->section,
        'semesters' => $semestersData
    ];
})->filter(function($item) {
    $hasData = count($item['semesters']) > 0;
    echo "Registration {$item['id']}: " . ($hasData ? "INCLUDED" : "FILTERED OUT") . "\n";
    return $hasData;
})->values();

echo "\n=== FINAL RESULT ===\n";
echo "History items to display: {$history->count()}\n\n";

if ($history->isEmpty()) {
    echo "❌ EMPTY - UI will show 'No Records Found'\n";
} else {
    echo "✅ DATA EXISTS - UI should display:\n";
    foreach ($history as $item) {
        echo "  - {$item['academic_year']->name}: {$item['grade']->name} ({$item['semesters']->count()} semesters)\n";
    }
}
