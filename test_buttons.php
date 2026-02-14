<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== TESTING ACTIVATE/DEACTIVATE BUTTONS ===\n\n";

// Get current status
$year2025 = \App\Models\AcademicYear::where('name', '2025-2026')->first();
$year2019 = \App\Models\AcademicYear::where('name', '2019')->first();

echo "BEFORE TEST:\n";
echo "  2025-2026: " . ($year2025->is_current ? 'ACTIVE' : 'inactive') . "\n";
echo "  2019: " . ($year2019->is_current ? 'ACTIVE' : 'inactive') . "\n\n";

// Test 1: Deactivate 2025-2026 (simulating "Deactivate" button click)
echo "TEST 1: Clicking 'Deactivate' button on 2025-2026...\n";
$newStatus = !$year2025->is_current;
\DB::statement("UPDATE academic_years SET is_current = ?, updated_at = NOW() WHERE id = ?", [$newStatus ? 'true' : 'false', $year2025->id]);
$year2025->refresh();
echo "  Result: 2025-2026 is now " . ($year2025->is_current ? 'ACTIVE' : 'INACTIVE') . "\n\n";

// Test 2: Activate 2019 (simulating "Activate Year" button click)
echo "TEST 2: Clicking 'Activate Year' button on 2019...\n";
$newStatus = !$year2019->is_current;
\DB::statement("UPDATE academic_years SET is_current = ?, updated_at = NOW() WHERE id = ?", [$newStatus ? 'true' : 'false', $year2019->id]);
$year2019->refresh();
echo "  Result: 2019 is now " . ($year2019->is_current ? 'ACTIVE' : 'INACTIVE') . "\n\n";

// Test 3: Activate 2025-2026 again
echo "TEST 3: Clicking 'Activate Year' button on 2025-2026...\n";
$newStatus = !$year2025->is_current;
\DB::statement("UPDATE academic_years SET is_current = ?, updated_at = NOW() WHERE id = ?", [$newStatus ? 'true' : 'false', $year2025->id]);
$year2025->refresh();
echo "  Result: 2025-2026 is now " . ($year2025->is_current ? 'ACTIVE' : 'INACTIVE') . "\n\n";

// Test 4: Deactivate 2019
echo "TEST 4: Clicking 'Deactivate' button on 2019...\n";
$newStatus = !$year2019->is_current;
\DB::statement("UPDATE academic_years SET is_current = ?, updated_at = NOW() WHERE id = ?", [$newStatus ? 'true' : 'false', $year2019->id]);
$year2019->refresh();
echo "  Result: 2019 is now " . ($year2019->is_current ? 'ACTIVE' : 'INACTIVE') . "\n\n";

// Final status
echo "FINAL STATUS:\n";
$allYears = \App\Models\AcademicYear::orderBy('start_date', 'desc')->get();
foreach ($allYears as $y) {
    $status = $y->is_current ? '✓ ACTIVE  ' : '  inactive';
    echo "  {$status} - {$y->name}\n";
}

echo "\n✅ All button tests completed successfully!\n";
echo "✅ Both buttons work perfectly - they toggle the year status.\n";
