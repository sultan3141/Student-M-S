<?php
// fix_subject_duplicates_safe.php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Subject;
use App\Models\Mark;
use App\Models\TeacherAssignment;
use App\Models\Assessment;
use Illuminate\Support\Facades\DB;

echo "Starting Safe Deduplication...\n\n";

$mapping = [
    'MTH101' => 'MATH-10',
    'PHY101' => 'PHY-10',
    'CHM101' => 'CHEM-10',
    'BIO101' => 'BIO-10',
    'ENG101' => 'ENG-10',
    'AMH101' => 'AMH-10',
    'CIV101' => 'CIV-10',
    'HIST101' => 'HIST-10',
    'GEO101' => 'GEO-10',
];

foreach ($mapping as $badCode => $goodCode) {
    echo "Processing $badCode -> $goodCode...\n";

    $badSubject = Subject::where('code', $badCode)->first();
    if (!$badSubject) {
        echo "  - $badCode not found (already fixed?).\n";
        continue;
    }

    $goodSubject = Subject::where('code', $goodCode)
        ->where('grade_id', $badSubject->grade_id)
        ->first();

    if ($goodSubject) {
        echo "  - $goodCode FOUND. Merging...\n";
        
        DB::transaction(function() use ($badSubject, $goodSubject) {
            
            // 1. Teacher Assignments (Handle duplicates)
            $assignments = TeacherAssignment::where('subject_id', $badSubject->id)->get();
            foreach ($assignments as $badAssign) {
                // Check if equivalent assignment exists for good subject
                $exists = TeacherAssignment::where('subject_id', $goodSubject->id)
                    ->where('teacher_id', $badAssign->teacher_id)
                    ->where('section_id', $badAssign->section_id)
                    ->exists();

                if ($exists) {
                    echo "    - Deleting duplicate teacher assignment (ID: {$badAssign->id})\n";
                    $badAssign->delete();
                } else {
                    echo "    - Moving teacher assignment (ID: {$badAssign->id})\n";
                    $badAssign->update(['subject_id' => $goodSubject->id]);
                }
            }

            // 2. Marks (Update subject_id, handle collision if any)
            $marks = Mark::where('subject_id', $badSubject->id)->get();
            foreach ($marks as $mark) {
                // Check if collision could occur (rare, but check unique constraints)
                // Assuming unique(student_id, subject_id, assessment_id, academic_year_id)
                // If collision, we keep the existing one on the target and delete this one
                 $exists = Mark::where('subject_id', $goodSubject->id)
                    ->where('student_id', $mark->student_id)
                    ->where('assessment_id', $mark->assessment_id) // Should differ if assessments differ
                    ->exists();
                
                if ($exists) {
                     $mark->delete();
                } else {
                     $mark->update(['subject_id' => $goodSubject->id]);
                }
            }
            echo "    - Processed " . $marks->count() . " marks.\n";

            // 3. Assessments
            // Assessments usually attach to subject_id.
            $assessments = Assessment::where('subject_id', $badSubject->id)->get();
            foreach ($assessments as $assess) {
                 $assess->update(['subject_id' => $goodSubject->id]);
            }
            echo "    - Moved " . $assessments->count() . " assessments.\n";

            // 4. Delete bad subject
            $badSubject->delete();
            echo "    - Deleted $badSubject->code.\n";
        });

    } else {
        echo "  - $goodCode NOT FOUND. Renaming $badCode -> $goodCode.\n";
        $badSubject->code = $goodCode;
        $badSubject->save();
    }
}

echo "\nCompleted successfully.\n";
