<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== CHECKING POSTGRESQL DATABASE ===\n\n";

echo "Database Connection: " . config('database.default') . "\n";
echo "Database Host: " . config('database.connections.pgsql.host') . "\n";
echo "Database Name: " . config('database.connections.pgsql.database') . "\n\n";

try {
    // Test connection
    \Illuminate\Support\Facades\DB::connection()->getPdo();
    echo "✅ Database connection successful!\n\n";
    
    // Count users
    $userCount = \Illuminate\Support\Facades\DB::table('users')->count();
    echo "Total Users: {$userCount}\n\n";
    
    if ($userCount == 0) {
        echo "❌ No users found! You need to run seeders:\n";
        echo "   php artisan db:seed --class=RoleSeeder\n";
        echo "   php artisan db:seed --class=UserSeeder\n";
        exit(1);
    }
    
    // Get all users
    $users = \Illuminate\Support\Facades\DB::table('users')->get();
    
    echo "=== ALL USERS ===\n";
    foreach ($users as $user) {
        echo "ID: {$user->id}\n";
        echo "Name: {$user->name}\n";
        echo "Email: {$user->email}\n";
        echo "Username: {$user->username}\n";
        echo "Created: {$user->created_at}\n";
        echo str_repeat("-", 50) . "\n";
    }
    
    echo "\n=== LOGIN INSTRUCTIONS ===\n";
    echo "Use any username from above with password: password\n";
    
} catch (\Exception $e) {
    echo "❌ Database connection failed!\n";
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
