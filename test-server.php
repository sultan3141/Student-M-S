<?php
echo "PHP Server Test\n";
echo "Time: " . date('Y-m-d H:i:s') . "\n";
echo "SQLite Support: " . (extension_loaded('pdo_sqlite') ? 'YES' : 'NO') . "\n";

// Test Laravel bootstrap
try {
    require_once __DIR__ . '/vendor/autoload.php';
    $app = require_once __DIR__ . '/bootstrap/app.php';
    echo "Laravel Bootstrap: SUCCESS\n";
    
    // Boot the application
    $app->boot();
    
    // Test database connection
    $db = $app->make('Illuminate\Database\DatabaseManager');
    $db->connection()->getPdo();
    echo "Database Connection: SUCCESS\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>