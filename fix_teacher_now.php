<?php

// Bootstrap Laravel
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Fixing teacher profiles...\n\n";

// Get all users with teacher role
$teacherUsers = DB::table('users')
    ->join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
    ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
    ->where('roles.name', 'teacher')
    ->where('model_has_roles.model_type', 'App\\Models\\User')
    ->select('users.*')
    ->get();

echo "Found " . $teacherUsers->count() . " users with teacher role\n\n";

$created = 0;
$existing = 0;

foreach ($teacherUsers as $user) {
    // Check if teacher profile exists
    $teacher = DB::table('teachers')->where('user_id', $user->id)->first();
    
    if (!$teacher) {
        // Create teacher profile
        DB::table('teachers')->insert([
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
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        echo "✓ Created teacher profile for: {$user->name} (User ID: {$user->id})\n";
        $created++;
    } else {
        echo "- Teacher profile already exists for: {$user->name} (User ID: {$user->id})\n";
        $existing++;
    }
}

echo "\n";
echo "========================================\n";
echo "Summary:\n";
echo "- Created: {$created} teacher profiles\n";
echo "- Already existed: {$existing} teacher profiles\n";
echo "- Total: " . $teacherUsers->count() . " teacher users\n";
echo "========================================\n";
echo "\nDone! You can now access the assessment creation page.\n";
