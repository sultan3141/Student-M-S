<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Models\Teacher;

// Get user ID 3
$user = User::find(3);

if (!$user) {
    echo "User with ID 3 not found.\n";
    exit(1);
}

echo "User found: {$user->name} ({$user->email})\n";
echo "User has role: " . ($user->hasRole('teacher') ? 'teacher' : 'NOT teacher') . "\n";

// Check if teacher profile exists
$teacher = Teacher::where('user_id', $user->id)->first();

if ($teacher) {
    echo "Teacher profile already exists (ID: {$teacher->id})\n";
} else {
    echo "Creating teacher profile...\n";
    
    $teacher = Teacher::create([
        'user_id' => $user->id,
        'employee_id' => 'T' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
        'first_name' => $user->name,
        'last_name' => '',
        'email' => $user->email,
        'phone' => '',
        'date_of_birth' => null,
        'hire_date' => now(),
        'qualification' => '',
        'specialization' => '',
        'status' => 'active',
    ]);
    
    echo "Teacher profile created successfully (ID: {$teacher->id})\n";
}

// Check if user has teacher role
if (!$user->hasRole('teacher')) {
    echo "Adding teacher role to user...\n";
    $user->assignRole('teacher');
    echo "Teacher role assigned.\n";
}

echo "\nDone!\n";
