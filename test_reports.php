<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo "--- Model Check ---\n";
    if (class_exists(\App\Models\DocumentTemplate::class)) {
        $tmpl = new \App\Models\DocumentTemplate();
        echo "[OK] DocumentTemplate Model exists\n";
    } else {
        echo "[FAIL] DocumentTemplate Model missing\n";
    }
    
    if (class_exists(\App\Models\Payment::class)) {
        $payment = new \App\Models\Payment();
        if (method_exists($payment, 'student')) echo "[OK] Payment->student() relation exists\n";
        else echo "[FAIL] Payment->student() relation MISSING\n";
    } else {
        echo "[FAIL] Payment Model missing\n";
    }

    echo "--- PDF Logic Check ---\n";
    $grade = \App\Models\Grade::first();
    if (!$grade) {
        echo "[WARN] No grades found, skipping PDF content test\n";
    } else {
        $students = \App\Models\Student::where("grade_id", $grade->id)->take(2)->get();
        echo "[INFO] Found " . $students->count() . " students in Grade " . $grade->name . "\n";
        
        // Test PDF Facade
        try {
             $pdf = \PDF::loadView("exports.students-list", ["students" => $students, "title" => "Test"]);
             $out = $pdf->output();
             echo "[OK] PDF Generated successfully, size: " . strlen($out) . " bytes\n";
        } catch (\Exception $e) {
            echo "[FAIL] PDF Generation failed: " . $e->getMessage() . "\n";
        }
    }
} catch (\Exception $e) {
    echo "[CRITICAL ERROR] " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
