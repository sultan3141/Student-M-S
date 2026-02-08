<?php
$projectRef = "tradzimgbswrlxebptqp";
$regions = [
    'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
    'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2', 'ap-northeast-3', 'ap-south-1',
    'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-north-1',
    'ca-central-1', 'sa-east-1', 'af-south-1', 'me-south-1'
];

foreach ($regions as $region) {
    $host = "aws-0-$region.pooler.supabase.com";
    $ip = gethostbyname($host);
    if ($ip !== $host) {
        echo "$region resolved to $ip\n";
    } else {
        echo "$region did not resolve\n";
    }
}
