<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity; 
// Assuming spatie/laravel-activitylog is installed or using a custom model. 
// For this demo, I'll use a mock approach if package not present, but standard is Spatie.
// Given previous prompts mentioned Spatie Permission, likely ActivityLog is also common/desired.
// Only standard Model mock for now to be safe.

class RegistrarAuditController extends Controller
{
    /**
     * Display the Audit Log.
     */
    public function index(Request $request)
    {
        $query = \App\Models\AuditLog::with('user')->latest();

        // Simple mock of previous structure for frontend compatibility
        // Transforming DB logs to match the 'spatie-like' structure UI expects
        // OR updating UI to match this model. 
        // Let's adapt the Controller to map this model to the UI props.

        $dbLogs = $query->paginate(20);

        $logs = $dbLogs->getCollection()->map(function ($log) {
            return [
                'id' => $log->id,
                'description' => $log->action, // Mapping 'action' to 'description' for UI
                'subject_type' => 'System', // Generic for now
                'subject_id' => '-',
                'causer_name' => $log->user ? $log->user->name : 'System',
                'created_at' => $log->created_at->toDateTimeString(),
                'properties' => ['details' => $log->description, 'ip' => $log->ip_address],
                'severity' => str_contains(strtolower($log->action), 'delete') || str_contains(strtolower($log->action), 'fail') ? 'danger' : 'info'
            ];
        });
        
        // If DB is empty, keep mock data for presentation? 
        // No, user wants "real" implementation. But if empty, it's fine.
        // Wait, if I replace it and there is no data, the table will be empty.
        // I should probably seed one log or just leave it empty.
        
        // For the sake of the demo, if empty, we can return empty.

        return inertia('Registrar/Audit/Index', [
            'logs' => $logs, // Passing mapped collection
            // 'links' => $dbLogs->links() // Pagination links if needed in UI (currently not implemented in UI)
        ]);
    }
}
