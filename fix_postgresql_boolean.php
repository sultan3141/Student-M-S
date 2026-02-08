<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Fixing PostgreSQL boolean columns...\n\n";

try {
    // Check current column type
    $result = DB::select("SELECT data_type FROM information_schema.columns WHERE table_name = 'academic_years' AND column_name = 'is_current'");
    
    if (!empty($result)) {
        $currentType = $result[0]->data_type;
        echo "Current is_current column type: {$currentType}\n";
        
        if ($currentType !== 'boolean') {
            echo "Converting is_current to boolean...\n";
            
            // Convert the column to boolean
            DB::statement("ALTER TABLE academic_years ALTER COLUMN is_current TYPE boolean USING is_current::boolean");
            
            echo "✓ Successfully converted is_current to boolean\n";
        } else {
            echo "✓ Column is already boolean type\n";
        }
    }
    
    // Verify the change
    $result = DB::select("SELECT data_type FROM information_schema.columns WHERE table_name = 'academic_years' AND column_name = 'is_current'");
    echo "\nFinal column type: " . $result[0]->data_type . "\n";
    
    // Test query
    echo "\nTesting query...\n";
    $year = \App\Models\AcademicYear::where('is_current', true)->first();
    if ($year) {
        echo "✓ Query successful! Found: {$year->name}\n";
    } else {
        echo "No current academic year found\n";
    }
    
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "\nDone!\n";
