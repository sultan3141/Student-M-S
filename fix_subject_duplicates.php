<?php
// fix_subject_duplicates.php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Subject;
use App\Models\Mark;
use App\Models\TeacherAssignment;
use App\Models\Assessment;
use Illuminate\Support\Facades\DB;

echo "Starting Subject Deduplication and Standardization...\n\n";

// Map: Bad Code => Good Code (Standard Format)
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
        echo "  - Duplicate source ($badCode) not found. Skipping.\n";
        continue;
    }

    $goodSubject = Subject::where('code', $goodCode)
        ->where('grade_id', $badSubject->grade_id)
        ->first();

    if ($goodSubject) {
        // CASE 1: Both exist. Duplicate found.
        echo "  - Target subject ($goodCode) EXISTS. Merging data...\n";
        
        DB::transaction(function() use ($badSubject, $goodSubject) {
            // 1. Marks
            $marksCount = Mark::where('subject_id', $badSubject->id)->count();
            if ($marksCount > 0) {
                Mark::where('subject_id', $badSubject->id)->update(['subject_id' => $goodSubject->id]);
                echo "    - Moved $marksCount marks.\n";
            }

            // 2. Teacher Assignments
            $assignCount = TeacherAssignment::where('subject_id', $badSubject->id)->count();
            if ($assignCount > 0) {
                TeacherAssignment::where('subject_id', $badSubject->id)->update(['subject_id' => $goodSubject->id]);
                echo "    - Moved $assignCount assignments.\n";
            }

            // 3. Assessments
            $assessCount = Assessment::where('subject_id', $badSubject->id)->count();
            if ($assessCount > 0) {
                Assessment::where('subject_id', $badSubject->id)->update(['subject_id' => $goodSubject->id]);
                echo "    - Moved $assessCount assessments.\n";
            }
            
            // 4. Delete bad subject
            $badSubject->delete();
            echo "    - Deleted duplicate subject ($badSubject->code).\n";
        });

    } else {
        // CASE 2: Good subject doesn't exist. Just rename the bad one.
        echo "  - Target subject ($goodCode) NOT FOUND. Renaming...\n";
        $badSubject->code = $goodCode;
        $badSubject->save();
        echo "    - Renamed $badCode to $goodCode.\n";
    }
}

echo "\nDone!\n";
