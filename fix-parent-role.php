<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Checking parent_mary user...\n";

$user = App\Models\User::where('username', 'parent_mary')->first();

if (!$user) {
    echo "ERROR: parent_mary user not found!\n";
    exit(1);
}

echo "User found: {$user->name}\n";
echo "Current roles: " . $user->roles->pluck('name')->join(', ') . "\n\n";

// Check if user has parent role
if (!$user->hasRole('parent')) {
    echo "Adding 'parent' role to user...\n";
    $user->assignRole('parent');
    echo "✓ Parent role assigned!\n";
} else {
    echo "✓ User already has parent role\n";
}

// Verify parent profile exists
$parentProfile = App\Models\ParentProfile::where('user_id', $user->id)->first();
if (!$parentProfile) {
    echo "\nWARNING: No parent profile found for this user!\n";
    echo "Creating parent profile...\n";
    $parentProfile = App\Models\ParentProfile::create([
        'user_id' => $user->id,
        'phone' => '0911234567',
        'address' => 'Addis Ababa, Ethiopia',
    ]);
    echo "✓ Parent profile created!\n";
} else {
    echo "\n✓ Parent profile exists\n";
}

// Check students
echo "\nChecking students linked to this parent...\n";
$students = $parentProfile->students;
echo "Number of students: " . $students->count() . "\n";

if ($students->count() > 0) {
    foreach ($students as $student) {
        echo "  - {$student->first_name} {$student->last_name} (ID: {$student->student_id})\n";
    }
} else {
    echo "  No students linked to this parent\n";
}

echo "\n✓ Done!\n";
