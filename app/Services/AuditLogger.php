<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class AuditLogger
{
    /**
     * Log an action to the audit trail.
     *
     * @param string $action The action performed (e.g., 'TEACHER_UPDATE')
     * @param string|null $module The module affected (e.g., 'TEACHER')
     * @param string|null $description Human readable description
     * @param array|null $details structured data about the change
     * @return AuditLog
     */
    public static function log(string $action, ?string $module = null, ?string $description = null, ?array $details = null)
    {
        return AuditLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'module' => $module,
            'description' => $description,
            'details' => $details ? json_encode($details) : null,
            'ip_address' => Request::ip(),
        ]);
    }
}
