<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class SuperAdminUserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('roles');
        
        // Filter by role if specified
        if ($request->has('role') && $request->role !== 'all') {
            $query->role($request->role);
        }
        
        // Search by name, username, or email
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('username', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }
        
        $users = $query->paginate(15);
        $roles = Role::all();
        
        // Calculate role statistics
        $stats = [
            'total' => User::count(),
            'active' => User::count(), // Add 'status' field to users table if needed
            'teachers' => User::role('teacher')->count(),
            'staff' => User::role('registrar')->count() + User::role('admin')->count(),
        ];
        
        return Inertia::render('SuperAdmin/UserManagement', [
            'users' => $users,
            'roles' => $roles,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search,
                'role' => $request->role,
            ],
        ]);
    }
    
    public function create()
    {
        $roles = Role::all();
        return Inertia::render('SuperAdmin/UserCreate', [
            'roles' => $roles,
        ]);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'nullable|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|exists:roles,name',
        ]);
        
        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);
        
        $user->assignRole($validated['role']);
        
        return redirect()->route('super_admin.users.index')
            ->with('success', 'User created successfully.');
    }
    
    public function edit(User $user)
    {
        $roles = Role::all();
        $user->load('roles');
        
        return Inertia::render('SuperAdmin/UserEdit', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }
    
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'email' => 'nullable|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|string|exists:roles,name',
        ]);
        
        $user->update([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
        ]);
        
        if ($request->filled('password')) {
            $user->update(['password' => Hash::make($validated['password'])]);
        }
        
        $user->syncRoles([$validated['role']]);
        
        return redirect()->route('super_admin.users.index')
            ->with('success', 'User updated successfully.');
    }
    
    public function destroy(User $user)
    {
        // Prevent self-deletion
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }
        
        $user->delete();
        
        return redirect()->route('super_admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    public function activate(User $user)
    {
        try {
            // Assuming you have an 'active' column in users table
            // If not, this can be implemented using status field
            $user->update(['status' => 'active']);
            
            return back()->with('success', "User {$user->name} activated successfully.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to activate user: ' . $e->getMessage());
        }
    }

    public function deactivate(User $user)
    {
        try {
            // Prevent deactivating own account
            if ($user->id === auth()->id()) {
                return back()->with('error', 'You cannot deactivate your own account.');
            }

            $user->update(['status' => 'inactive']);
            
            return back()->with('success', "User {$user->name} deactivated successfully.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to deactivate user: ' . $e->getMessage());
        }
    }

    public function resetPassword(User $user)
    {
        try {
            // Generate a temporary password
            $tempPassword = 'temp' . rand(1000, 9999);
            
            $user->update([
                'password' => bcrypt($tempPassword),
            ]);
            
            // TODO: Send email to user with temporary password
            
            return back()->with('success', "Password reset for {$user->name}. Temporary password: {$tempPassword}");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to reset password: ' . $e->getMessage());
        }
    }
}
