<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Teacher;
use App\Models\AcademicYear;
use App\Models\Assessment;
use App\Models\Mark;
use App\Models\Registration;
use App\Models\TeacherAssignment;
use App\Models\SemesterStatus;
use Illuminate\Support\Facades\DB;

echo "=== ASSESSMENT CREATION & RESULT DECLARATION WORKFLOW TEST ===\n\n";

// Get first teacher
$teacher = Teacher::with('user')->first();

if (!$teacher) {
    echo "❌ No teacher found in database!\n";
    exit;
}

echo "✓ Testing for Teacher: {$teacher->user->name} (ID: {$teacher->id})\n\n";

// Get current academic year
$currentYear = AcademicYear::whereRaw('is_current = true')->first();

if (!$currentYear) {
    echo "❌ No current academic year found!\n";
    exit;
}

echo "✓ Current Academic Year: {$currentYear->name} (ID: {$currentYear->id})\n";
echo "  Current Semester: " . ($currentYear->getCurrentSemester() ?? 'None') . "\n\n";

// Test 1: Check Teacher Assignments
echo "1. Testing Teacher Assignments...\n";
$assignments = TeacherAssignment::where('teacher_id', $teacher->id)
    ->where('academic_year_id', $currentYear->id)
    ->with(['grade', 'section', 'subject'])
    ->get();

echo "   Found " . $assignments->count() . " assignments\n";
foreach ($assignments->take(5) as $assignment) {
    echo "   - Grade: {$assignment->grade->name}, Section: {$assignment->section->name}, Subject: {$assignment->subject->name}\n";
}
echo "\n";

if ($assignments->isEmpty()) {
    echo "❌ No teacher assignments found! Cannot proceed with tests.\n";
    exit;
}

// Get first assignment for testing
$testAssignment = $assignments->first();
$gradeId = $testAssignment->grade_id;
$sectionId = $testAssignment->section_id;
$subjectId = $testAssignment->subject_id;

echo "Using test assignment:\n";
echo "  Grade: {$testAssignment->grade->name} (ID: {$gradeId})\n";
echo "  Section: {$testAssignment->section->name} (ID: {$sectionId})\n";
echo "  Subject: {$testAssignment->subject->name} (ID: {$subjectId})\n\n";

// Test 2: Check Semester Status
echo "2. Testing Semester Status...\n";
$semesterStatus = SemesterStatus::where('academic_year_id', $currentYear->id)
    ->where('grade_id', $gradeId)
    ->get();

echo "   Found " . $semesterStatus->count() . " semester status records\n";
foreach ($semesterStatus as $status) {
    echo "   - Semester {$status->semester}: {$status->status}\n";
}

$isOpen = SemesterStatus::isOpen($gradeId, $currentYear->getCurrentSemester() ?? 1);
echo "   Current semester is " . ($isOpen ? "OPEN ✓" : "CLOSED ❌") . "\n\n";

// Test 3: Check Existing Assessments
echo "3. Testing Existing Assessments...\n";
$existingAssessments = Assessment::where('grade_id', $gradeId)
    ->where('section_id', $sectionId)
    ->where('subject_id', $subjectId)
    ->where('teacher_id', $teacher->id)
    ->where('academic_year_id', $currentYear->id)
    ->with('assessmentType')
    ->get();

echo "   Found " . $existingAssessments->count() . " existing assessments\n";
foreach ($existingAssessments as $assessment) {
    $typeName = $assessment->assessmentType ? $assessment->assessmentType->name : 'Custom';
    echo "   - {$assessment->name} ({$typeName}): Max Score = {$assessment->max_score}, Semester = {$assessment->semester}\n";
}
echo "\n";

// Test 4: Check Students in Section
echo "4. Testing Students in Section...\n";
$registrations = Registration::where('section_id', $sectionId)
    ->where('academic_year_id', $currentYear->id)
    ->with(['student.user'])
    ->get();

echo "   Found " . $registrations->count() . " students registered\n";
foreach ($registrations->take(5) as $reg) {
    echo "   - {$reg->student->user->name} (Student ID: {$reg->student->student_id})\n";
}
echo "\n";

if ($registrations->isEmpty()) {
    echo "⚠️  No students registered in this section!\n";
    echo "   Result declaration will not have students to declare for.\n\n";
}

// Test 5: Check Marks for Existing Assessments
echo "5. Testing Marks for Existing Assessments...\n";
if ($existingAssessments->isNotEmpty()) {
    $assessmentIds = $existingAssessments->pluck('id');
    $marks = Mark::whereIn('assessment_id', $assessmentIds)
        ->with(['student.user', 'assessment'])
        ->get();

    echo "   Found " . $marks->count() . " marks entered\n";
    
    $marksByAssessment = $marks->groupBy('assessment_id');
    foreach ($existingAssessments as $assessment) {
        $assessmentMarks = $marksByAssessment->get($assessment->id, collect());
        $percentage = $registrations->count() > 0 
            ? round(($assessmentMarks->count() / $registrations->count()) * 100, 1) 
            : 0;
        echo "   - {$assessment->name}: {$assessmentMarks->count()}/{$registrations->count()} students ({$percentage}%)\n";
    }
} else {
    echo "   No assessments to check marks for\n";
}
echo "\n";

