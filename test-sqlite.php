<?php
echo "Testing SQLite Connection...\n";

// Check if PDO SQLite is loaded
if (!extension_loaded('pdo_sqlite')) {
    echo "❌ PDO SQLite extension is NOT loaded\n";
    exit(1);
}
echo "✅ PDO SQLite extension is loaded\n";

// Test database connection
$dbPath = __DIR__ . '/database/database.sqlite';
echo "Database path: $dbPath\n";

if (!file_exists($dbPath)) {
    echo "❌ Database file does not exist\n";
    exit(1);
}
echo "✅ Database file exists\n";

try {
    $pdo = new PDO("sqlite:$dbPath");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✅ Database connection successful\n";
    
    // Test a simple query
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "✅ Query successful - Users count: " . $result['count'] . "\n";
    
} catch (PDOException $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
    exit(1);
}

echo "🎉 All tests passed!\n";
?>