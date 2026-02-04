<?php

use App\Models\User;
use App\Models\Teacher;
use Spatie\Permission\Models\Role;

// Ensure Teacher role exists
if (!Role::where('name', 'teacher')->exists()) {
    Role::create(['name' => 'teacher']);
    echo "Created 'teacher' role.\n";
}

// Find users who should be teachers
$users = User::all();
$fixedCount = 0;

foreach ($users as $user) {
    if ($user->hasRole('teacher') || str_contains($user->email, 'teacher')) {
        if (!$user->teacher) {
            echo "Creating teacher profile for User: {$user->name} ({$user->email})\n";
            Teacher::create([
                'user_id' => $user->id,
                'employee_id' => 'EMP' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                'qualification' => 'Master of Education',
                'specialization' => 'General',
                'phone' => '1234567890',
                'address' => 'School Campus',
                'department' => 'General',
            ]);
            
            // Ensure role is assigned if not already
            if (!$user->hasRole('teacher')) {
                $user->assignRole('teacher');
            }
            
            $fixedCount++;
        } else {
             echo "User: {$user->name} already has a teacher profile.\n";
        }
    }
}

echo "Fixed {$fixedCount} teacher profiles.\n";
