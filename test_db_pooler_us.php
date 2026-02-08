<?php
try {
    // Try us-east-1 pooler
    $host = "aws-0-us-east-1.pooler.supabase.com";
    $dsn = "pgsql:host=$host;port=6543;dbname=postgres";
    $user = "postgres.tradzimgbswrlxebptqp";
    $password = "Sultan@314131";
    
    echo "Attempting connection to $dsn as $user...\n";
    $pdo = new PDO($dsn, $user, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    echo "Connection successful!\n";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
