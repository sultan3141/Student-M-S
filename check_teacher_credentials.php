<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== TEACHER CREDENTIALS ===\n\n";

// Get all users with teacher role
$teachers = \App\Models\User::role('teacher')->with('teacher')->get();

if ($teachers->isEmpty()) {
    echo "No teachers found in the database!\n";
    echo "You need to run the seeder first.\n";
} else {
    foreach ($teachers as $user) {
        echo "Name: {$user->name}\n";
        echo "Email: {$user->email}\n";
        echo "Username: {$user->username}\n";
        echo "Password: password (default)\n";
        
        if ($user->teacher) {
            echo "Employee ID: {$user->teacher->employee_id}\n";
            echo "Specialization: {$user->teacher->specialization}\n";
        } else {
            echo "WARNING: No teacher profile found!\n";
        }
        
        echo "\n" . str_repeat("-", 50) . "\n\n";
    }
}

echo "\n=== LOGIN INSTRUCTIONS ===\n";
echo "1. Use either 'email' OR 'username' in the Username field\n";
echo "2. Default password is: password\n";
echo "3. If no teachers exist, run: php artisan db:seed\n";
