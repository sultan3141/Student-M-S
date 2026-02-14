<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\AcademicYear;
use App\Models\Grade;
use App\Models\SemesterStatus;
use App\Models\Assessment;
use App\Models\Mark;
use Illuminate\Support\Facades\DB;

echo "=== SEMESTER CONTROL TEST ===\n\n";

// Get current academic year
$currentYear = AcademicYear::whereRaw('is_current = true')->first();

if (!$currentYear) {
    echo "❌ No active academic year found!\n";
    exit(1);
}

echo "✓ Current Academic Year: {$currentYear->name}\n\n";

// Get all grades
$grades = Grade::orderBy('level')->get();
echo "✓ Found " . $grades->count() . " grades\n\n";

// Check semester statuses
echo "=== CURRENT SEMESTER STATUSES ===\n";
foreach ($grades as $grade) {
    echo "\n{$grade->name} (Level {$grade->level}):\n";
    
    foreach ([1, 2] as $semester) {
        $status = SemesterStatus::where('academic_year_id', $currentYear->id)
            ->where('grade_id', $grade->id)
            ->where('semester', $semester)
            ->first();
        
        $statusValue = $status ? $status->status : 'open (default)';
        $icon = ($status && $status->status === 'closed') ? '🔒' : '🔓';
        
        echo "  Semester {$semester}: {$icon} {$statusValue}\n";
        
        // Get statistics
        $assessmentCount = Assessment::where('academic_year_id', $currentYear->id)
            ->where('grade_id', $grade->id)
            ->bySemester($semester)
            ->count();
        
        $markCount = Mark::where('academic_year_id', $currentYear->id)
            ->where('grade_id', $grade->id)
            ->bySemester($semester)
            ->whereNotNull('score')
            ->count();
        
        echo "    - Assessments: {$assessmentCount}\n";
        echo "    - Marks entered: {$markCount}\n";
        
        // Check if assessments are locked
        if ($assessmentCount > 0) {
            $lockedCount = Assessment::where('academic_year_id', $currentYear->id)
                ->where('grade_id', $grade->id)
                ->bySemester($semester)
                ->where('status', 'locked')
                ->count();
            
            echo "    - Locked assessments: {$lockedCount}/{$assessmentCount}\n";
        }
    }
}

echo "\n=== TEST TOGGLE FUNCTIONALITY ===\n";

// Test: Toggle a semester status
$testGrade = $grades->first();
if ($testGrade) {
    echo "\nTesting toggle for {$testGrade->name}, Semester 1...\n";
    
    $currentStatus = SemesterStatus::where('academic_year_id', $currentYear->id)
        ->where('grade_id', $testGrade->id)
        ->where('semester', 1)
        ->first();
    
    $oldStatus = $currentStatus ? $currentStatus->status : 'open';
    $newStatus = $oldStatus === 'open' ? 'closed' : 'open';
    
    echo "Current status: {$oldStatus}\n";
    echo "Will change to: {$newStatus}\n";
    
    // Perform the toggle
    DB::transaction(function () use ($currentYear, $testGrade, $newStatus) {
        SemesterStatus::updateOrCreate(
            [
                'academic_year_id' => $currentYear->id,
                'grade_id' => $testGrade->id,
                'semester' => 1,
            ],
            [
                'status' => $newStatus,
            ]
        );
        
        if ($newStatus === 'closed') {
            Assessment::where('academic_year_id', $currentYear->id)
                ->where('grade_id', $testGrade->id)
                ->bySemester(1)
                ->update([
                    'status' => 'locked',
                ]);
        } else {
            Assessment::where('academic_year_id', $currentYear->id)
                ->where('grade_id', $testGrade->id)
                ->bySemester(1)
                ->update([
                    'status' => 'published',
                ]);
        }
    });
    
    echo "✓ Toggle completed successfully!\n";
    
    // Verify the change
    $updatedStatus = SemesterStatus::where('academic_year_id', $currentYear->id)
        ->where('grade_id', $testGrade->id)
        ->where('semester', 1)
        ->first();
    
    echo "New status: " . ($updatedStatus ? $updatedStatus->status : 'open') . "\n";
    
    // Check assessment lock status
    $assessmentCount = Assessment::where('academic_year_id', $currentYear->id)
        ->where('grade_id', $testGrade->id)
        ->bySemester(1)
        ->count();
    
    if ($assessmentCount > 0) {
        $lockedCount = Assessment::where('academic_year_id', $currentYear->id)
            ->where('grade_id', $testGrade->id)
            ->bySemester(1)
            ->where('status', 'locked')
            ->count();
        
        echo "Assessments locked: {$lockedCount}/{$assessmentCount}\n";
    }
}

echo "\n=== TEST COMPLETE ===\n";
