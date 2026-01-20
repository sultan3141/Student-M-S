<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class SuperAdminAccessController extends Controller
{
    public function index()
    {
        // Get all roles and their permissions
        $roles = Role::with('permissions')->get();
        
        // Define available modules and their permissions
        $modules = [
            'User Management' => ['view_users', 'create_users', 'edit_users', 'delete_users'],
            'Student Management' => ['view_students', 'create_students', 'edit_students', 'delete_students'],
            'Academic Management' => ['view_marks', 'enter_marks', 'edit_marks', 'view_reports'],
            'Financial Management' => ['view_payments', 'record_payments', 'view_financial_reports'],
            'System Configuration' => ['view_settings', 'edit_settings'],
        ];

        return Inertia::render('SuperAdmin/AccessControl', [
            'roles' => $roles,
            'modules' => $modules,
            'permissionMatrix' => $this->getPermissionMatrix(),
        ]);
    }

    public function permissions()
    {
        $permissions = Permission::all();
        return response()->json($permissions);
    }

    public function updatePermissions(Request $request)
    {
        $validated = $request->validate([
            'role_id' => 'required|exists:roles,id',
            'permissions' => 'required|array',
            'permissions.*' => 'string',
        ]);

        try {
            $role = Role::findById($validated['role_id']);
            $role->syncPermissions($validated['permissions']);

            return back()->with('success', "Permissions updated for {$role->name} role.");
        } catch (\Exception $e) {
            return back()->with('error', "Failed to update permissions: " . $e->getMessage());
        }
    }

    public function accessLogs()
    {
        // Fetch access logs per user/role
        $logs = [
            ['id' => 1, 'user' => 'teacher_john', 'role' => 'teacher', 'module' => 'Marks Entry', 'action' => 'Entered Marks', 'timestamp' => '2024-01-19 14:20:00'],
            ['id' => 2, 'user' => 'registrar_jane', 'role' => 'registrar', 'module' => 'Student Admission', 'action' => 'Created Student', 'timestamp' => '2024-01-19 11:15:00'],
            ['id' => 3, 'user' => 'parent_mary', 'role' => 'parent', 'module' => 'Student Dashboard', 'action' => 'Viewed Marks', 'timestamp' => '2024-01-19 16:45:00'],
        ];

        return response()->json($logs);
    }

    private function getPermissionMatrix()
    {
        // Return a matrix of roles and their permissions for quick overview
        $roles = Role::with('permissions')->get();
        $matrix = [];

        foreach ($roles as $role) {
            $matrix[$role->name] = $role->permissions->pluck('name')->toArray();
        }

        return $matrix;
    }
}
