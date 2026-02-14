<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Grade;
use App\Models\Stream;
use App\Models\Subject;
use App\Models\Section;
use Illuminate\Support\Facades\DB;

echo "=== ACTUAL SUBJECT CREATION TEST ===\n\n";

// Test data
$testSubject = [
    'name' => 'Test Mathematics',
    'grade_id' => 2, // Grade 10
    'stream_id' => null,
];

echo "1. Testing Subject Creation...\n";
echo "   Subject Name: {$testSubject['name']}\n";
echo "   Grade ID: {$testSubject['grade_id']}\n\n";

try {
    DB::beginTransaction();
    
    // Get grade
    $grade = Grade::find($testSubject['grade_id']);
    if (!$grade) {
        throw new Exception("Grade not found!");
    }
    echo "   ✓ Grade found: {$grade->name}\n";
    
    // Check if Grade 11 or 12
    $isGrade11or12 = str_contains($grade->name, '11') || str_contains($grade->name, '12');
    echo "   Is Grade 11/12: " . ($isGrade11or12 ? 'Yes' : 'No') . "\n";
    
    // Generate subject code
    $words = explode(' ', trim($testSubject['name']));
    $prefix = '';
    if (count($words) > 1) {
        foreach (array_slice($words, 0, 4) as $word) {
            $prefix .= strtoupper(substr($word, 0, 1));
        }
    } else {
        $prefix = strtoupper(substr($testSubject['name'], 0, 4));
    }
    
    $gradeNumber = '';
    if (preg_match('/\d+/', $grade->name, $matches)) {
        $gradeNumber = $matches[0];
    }
    
    $baseCode = $prefix . '-' . $gradeNumber;
    
    // Check for uniqueness
    $code = $baseCode;
    $counter = 1;
    while (Subject::where('code', $code)->exists()) {
        $code = $baseCode . '-' . $counter;
        $counter++;
    }
    
    echo "   ✓ Generated code: {$code}\n";
    
    // Create subject
    $subject = Subject::create([
        'name' => $testSubject['name'],
        'code' => $code,
        'grade_id' => $testSubject['grade_id'],
        'stream_id' => $testSubject['stream_id'],
    ]);
    
    echo "   ✓ Subject created with ID: {$subject->id}\n";
    
    // Get sections to assign
    if ($isGrade11or12 && $testSubject['stream_id']) {
        $sections = Section::where('grade_id', $testSubject['grade_id'])
            ->where('stream_id', $testSubject['stream_id'])
            ->get();
    } else {
        $sections = Section::where('grade_id', $testSubject['grade_id'])->get();
    }
    
    echo "   ✓ Found {$sections->count()} sections to assign\n";
    
    // Assign to sections
    $assigned = 0;
    foreach ($sections as $section) {
        $exists = DB::table('grade_subject')
            ->where('grade_id', $testSubject['grade_id'])
            ->where('section_id', $section->id)
            ->where('subject_id', $subject->id)
            ->exists();
        
        if (!$exists) {
            DB::statement("
                INSERT INTO grade_subject (grade_id, section_id, subject_id, is_active, created_at, updated_at)
                VALUES (?, ?, ?, true, ?, ?)
            ", [
                $testSubject['grade_id'],
                $section->id,
                $subject->id,
                now(),
                now()
            ]);
            $assigned++;
        }
    }
    
    echo "   ✓ Assigned to {$assigned} sections\n";
    
    // Rollback (don't actually save)
    DB::rollBack();
    
    echo "\n✅ TEST PASSED - Subject creation works correctly!\n";
    echo "   (Transaction rolled back - no data saved)\n";
    
} catch (\Exception $e) {
    DB::rollBack();
    echo "\n❌ TEST FAILED!\n";
    echo "   Error: " . $e->getMessage() . "\n";
    echo "   File: " . $e->getFile() . "\n";
    echo "   Line: " . $e->getLine() . "\n";
}

echo "\n=== TEST COMPLETE ===\n";
