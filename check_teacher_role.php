<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$user = \App\Models\User::where('email', 'teacher@school.com')->first();

if ($user) {
    echo "Teacher User: {$user->name}\n";
    echo "Email: {$user->email}\n";
    
    if (!$user->hasRole('teacher')) {
        $user->assignRole('teacher');
        echo "✓ Teacher role assigned\n";
    } else {
        echo "✓ Teacher already has role\n";
    }
    
    echo "\nRoles: " . $user->roles->pluck('name')->implode(', ') . "\n";
} else {
    echo "Teacher user not found!\n";
}
