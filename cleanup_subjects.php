<?php

// Quick script to remove duplicate subjects
require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Removing duplicate subjects...\n";

$duplicateCodes = [
    'MTH101', 'PHY101', 'CHM101',
    'BIO101', 'ENG101', 'AMH101', 'CIV101'
];

$deleted = \App\Models\Subject::whereIn('code', $duplicateCodes)->delete();

echo "✅ Removed {$deleted} duplicate subject(s)\n";

// Show remaining subjects for Grade 10
$grade10 = \App\Models\Grade::where('level', 10)->first();
if ($grade10) {
    $subjects = \App\Models\Subject::where('grade_id', $grade10->id)->get();
    echo "\nRemaining subjects for Grade 10:\n";
    foreach ($subjects as $subject) {
        echo "- {$subject->name} ({$subject->code})\n";
    }
}