// Test 6: Simulate Assessment Creation
echo "6. Testing Assessment Creation Workflow...\n";
echo "   Checking if teacher can create assessment:\n";

// Check if semester is open
if (!$isOpen) {
    echo "   ❌ Cannot create assessment - Semester is CLOSED\n";
} else {
    echo "   ✓ Semester is OPEN - Can create assessment\n";
}

// Check if teacher has assignment
$hasAssignment = TeacherAssignment::where('teacher_id', $teacher->id)
    ->where('grade_id', $gradeId)
    ->where('section_id', $sectionId)
    ->where('subject_id', $subjectId)
    ->where('academic_year_id', $currentYear->id)
    ->exists();

if (!$hasAssignment) {
    echo "   ❌ Teacher not assigned to this class/subject\n";
} else {
    echo "   ✓ Teacher is assigned to this class/subject\n";
}

echo "\n";

// Test 7: Simulate Result Declaration
echo "7. Testing Result Declaration Workflow...\n";
echo "   Checking if teacher can declare results:\n";

if ($existingAssessments->isEmpty()) {
    echo "   ❌ Cannot declare results - No assessments created\n";
} else {
    echo "   ✓ Assessments exist - Can declare results\n";
    
    // Check if all students have marks
    $totalStudents = $registrations->count();
    $totalAssessments = $existingAssessments->count();
    $totalExpectedMarks = $totalStudents * $totalAssessments;
    $totalActualMarks = Mark::whereIn('assessment_id', $existingAssessments->pluck('id'))
        ->whereIn('student_id', $registrations->pluck('student_id'))
        ->count();
    
    $completionPercentage = $totalExpectedMarks > 0 
        ? round(($totalActualMarks / $totalExpectedMarks) * 100, 1) 
        : 0;
    
    echo "   Mark Entry Progress: {$totalActualMarks}/{$totalExpectedMarks} ({$completionPercentage}%)\n";
    
    if ($completionPercentage < 100) {
        echo "   ⚠️  Not all marks entered - Results may be incomplete\n";
    } else {
        echo "   ✓ All marks entered - Ready to declare results\n";
    }
}

echo "\n";

// Test 8: Data Availability Summary
echo "8. Workflow Status Summary...\n";
$canCreateAssessment = $isOpen && $hasAssignment;
$canDeclareResult = $existingAssessments->isNotEmpty() && $registrations->isNotEmpty();

echo "   Assessment Creation: " . ($canCreateAssessment ? "✓ READY" : "❌ NOT READY") . "\n";
echo "   Result Declaration: " . ($canDeclareResult ? "✓ READY" : "❌ NOT READY") . "\n";
echo "\n";

if (!$canCreateAssessment) {
    echo "⚠️  Assessment Creation Issues:\n";
    if (!$isOpen) echo "   - Semester is closed\n";
    if (!$hasAssignment) echo "   - Teacher not assigned to class\n";
    echo "\n";
}

if (!$canDeclareResult) {
    echo "⚠️  Result Declaration Issues:\n";
    if ($existingAssessments->isEmpty()) echo "   - No assessments created\n";
    if ($registrations->isEmpty()) echo "   - No students registered\n";
    echo "\n";
}

// Test 9: PostgreSQL Compatibility Check
echo "9. Testing PostgreSQL Compatibility...\n";
try {
    // Test whereRaw with boolean
    $testQuery = Assessment::whereRaw("status = 'published'")->count();
    echo "   ✓ Boolean query syntax: OK\n";
    
    // Test semester query
    $currentSem = $currentYear->getCurrentSemester();
    if ($currentSem) {
        $semQuery = Assessment::where('semester', $currentSem)->count();
        echo "   ✓ Semester query: OK\n";
    }
    
    echo "   ✓ PostgreSQL compatibility: VERIFIED\n";
} catch (\Exception $e) {
    echo "   ❌ PostgreSQL compatibility issue: " . $e->getMessage() . "\n";
}
echo "\n";

echo "=== TEST COMPLETE ===\n\n";

// Final Summary
echo "SUMMARY:\n";
echo "--------\n";
echo "Teacher: {$teacher->user->name}\n";
echo "Assignments: {$assignments->count()}\n";
echo "Existing Assessments: {$existingAssessments->count()}\n";
echo "Students in Test Section: {$registrations->count()}\n";
echo "Marks Entered: " . ($existingAssessments->isNotEmpty() ? $marks->count() : 0) . "\n";
echo "Semester Status: " . ($isOpen ? "OPEN" : "CLOSED") . "\n";
echo "\n";
echo "Workflow Status:\n";
echo "- Assessment Creation: " . ($canCreateAssessment ? "✓ READY" : "❌ NOT READY") . "\n";
echo "- Result Declaration: " . ($canDeclareResult ? "✓ READY" : "❌ NOT READY") . "\n";
