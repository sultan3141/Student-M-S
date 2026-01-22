<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

$users = ['student_alice', 'director', 'admin_main', 'parent_mary'];

foreach ($users as $username) {
    $user = User::where('username', $username)->first();
    if ($user) {
        echo "User: $username (ID: {$user->id})" . PHP_EOL;
        $rolesWithGuards = $user->roles()->get()->map(function($role) {
            return $role->name . ' (' . $role->guard_name . ')';
        })->toArray();
        echo "Roles: " . implode(', ', $rolesWithGuards) . PHP_EOL;
        
        $pivot = \DB::table('model_has_roles')->where('model_id', $user->id)->get();
        foreach ($pivot as $p) {
            echo "Pivot: Role ID {$p->role_id}, Model Type {$p->model_type}" . PHP_EOL;
        }
        echo "---" . PHP_EOL;
    } else {
        echo "User: $username NOT FOUND" . PHP_EOL;
    }
}

echo "All Roles in Database:" . PHP_EOL;
foreach (\Spatie\Permission\Models\Role::all() as $r) {
    echo "- Name: {$r->name}, Guard: {$r->guard_name}" . PHP_EOL;
}
