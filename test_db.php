<?php
try {
    $dsn = "pgsql:host=db.tradzimgbswrlxebptqp.supabase.co;port=5432;dbname=postgres";
    $user = "postgres";
    $password = "Sultan@314131";
    
    echo "Attempting connection to $dsn...\n";
    $pdo = new PDO($dsn, $user, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    echo "Connection successful!\n";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
