<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Http\Controllers\TeacherDashboardController;
use Illuminate\Support\Facades\Auth;

try {
    $teacherUser = User::role('teacher')->first();
    if (!$teacherUser) {
        echo "No teacher user found in DB.\n";
        exit;
    }

    echo "Testing dashboard for Teacher: {$teacherUser->name} (ID: {$teacherUser->id})\n";
    Auth::login($teacherUser);

    $controller = new TeacherDashboardController();
    $response = $controller->index();

    echo "SUCCESS: Dashboard rendered.\n";
    // print_r($response->toResponse(request())->getData());

} catch (\Throwable $e) {
    echo "EXCEPTION: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " Line: " . $e->getLine() . "\n";
    echo $e->getTraceAsString() . "\n";
}
