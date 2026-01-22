<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Roles
        $roles = [
            'super_admin',
            'school_director',
            'registrar',
            'teacher',
            'student',
            'parent',
        ];

        // Create Roles and Assign Permissions
        $roles_permissions = [
            'super_admin' => [], // All access
            'school_director' => [
                'teacher.view',
                'teacher.create',
                'teacher.update', // No delete
                'student.view',
                'registration.control',
                'communication.manage',
                'reports.view',
                'audit.view', // Read-only audit
            ],
            'registrar' => [
                'student.manage',
                'payment.manage',
            ],
            'teacher' => [
                'marks.enter',
                'attendance.manage',
            ],
            'student' => [
                'marks.view',
            ],
            'parent' => [
                'child.view',
            ],
        ];

        foreach ($roles_permissions as $role_name => $permissions) {
            $role = \Spatie\Permission\Models\Role::firstOrCreate(['name' => $role_name]);
            
            foreach ($permissions as $permission) {
                \Spatie\Permission\Models\Permission::firstOrCreate(['name' => $permission]);
                $role->givePermissionTo($permission);
            }
        }
    }
}
