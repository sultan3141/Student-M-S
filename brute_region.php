<?php
$projectRef = "tradzimgbswrlxebptqp";
$user = "postgres." . $projectRef;
$password = "Sultan@314131";
$regions = [
    'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-north-1',
    'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
    'ap-south-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1'
];

foreach ($regions as $region) {
    $host = "aws-0-$region.pooler.supabase.com";
    $dsn = "pgsql:host=$host;port=6543;dbname=postgres";
    echo "Testing $region... ";
    try {
        $pdo = new PDO($dsn, $user, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT => 3]);
        echo "SUCCESS!\n";
        echo "Region is: $region\n";
        exit(0);
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Tenant or user not found') !== false) {
            echo "Not here.\n";
        } else {
            echo "Error: " . $e->getMessage() . "\n";
        }
    }
}
echo "Not found in common regions.\n";
exit(1);
