<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== ACTIVATE ACADEMIC YEAR ===\n\n";

// Find the 2025-2026 year
$year = \App\Models\AcademicYear::where('name', '2025-2026')->first();

if (!$year) {
    echo "❌ Academic year '2025-2026' not found!\n";
    echo "\nAvailable years:\n";
    $years = \App\Models\AcademicYear::all();
    foreach ($years as $y) {
        echo "  - {$y->name} (ID: {$y->id}, is_current: " . ($y->is_current ? 'TRUE' : 'FALSE') . ")\n";
    }
    exit(1);
}

echo "Found Academic Year: {$year->name} (ID: {$year->id})\n";
echo "Current Status:\n";
echo "  - is_current: " . ($year->is_current ? 'TRUE' : 'FALSE') . "\n";
echo "  - status: {$year->status}\n\n";

// Activate it
echo "Activating year...\n";
\DB::statement("UPDATE academic_years SET is_current = true, updated_at = NOW() WHERE id = ?", [$year->id]);

// Reload to confirm
$year->refresh();

echo "\n✓ Year activated successfully!\n";
echo "New Status:\n";
echo "  - is_current: " . ($year->is_current ? 'TRUE' : 'FALSE') . "\n";
echo "  - status: {$year->status}\n";

// Show all years status
echo "\n=== ALL ACADEMIC YEARS ===\n";
$allYears = \App\Models\AcademicYear::orderBy('start_date', 'desc')->get();
foreach ($allYears as $y) {
    $status = $y->is_current ? '✓ ACTIVE' : '  inactive';
    echo "{$status} - {$y->name} (ID: {$y->id})\n";
}

echo "\n✓ Done! Refresh your browser to see the changes.\n";
