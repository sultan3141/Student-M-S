<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Test the actual data being returned
$user = \App\Models\User::where('email', 'like', '%student%')->first();
auth()->login($user);

$controller = new \App\Http\Controllers\SemesterRecordController();
$academicYear = \App\Models\AcademicYear::where('is_current', true)->first();

$reflection = new ReflectionMethod($controller, 'show');
$result = $reflection->invoke($controller, 1, $academicYear->id);

// Extract the props from the Inertia response
echo "=== CHECKING INERTIA RESPONSE ===\n";

if (method_exists($result, 'toResponse')) {
    $request = \Illuminate\Http\Request::create('/test');
    $response = $result->toResponse($request);
    $content = $response->getContent();
    
    // Parse the JSON to check the props
    $decoded = json_decode($content, true);
    
    if (isset($decoded['props'])) {
        echo "\nProps being passed to component:\n";
        foreach ($decoded['props'] as $key => $value) {
            if (is_array($value) || is_object($value)) {
                echo "  $key: " . gettype($value) . " (" . (is_array($value) ? count($value) . " items" : "object") . ")\n";
            } else {
                echo "  $key: " . json_encode($value) . "\n";
            }
        }
        
        echo "\n=== DETAILED PROPS ===\n";
        echo json_encode($decoded['props'], JSON_PRETTY_PRINT);
    }
} else {
    echo "Result: " . get_class($result) . "\n";
    print_r($result);
}
