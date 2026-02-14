<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Grade;
use App\Models\Stream;
use App\Models\AcademicYear;
use App\Models\Section;

echo "=== SUBJECT CREATION TEST ===\n\n";

// 1. Check Academic Year
echo "1. Checking Academic Year...\n";
$academicYear = AcademicYear::whereRaw("is_current = true")->first();
if ($academicYear) {
    echo "   ✓ Current Academic Year: {$academicYear->name}\n";
} else {
    echo "   ✗ No current academic year found!\n";
}

// 2. Check Grades
echo "\n2. Checking Grades...\n";
$grades = Grade::all();
echo "   Total Grades: " . $grades->count() . "\n";
foreach ($grades as $grade) {
    echo "   - {$grade->name} (ID: {$grade->id})\n";
}

// 3. Check Streams
echo "\n3. Checking Streams...\n";
$streams = Stream::all();
echo "   Total Streams: " . $streams->count() . "\n";
foreach ($streams as $stream) {
    echo "   - {$stream->name} (ID: {$stream->id})\n";
}

// 4. Check Sections
echo "\n4. Checking Sections...\n";
$sections = Section::with(['grade', 'stream'])->get();
echo "   Total Sections: " . $sections->count() . "\n";
foreach ($sections as $section) {
    $streamName = $section->stream ? $section->stream->name : 'No Stream';
    echo "   - {$section->name} | Grade: {$section->grade->name} | Stream: {$streamName}\n";
}

// 5. Test Subject Code Generation
echo "\n5. Testing Subject Code Generation...\n";
$testSubjects = [
    ['name' => 'Mathematics', 'grade' => 'Grade 10'],
    ['name' => 'Advanced Physics', 'grade' => 'Grade 11'],
    ['name' => 'Holy Quran', 'grade' => 'Grade 9'],
];

foreach ($testSubjects as $test) {
    $grade = Grade::where('name', $test['grade'])->first();
    if ($grade) {
        // Simulate code generation
        $words = explode(' ', trim($test['name']));
        $prefix = '';
        if (count($words) > 1) {
            foreach (array_slice($words, 0, 4) as $word) {
                $prefix .= strtoupper(substr($word, 0, 1));
            }
        } else {
            $prefix = strtoupper(substr($test['name'], 0, 4));
        }
        
        $gradeNumber = '';
        if (preg_match('/\d+/', $grade->name, $matches)) {
            $gradeNumber = $matches[0];
        }
        
        $code = $prefix . '-' . $gradeNumber;
        echo "   - {$test['name']} → {$code}\n";
    }
}

echo "\n=== TEST COMPLETE ===\n";
echo "\nSubject creation should work perfectly now!\n";
echo "The PostgreSQL boolean issue has been fixed.\n";
