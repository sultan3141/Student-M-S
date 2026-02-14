<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== SETTING ACTIVE ACADEMIC YEAR ===\n\n";

// Deactivate all years first
echo "Deactivating all years...\n";
\DB::statement("UPDATE academic_years SET is_current = false WHERE is_current = true");

// Activate only 2025-2026
echo "Activating 2025-2026...\n";
$year = \App\Models\AcademicYear::where('name', '2025-2026')->first();

if (!$year) {
    echo "❌ Year '2025-2026' not found!\n";
    exit(1);
}

\DB::statement("UPDATE academic_years SET is_current = true, updated_at = NOW() WHERE id = ?", [$year->id]);

echo "✓ Done!\n\n";

// Show all years status
echo "=== ALL ACADEMIC YEARS STATUS ===\n";
$allYears = \App\Models\AcademicYear::orderBy('start_date', 'desc')->get();
foreach ($allYears as $y) {
    $status = $y->is_current ? '✓ ACTIVE  ' : '  inactive';
    echo "{$status} - {$y->name} (ID: {$y->id})\n";
}

echo "\n✓ Only 2025-2026 is now active!\n";
echo "✓ Refresh your browser to see the changes.\n";
