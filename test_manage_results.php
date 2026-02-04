<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Testing Manage Results Feature ===\n\n";

// Check route exists
$routes = \Illuminate\Support\Facades\Route::getRoutes();
$manageResultsRoute = $routes->getByName('teacher.students.manage-results');

if ($manageResultsRoute) {
    echo "✓ Route exists: teacher.students.manage-results\n";
    echo "  URI: " . $manageResultsRoute->uri() . "\n";
    echo "  Method: " . implode('|', $manageResultsRoute->methods()) . "\n";
    echo "  Action: " . $manageResultsRoute->getActionName() . "\n\n";
} else {
    echo "✗ Route NOT found!\n\n";
}

// Check controller method exists
if (method_exists(\App\Http\Controllers\TeacherStudentController::class, 'manageResults')) {
    echo "✓ Controller method exists: TeacherStudentController@manageResults\n\n";
} else {
    echo "✗ Controller method NOT found!\n\n";
}

// Check view file exists
$viewPath = resource_path('js/Pages/Teacher/Students/ManageResults.jsx');
if (file_exists($viewPath)) {
    echo "✓ View file exists: ManageResults.jsx\n";
    echo "  Path: {$viewPath}\n";
    echo "  Size: " . filesize($viewPath) . " bytes\n\n";
} else {
    echo "✗ View file NOT found!\n\n";
}

// Check if Index.jsx has the button
$indexPath = resource_path('js/Pages/Teacher/Students/Index.jsx');
if (file_exists($indexPath)) {
    $content = file_get_contents($indexPath);
    if (strpos($content, 'Manage Results') !== false) {
        echo "✓ 'Manage Results' button found in Index.jsx\n\n";
    } else {
        echo "✗ 'Manage Results' button NOT found in Index.jsx\n\n";
    }
}

echo "=== Access the page at: ===\n";
echo "http://localhost:8000/teacher/students/manage-results\n\n";

echo "=== Or click the button at: ===\n";
echo "http://localhost:8000/teacher/students\n\n";

echo "If you don't see changes:\n";
echo "1. Hard refresh browser (Ctrl+Shift+R)\n";
echo "2. Clear browser cache\n";
echo "3. Check browser console for errors\n";
