<?php
// list_grade10_subjects.php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$grade10 = \App\Models\Grade::where('level', 10)->first();
if (!$grade10) die("Grade 10 not found");

$subjects = \App\Models\Subject::where('grade_id', $grade10->id)->get();

echo "Grade 10 Subjects:\n";
foreach ($subjects as $s) {
    echo "- {$s->name} [Code: {$s->code}] [ID: {$s->id}]\n";
}
