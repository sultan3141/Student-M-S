<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Linking students to parent_mary...\n\n";

$user = App\Models\User::where('username', 'parent_mary')->first();
$parentProfile = App\Models\ParentProfile::where('user_id', $user->id)->first();

// Get some students to link
$students = App\Models\Student::take(2)->get();

if ($students->count() == 0) {
    echo "No students found in database. Creating test students...\n";
    
    // Create test students
    $grade = App\Models\Grade::first();
    $section = App\Models\Section::first();
    
    if (!$grade || !$section) {
        echo "ERROR: No grade or section found. Please run migrations and seeders first.\n";
        exit(1);
    }
    
    for ($i = 1; $i <= 2; $i++) {
        $studentUser = App\Models\User::create([
            'name' => "Student $i",
            'username' => "student_$i",
            'password' => bcrypt('password'),
        ]);
        $studentUser->assignRole('student');
        
        $student = App\Models\Student::create([
            'user_id' => $studentUser->id,
            'student_id' => 'STU' . str_pad($i, 5, '0', STR_PAD_LEFT),
            'first_name' => "Child",
            'last_name' => "Number $i",
            'grade_id' => $grade->id,
            'section_id' => $section->id,
            'dob' => '2010-01-01',
            'gender' => $i % 2 == 0 ? 'Female' : 'Male',
        ]);
        
        $students->push($student);
        echo "✓ Created student: {$student->first_name} {$student->last_name}\n";
    }
}

// Link students to parent
echo "\nLinking students to parent...\n";
foreach ($students as $student) {
    // Check if already linked - use table-qualified column name
    if (!$parentProfile->students()->where('students.id', $student->id)->exists()) {
        $parentProfile->students()->attach($student->id);
        echo "✓ Linked: {$student->first_name} {$student->last_name} (ID: {$student->student_id})\n";
    } else {
        echo "  Already linked: {$student->first_name} {$student->last_name}\n";
    }
}

echo "\n✓ Done! Parent now has " . $parentProfile->students()->count() . " student(s).\n";
