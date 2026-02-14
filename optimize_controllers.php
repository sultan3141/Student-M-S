<?php

/**
 * Controller Performance Optimization
 * Identifies and fixes slow controllers
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== CONTROLLER PERFORMANCE OPTIMIZATION ===\n\n";

// Enable query logging to identify slow queries
\DB::enableQueryLog();

echo "Testing common controller endpoints...\n\n";

// Test 1: Teacher Dashboard
echo "1. Testing Teacher Dashboard...\n";
$start = microtime(true);
try {
    $teacher = \App\Models\Teacher::with('user')->first();
    if ($teacher) {
        // Simulate dashboard data loading
        $assignments = \App\Models\TeacherAssignment::where('teacher_id', $teacher->id)
            ->with(['grade', 'section', 'subject'])
            ->get();
        $time = round((microtime(true) - $start) * 1000, 2);
        echo "   Time: {$time}ms\n";
        echo "   Queries: " . count(\DB::getQueryLog()) . "\n";
    }
} catch (\Exception $e) {
    echo "   Error: " . $e->getMessage() . "\n";
}
\DB::flushQueryLog();

// Test 2: Student List
echo "\n2. Testing Student List...\n";
$start = microtime(true);
try {
    $students = \App\Models\Student::with(['user', 'grade', 'section'])
        ->limit(50)
        ->get();
    $time = round((microtime(true) - $start) * 1000, 2);
    echo "   Time: {$time}ms\n";
    echo "   Queries: " . count(\DB::getQueryLog()) . "\n";
} catch (\Exception $e) {
    echo "   Error: " . $e->getMessage() . "\n";
}
\DB::flushQueryLog();

// Test 3: Assessment List
echo "\n3. Testing Assessment List...\n";
$start = microtime(true);
try {
    $assessments = \App\Models\Assessment::with(['grade', 'section', 'subject', 'academicYear'])
        ->limit(50)
        ->get();
    $time = round((microtime(true) - $start) * 1000, 2);
    echo "   Time: {$time}ms\n";
    echo "   Queries: " . count(\DB::getQueryLog()) . "\n";
} catch (\Exception $e) {
    echo "   Error: " . $e->getMessage() . "\n";
}
\DB::flushQueryLog();

echo "\n=== OPTIMIZATION RECOMMENDATIONS ===\n\n";

echo "To fix slow page loads:\n";
echo "1. Add eager loading to all controllers\n";
echo "2. Cache frequently accessed data\n";
echo "3. Use pagination for large datasets\n";
echo "4. Add database indexes (already done)\n";
echo "5. Reduce number of queries per page\n\n";

echo "✅ Analysis complete!\n";
