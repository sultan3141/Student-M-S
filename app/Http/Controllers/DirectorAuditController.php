<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DirectorAuditController extends Controller
{
    /**
     * Display audit log listing.
     */
    public function index(Request $request)
    {
        $query = AuditLog::with('user')
            ->latest()
            ->paginate(50);

        // Get filter options - use whereHas to check for either role
        $users = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['school_director', 'admin']);
        })->select('id', 'name')->get();
        $actions = AuditLog::distinct('action')->pluck('action');

        return Inertia::render('Director/Audit/Index', [
            'logs' => $query,
            'users' => $users,
            'actions' => $actions,
            'filters' => $request->only(['user_id', 'action', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Show audit log details.
     */
    public function show(AuditLog $log)
    {
        $log->load('user');

        return Inertia::render('Director/Audit/Show', [
            'log' => $log,
        ]);
    }

    /**
     * Export audit logs as CSV.
     */
    public function export(Request $request)
    {
        $query = AuditLog::with('user');

        // Apply filters
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->orderBy('created_at', 'desc')->get();

        // Generate CSV
        $filename = 'audit_logs_' . date('Y-m-d_H-i-s') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=$filename",
        ];

        $callback = function () use ($logs) {
            $file = fopen('php://output', 'w');
            
            // Add BOM for Excel
            fputs($file, "\xEF\xBB\xBF");
            
            // Headers
            fputcsv($file, ['Date', 'User', 'Action', 'Description', 'IP Address']);
            
            // Data
            foreach ($logs as $log) {
                fputcsv($file, [
                    $log->created_at->format('Y-m-d H:i:s'),
                    $log->user->name ?? 'Unknown',
                    $log->action,
                    $log->description,
                    $log->ip_address,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Get audit statistics.
     */
    public function statistics()
    {
        $totalActions = AuditLog::count();
        $actionsToday = AuditLog::whereDate('created_at', today())->count();
        $actionsThisWeek = AuditLog::whereBetween('created_at', [
            now()->startOfWeek(),
            now()->endOfWeek(),
        ])->count();

        $actionsByType = AuditLog::select('action')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('action')
            ->get()
            ->pluck('count', 'action');

        $topUsers = AuditLog::select('user_id')
            ->selectRaw('COUNT(*) as count')
            ->with('user:id,name')
            ->groupBy('user_id')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->map(function ($log) {
                return [
                    'user' => $log->user->name ?? 'Unknown',
                    'count' => $log->count,
                ];
            });

        return response()->json([
            'total_actions' => $totalActions,
            'actions_today' => $actionsToday,
            'actions_this_week' => $actionsThisWeek,
            'actions_by_type' => $actionsByType,
            'top_users' => $topUsers,
        ]);
    }

    /**
     * Clear old audit logs (older than 90 days).
     */
    public function clearOld()
    {
        $deleted = AuditLog::where('created_at', '<', now()->subDays(90))->delete();

        return redirect()->back()->with('success', "Deleted {$deleted} old audit logs.");
    }
}
