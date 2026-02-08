<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;

echo "Checking tables...\n";
echo "audit_logs: " . (Schema::hasTable('audit_logs') ? 'YES' : 'NO') . "\n";
echo "semester_periods: " . (Schema::hasTable('semester_periods') ? 'YES' : 'NO') . "\n";
echo "academic_semester_statuses: " . (Schema::hasTable('academic_semester_statuses') ? 'YES' : 'NO') . "\n";
