<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== FIXING STUDENT REGISTRATIONS ===\n\n";

// Get all students
$students = \App\Models\Student::with(['grade', 'section'])->get();

echo "Found {$students->count()} students\n\n";

foreach ($students as $student) {
    echo "Processing: {$student->user->name} (ID: {$student->id})\n";
    
    // Ensure student has a section
    if (!$student->section_id) {
        $section = \App\Models\Section::where('grade_id', $student->grade_id)->first();
        if ($section) {
            $student->update(['section_id' => $section->id]);
            echo "  ✅ Assigned to Section {$section->name}\n";
        }
    }
    
    // Get all academic years where this student has marks
    $marksYears = \App\Models\Mark::where('student_id', $student->id)
        ->distinct()
        ->pluck('academic_year_id');
    
    echo "  Found marks in " . $marksYears->count() . " academic years\n";
    
    foreach ($marksYears as $yearId) {
        $year = \App\Models\AcademicYear::find($yearId);
        if (!$year) continue;
        
        // Check if registration exists
        $exists = \App\Models\Registration::where('student_id', $student->id)
            ->where('academic_year_id', $yearId)
            ->exists();
        
        if (!$exists) {
            // Get the grade from marks (in case student changed grades)
            $gradeId = \App\Models\Mark::where('student_id', $student->id)
                ->where('academic_year_id', $yearId)
                ->value('grade_id') ?? $student->grade_id;
            
            \App\Models\Registration::create([
                'student_id' => $student->id,
                'academic_year_id' => $yearId,
                'grade_id' => $gradeId,
                'section_id' => $student->section_id,
                'stream_id' => $student->stream_id,
                'registration_date' => $year->start_date,
                'status' => 'completed'
            ]);
            
            echo "  ✅ Created registration for {$year->name}\n";
        } else {
            echo "  ℹ️  Registration already exists for {$year->name}\n";
        }
    }
    
    echo "\n";
}

echo "=== DONE ===\n";
echo "All students now have registrations for years where they have marks.\n";
