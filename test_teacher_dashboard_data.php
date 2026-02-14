<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Teacher;
use App\Models\AcademicYear;
use App\Models\Mark;
use App\Models\Registration;
use App\Models\TeacherAssignment;
use Illuminate\Support\Facades\DB;

echo "=== TEACHER DASHBOARD DATA TEST ===\n\n";

// Get first teacher
$teacher = Teacher::with('user')->first();

if (!$teacher) {
    echo "❌ No teacher found in database!\n";
    echo "   Please create a teacher first.\n";
    exit;
}

echo "✓ Testing for Teacher: {$teacher->user->name} (ID: {$teacher->id})\n\n";

// Get current academic year
$currentYear = AcademicYear::whereRaw('is_current = true')->first();

if (!$currentYear) {
    echo "❌ No current academic year found!\n";
    exit;
}

echo "✓ Current Academic Year: {$currentYear->name} (ID: {$currentYear->id})\n\n";

// Test 1: Grade Distribution
echo "1. Testing Grade Distribution...\n";
$gradeDistribution = Registration::where('academic_year_id', $currentYear->id)
    ->whereIn('section_id', function ($query) use ($teacher) {
        $query->select('section_id')
            ->from('teacher_assignments')
            ->where('teacher_id', $teacher->id);
    })
    ->join('sections', 'registrations.section_id', '=', 'sections.id')
    ->join('grades', 'sections.grade_id', '=', 'grades.id')
    ->select('grades.name', DB::raw('COUNT(DISTINCT registrations.student_id) as count'))
    ->groupBy('grades.name', 'grades.level')
    ->orderBy('grades.level')
    ->get();

echo "   Found " . $gradeDistribution->count() . " grade levels\n";
foreach ($gradeDistribution as $grade) {
    echo "   - {$grade->name}: {$grade->count} students\n";
}
echo "\n";

// Test 2: Assessment Distribution
echo "2. Testing Assessment Distribution...\n";
$assessments = Mark::where('marks.teacher_id', $teacher->id)
    ->where('marks.academic_year_id', $currentYear->id)
    ->join('assessment_types', 'marks.assessment_type_id', '=', 'assessment_types.id')
    ->select('assessment_types.name', DB::raw('COUNT(*) as count'))
    ->groupBy('assessment_types.id', 'assessment_types.name')
    ->get();

$total = $assessments->sum('count');
echo "   Total marks entered: {$total}\n";
foreach ($assessments as $assessment) {
    $percentage = $total > 0 ? round(($assessment->count / $total) * 100, 1) : 0;
    echo "   - {$assessment->name}: {$assessment->count} ({$percentage}%)\n";
}
echo "\n";

// Test 3: Performance Trend
echo "3. Testing Performance Trend...\n";
$trend = Mark::where('teacher_id', $teacher->id)
    ->whereYear('created_at', now()->year)
    ->select(
        DB::raw('EXTRACT(MONTH FROM created_at) as month'),
        DB::raw('AVG(score) as average')
    )
    ->groupBy('month')
    ->orderBy('month')
    ->get();

echo "   Found " . $trend->count() . " months with data\n";
foreach ($trend as $item) {
    $monthName = \Carbon\Carbon::create()->month($item->month)->format('M');
    $avg = round($item->average ?? 0, 1);
    echo "   - {$monthName}: {$avg}%\n";
}
echo "\n";

// Test 4: Statistics
echo "4. Testing Statistics...\n";

$totalStudents = Registration::where('academic_year_id', $currentYear->id)
    ->whereIn('section_id', function ($query) use ($teacher) {
        $query->select('section_id')
            ->from('teacher_assignments')
            ->where('teacher_id', $teacher->id);
    })
    ->distinct('student_id')
    ->count('student_id');

$totalSubjects = TeacherAssignment::where('teacher_id', $teacher->id)
    ->where('academic_year_id', $currentYear->id)
    ->distinct('subject_id')
    ->count('subject_id');

$activeClasses = TeacherAssignment::where('teacher_id', $teacher->id)
    ->where('academic_year_id', $currentYear->id)
    ->distinct('section_id')
    ->count('section_id');

echo "   Total Students: {$totalStudents}\n";
echo "   Total Subjects: {$totalSubjects}\n";
echo "   Active Classes: {$activeClasses}\n";
echo "\n";

// Test 5: Check if data exists
echo "5. Data Availability Check...\n";
$hasGradeData = $gradeDistribution->count() > 0;
$hasAssessmentData = $total > 0;
$hasTrendData = $trend->count() > 0;

echo "   Grade Distribution: " . ($hasGradeData ? "✓ Available" : "❌ No data") . "\n";
echo "   Assessment Distribution: " . ($hasAssessmentData ? "✓ Available" : "❌ No data") . "\n";
echo "   Performance Trend: " . ($hasTrendData ? "✓ Available" : "❌ No data") . "\n";
echo "\n";

if (!$hasGradeData || !$hasAssessmentData || !$hasTrendData) {
    echo "⚠️  Some charts may not display due to missing data.\n";
    echo "   This is normal if:\n";
    echo "   - No students are registered\n";
    echo "   - No marks have been entered\n";
    echo "   - No teacher assignments exist\n";
    echo "\n";
    echo "   To populate data:\n";
    echo "   1. Assign teacher to sections\n";
    echo "   2. Register students in those sections\n";
    echo "   3. Enter marks for assessments\n";
} else {
    echo "✅ All data is available! Charts should display correctly.\n";
}

echo "\n=== TEST COMPLETE ===\n";
