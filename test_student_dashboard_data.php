<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Student;
use App\Models\AcademicYear;
use App\Models\Mark;
use App\Models\Attendance;
use App\Models\Announcement;
use Illuminate\Support\Facades\DB;

echo "=== STUDENT DASHBOARD DATA TEST ===\n\n";

// Get first student
$student = Student::with(['user', 'grade', 'section'])->first();

if (!$student) {
    echo "❌ No student found in database!\n";
    echo "   Please create a student first.\n";
    exit;
}

echo "✓ Testing for Student: {$student->user->name} (ID: {$student->id})\n";
echo "  Grade: {$student->grade->name}\n";
echo "  Section: {$student->section->name}\n\n";

// Get current academic year
$currentYear = AcademicYear::whereRaw('is_current = true')->first();

if (!$currentYear) {
    echo "❌ No current academic year found!\n";
    exit;
}

echo "✓ Current Academic Year: {$currentYear->name} (ID: {$currentYear->id})\n\n";

// Test 1: Performance Chart Data (Recent Marks)
echo "1. Testing Performance Chart Data (Recent Marks)...\n";
$recentMarks = Mark::where('student_id', $student->id)
    ->where('academic_year_id', $currentYear->id)
    ->with(['subject:id,name', 'assessment:id,name', 'assessmentType:id,name'])
    ->latest()
    ->take(5)
    ->get();

echo "   Found " . $recentMarks->count() . " recent marks\n";
foreach ($recentMarks as $mark) {
    $subject = $mark->subject->name ?? 'Unknown';
    $assessment = $mark->assessment->name ?? $mark->assessmentType->name ?? 'Grade Entry';
    $percentage = $mark->max_score > 0 ? round(($mark->score / $mark->max_score) * 100, 1) : 0;
    echo "   - {$subject} ({$assessment}): {$mark->score}/{$mark->max_score} ({$percentage}%)\n";
}
echo "\n";

// Test 2: Assessment Distribution (Donut Chart)
echo "2. Testing Assessment Distribution (Donut Chart)...\n";
$allMarks = Mark::where('student_id', $student->id)
    ->with(['assessmentType:id,name'])
    ->get();

$assessmentCounts = $allMarks->groupBy('assessment_type_id')->map(fn($group) => count($group));
$totalAssessments = $assessmentCounts->sum();

echo "   Total assessments: {$totalAssessments}\n";
foreach ($allMarks->groupBy('assessment_type_id') as $typeId => $marks) {
    $typeName = $marks->first()->assessmentType->name ?? 'Unknown';
    $count = $marks->count();
    $percentage = $totalAssessments > 0 ? round(($count / $totalAssessments) * 100, 1) : 0;
    echo "   - {$typeName}: {$count} ({$percentage}%)\n";
}
echo "\n";

// Test 3: School Population (Bar Chart)
echo "3. Testing School Population Data (Bar Chart)...\n";
$totalStudents = Student::count();
$maleStudents = Student::where('gender', 'Male')->count();
$femaleStudents = Student::where('gender', 'Female')->count();

echo "   Total Students: {$totalStudents}\n";
echo "   Male Students: {$maleStudents}\n";
echo "   Female Students: {$femaleStudents}\n";
echo "\n";

// Test 4: Instructor-Student Comparison
echo "4. Testing Instructor-Student Data...\n";
$totalInstructors = DB::table('users')
    ->join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
    ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
    ->where('roles.name', 'teacher')
    ->where('model_has_roles.model_type', 'App\\Models\\User')
    ->count();

echo "   Total Instructors: {$totalInstructors}\n";
echo "   Total Students: {$totalStudents}\n";
echo "\n";

// Test 5: Statistics
echo "5. Testing Dashboard Statistics...\n";

// Calculate average
$averageScore = Mark::where('student_id', $student->id)
    ->where('academic_year_id', $currentYear->id)
    ->avg('score');

echo "   Average Score: " . round($averageScore ?? 0, 1) . "\n";

// Calculate attendance rate
$totalAttendance = Attendance::where('student_id', $student->id)
    ->where('academic_year_id', $currentYear->id)
    ->count();

$presentCount = Attendance::where('student_id', $student->id)
    ->where('academic_year_id', $currentYear->id)
    ->where('status', 'present')
    ->count();

$attendanceRate = $totalAttendance > 0 ? round(($presentCount / $totalAttendance) * 100, 1) : 100;
echo "   Attendance Rate: {$attendanceRate}%\n";

// Total subjects
$totalSubjects = DB::table('subjects')
    ->join('grade_subject', 'subjects.id', '=', 'grade_subject.subject_id')
    ->where('grade_subject.grade_id', $student->grade_id)
    ->count();

echo "   Total Subjects: {$totalSubjects}\n";
echo "\n";

// Test 6: Announcements
echo "6. Testing Announcements...\n";
$announcements = Announcement::where('status', 'sent')
    ->where(function ($q) use ($student) {
        $q->where('recipient_type', 'all_students')
            ->orWhere('recipient_type', 'grade_' . $student->grade_id);
    })
    ->latest()
    ->take(5)
    ->get();

echo "   Found " . $announcements->count() . " announcements\n";
foreach ($announcements as $announcement) {
    echo "   - {$announcement->subject}\n";
}
echo "\n";

// Test 7: Data Availability Check
echo "7. Data Availability Check...\n";
$hasMarks = $recentMarks->count() > 0;
$hasAssessments = $totalAssessments > 0;
$hasPopulationData = $totalStudents > 0;
$hasInstructorData = $totalInstructors > 0;

echo "   Performance Chart: " . ($hasMarks ? "✓ Available" : "❌ No data") . "\n";
echo "   Assessment Distribution: " . ($hasAssessments ? "✓ Available" : "❌ No data") . "\n";
echo "   School Population: " . ($hasPopulationData ? "✓ Available" : "❌ No data") . "\n";
echo "   Instructor-Student: " . ($hasInstructorData ? "✓ Available" : "❌ No data") . "\n";
echo "\n";

if (!$hasMarks || !$hasAssessments) {
    echo "⚠️  Some charts may not display due to missing data.\n";
    echo "   This is normal if:\n";
    echo "   - No marks have been entered for this student\n";
    echo "   - No assessments have been created\n";
    echo "\n";
    echo "   To populate data:\n";
    echo "   1. Login as Teacher\n";
    echo "   2. Go to Assessments → Enter Marks\n";
    echo "   3. Enter marks for this student\n";
} else {
    echo "✅ All data is available! Charts should display correctly.\n";
}

echo "\n=== TEST COMPLETE ===\n";
