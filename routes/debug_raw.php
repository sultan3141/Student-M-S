<?php

use Illuminate\Support\Facades\Route;

Route::get('/debug-raw', function () {
    return '<html><body><h1 style="color:green">Server is Running Correctly</h1><p>If you see this, PHP and Laravel work fine. The issue is with frontend/Inertia.</p></body></html>';
});
