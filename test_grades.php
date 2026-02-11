<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$grades = \App\Models\Grade::with('sections')->orderBy('level')->get();

echo "Total Grades: " . $grades->count() . "\n\n";

foreach ($grades as $grade) {
    echo "Grade: {$grade->name} (ID: {$grade->id})\n";
    echo "  Sections: " . $grade->sections->count() . "\n";
    foreach ($grade->sections as $section) {
        echo "    - {$section->name} (ID: {$section->id})\n";
    }
    echo "\n";
}
