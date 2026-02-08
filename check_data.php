<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\AcademicYear;

$count = AcademicYear::count();
echo "Total Academic Years: $count\n";

if ($count > 0) {
    $current = AcademicYear::where('is_current', true)->first();
    echo "Current Year: " . ($current ? $current->name : 'NONE') . "\n";
    if ($current) {
        echo "Semesters: " . $current->semesterStatuses()->count() . "\n";
        foreach($current->semesterStatuses as $s) {
            echo " - Sem {$s->semester}: {$s->status} (Grade {$s->grade_id})\n";
        }
    }
}
