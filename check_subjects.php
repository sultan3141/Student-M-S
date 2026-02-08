<?php
// check_subjects.php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$subjects = \App\Models\Subject::orderBy('name')->get();

echo "Total Subjects: " . $subjects->count() . "\n";
foreach ($subjects as $subject) {
    echo "[ID: {$subject->id}] {$subject->name} (Code: {$subject->code}) - Grade ID: {$subject->grade_id}\n";
}

// Check if any marks exist for the duplicate codes
$duplicateCodes = ['MTH101', 'PHY101', 'CHM101', 'BIO101', 'ENG101', 'AMH101', 'CIV101'];
$badSubjects = \App\Models\Subject::whereIn('code', $duplicateCodes)->get();

if ($badSubjects->count() > 0) {
    echo "\n⚠️ Found " . $badSubjects->count() . " duplicate subjects:\n";
    foreach ($badSubjects as $sub) {
        $marksCount = \App\Models\Mark::where('subject_id', $sub->id)->count();
        $assignCount = \App\Models\TeacherAssignment::where('subject_id', $sub->id)->count();
        echo " - {$sub->name} ({$sub->code}): Has $marksCount marks, $assignCount teacher assignments\n";
    }
} else {
    echo "\n✅ No duplicate subjects with '101' codes found.\n";
}
