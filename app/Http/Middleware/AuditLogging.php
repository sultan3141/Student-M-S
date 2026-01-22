<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\AuditLog;

class AuditLogging
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Only log Director actions
        if ($this->shouldLog($request)) {
            $this->logAction($request, $response);
        }

        return $response;
    }

    /**
     * Determine if the request should be logged.
     */
    private function shouldLog(Request $request): bool
    {
        // Log all Director routes
        if ($request->is('director/*')) {
            return true;
        }

        // Don't log GET requests (read-only)
        if ($request->isMethod('GET')) {
            return false;
        }

        return false;
    }

    /**
     * Log the action to audit trail.
     */
    private function logAction(Request $request, $response): void
    {
        $user = auth()->user();
        
        if (!$user) {
            return;
        }

        // Determine action type
        $method = $request->method();
        $action = match ($method) {
            'POST' => 'created',
            'PUT', 'PATCH' => 'updated',
            'DELETE' => 'deleted',
            default => 'accessed',
        };

        // Build description
        $description = $this->buildDescription($request, $response);

        // Log to audit trail
        AuditLog::create([
            'user_id' => $user->id,
            'action' => $action,
            'description' => $description,
            'ip_address' => $request->ip(),
        ]);
    }

    /**
     * Build a description of the action.
     */
    private function buildDescription(Request $request, $response): string
    {
        $method = $request->method();
        $path = $request->path();
        
        // Safely get status code - handle different response types
        $status = 200;
        if (method_exists($response, 'status')) {
            $status = $response->status();
        } elseif (method_exists($response, 'getStatusCode')) {
            $status = $response->getStatusCode();
        }

        // Extract resource type and ID from path
        $pathParts = explode('/', $path);
        $resource = $pathParts[1] ?? 'unknown';
        $resourceId = $pathParts[2] ?? null;

        $description = "{$method} {$resource}";
        
        if ($resourceId && is_numeric($resourceId)) {
            $description .= " #{$resourceId}";
        }

        $description .= " (HTTP {$status})";

        // Add input data for POST/PUT requests
        if (in_array($method, ['POST', 'PUT', 'PATCH'])) {
            $input = $request->except(['password', 'password_confirmation', '_token']);
            if (!empty($input)) {
                $description .= " - " . json_encode($input);
            }
        }

        return $description;
    }
}
