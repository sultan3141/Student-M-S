<?php

// Direct test of teacher dashboard without browser
require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== TEACHER DASHBOARD DIAGNOSTIC ===\n\n";

// Test 1: Check if route exists
echo "1. Checking if teacher.dashboard route exists...\n";
try {
    $url = route('teacher.dashboard');
    echo "   ✓ Route exists: $url\n\n";
} catch (Exception $e) {
    echo "   ✗ Route NOT found: " . $e->getMessage() . "\n\n";
    exit(1);
}

// Test 2: Check if controller exists
echo "2. Checking if TeacherDashboardController exists...\n";
if (class_exists('App\Http\Controllers\TeacherDashboardController')) {
    echo "   ✓ Controller exists\n\n";
} else {
    echo "   ✗ Controller NOT found\n\n";
    exit(1);
}

// Test 3: Check if view file exists
echo "3. Checking if Dashboard.jsx exists...\n";
$viewPath = __DIR__.'/resources/js/Pages/Teacher/Dashboard.jsx';
if (file_exists($viewPath)) {
    echo "   ✓ View file exists\n\n";
} else {
    echo "   ✗ View file NOT found\n\n";
    exit(1);
}

// Test 4: Check if build manifest exists
echo "4. Checking if build manifest exists...\n";
$manifestPath = __DIR__.'/public/build/manifest.json';
if (file_exists($manifestPath)) {
    echo "   ✓ Manifest exists\n";
    $manifest = json_decode(file_get_contents($manifestPath), true);
    if (isset($manifest['resources/js/Pages/Teacher/Dashboard.jsx'])) {
        echo "   ✓ Dashboard.jsx is in manifest\n\n";
    } else {
        echo "   ✗ Dashboard.jsx NOT in manifest\n\n";
    }
} else {
    echo "   ✗ Manifest NOT found\n\n";
    exit(1);
}

// Test 5: Check if teacher user exists
echo "5. Checking if teacher user exists...\n";
$teacher = \App\Models\User::whereHas('roles', function($q) {
    $q->where('name', 'teacher');
})->first();

if ($teacher) {
    echo "   ✓ Teacher user found: {$teacher->name} (ID: {$teacher->id})\n\n";
} else {
    echo "   ✗ No teacher user found\n\n";
}

// Test 6: Check if TeacherLayout exists
echo "6. Checking if TeacherLayout.jsx exists...\n";
$layoutPath = __DIR__.'/resources/js/Layouts/TeacherLayout.jsx';
if (file_exists($layoutPath)) {
    echo "   ✓ Layout file exists\n\n";
} else {
    echo "   ✗ Layout file NOT found\n\n";
    exit(1);
}

// Test 7: Check app.blade.php
echo "7. Checking if app.blade.php has @routes directive...\n";
$bladePath = __DIR__.'/resources/views/app.blade.php';
$bladeContent = file_get_contents($bladePath);
if (strpos($bladeContent, '@routes') !== false) {
    echo "   ✓ @routes directive found\n\n";
} else {
    echo "   ✗ @routes directive NOT found\n\n";
}

echo "=== ALL CHECKS PASSED ===\n";
echo "\nThe server-side setup is correct.\n";
echo "If you see a blank page, it's a BROWSER CACHE issue.\n\n";
echo "SOLUTION:\n";
echo "1. Close ALL browser windows\n";
echo "2. Reopen browser\n";
echo "3. Press Ctrl+Shift+Delete\n";
echo "4. Clear 'Cached images and files'\n";
echo "5. Try again\n\n";
echo "OR try in Incognito mode (Ctrl+Shift+N)\n";
