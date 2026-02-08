<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    // Test the semester record controller
    $user = \App\Models\User::where('email', 'like', '%student%')->first();
    
    if (!$user) {
        echo "No student user found!\n";
        exit;
    }
    
    echo "User found: {$user->email}\n";
    
    auth()->login($user);
    
    $student = $user->student;
    if (!$student) {
        echo "User has no student profile!\n";
        exit;
    }
    
    echo "Student found: ID={$student->id}, Section={$student->section_id}\n";
    
    // Try to get the semester record
    $controller = new \App\Http\Controllers\SemesterRecordController();
    $academicYear = \App\Models\AcademicYear::where('is_current', true)->first();
    
    if (!$academicYear) {
        echo "No current academic year!\n";
        exit;
    }
    
    echo "Academic Year: {$academicYear->name}\n";
    
    // Call the show method
    $result = $controller->show(1, $academicYear->id);
    
    echo "Success! Controller returned data.\n";
    print_r($result);
    
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
    echo "\n--- STACK TRACE ---\n";
    echo $e->getTraceAsString() . "\n";
}
