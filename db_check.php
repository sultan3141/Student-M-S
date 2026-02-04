<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Section;

foreach (Section::all() as $s) {
    echo "Section: " . $s->name . " | Grade ID: " . $s->grade_id . " | Gender: " . ($s->gender ?? 'NULL') . "\n";
}
