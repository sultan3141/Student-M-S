<?php

use App\Models\Student;
use App\Models\Mark;
use App\Models\AcademicYear;
use App\Models\SemesterPeriod;

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$student = Student::first();
echo "Student ID: " . ($student ? $student->id . " (" . $student->user->name . ")" : "None") . "\n";

if (!$student) exit;

$year = AcademicYear::where('is_current', true)->first();
echo "Current Year: " . ($year ? $year->name . " (ID: " . $year->id . ")" : "None") . "\n";

if ($year) {
    $periods = SemesterPeriod::where('academic_year_id', $year->id)->get();
    foreach ($periods as $p) {
        echo "Semester {$p->semester}: Status={$p->status}\n";
    }
}

$marksCount = Mark::where('student_id', $student->id)->count();
echo "Total Marks: $marksCount\n";

if ($year) {
    $currentYearMarks = Mark::where('student_id', $student->id)
        ->where('academic_year_id', $year->id)
        ->count();
    echo "Marks in Current Year: $currentYearMarks\n";
}
