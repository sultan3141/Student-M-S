<?php
$path = 'c:/Users/sulta/Desktop/Student-M-S/database/database.sqlite';
try {
    $pdo = new PDO("sqlite:$path");
    echo "Connected successfully to $path\n";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
