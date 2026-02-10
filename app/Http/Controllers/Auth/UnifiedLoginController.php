<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class UnifiedLoginController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/UnifiedLogin', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Intelligent Role-Based Redirection
        $user = Auth::user();

        // Debug logging
        \Log::info('User logged in', [
            'user_id' => $user->id,
            'username' => $user->username,
            'roles' => $user->roles->pluck('name')->toArray(),
        ]);

        if ($user->hasRole('super_admin')) {
            \Log::info('Redirecting to super_admin.dashboard');
            return redirect()->route('super_admin.dashboard');
        } elseif ($user->hasRole('admin')) {
            \Log::info('Redirecting to director.dashboard');
            return redirect()->route('director.dashboard');
        } elseif ($user->hasRole('registrar')) {
            \Log::info('Redirecting to registrar.dashboard');
            return redirect()->route('registrar.dashboard');
        } elseif ($user->hasRole('teacher')) {
            \Log::info('Redirecting to teacher.dashboard');
            return redirect()->route('teacher.dashboard');
        } elseif ($user->hasRole('student') || $user->student) {
            \Log::info('Redirecting to student.dashboard');
            return redirect()->route('student.dashboard');
        } elseif ($user->hasRole('parent')) {
            \Log::info('Redirecting to parent.dashboard');
            return redirect()->route('parent.dashboard');
        }

        // Default fallback
        \Log::warning('No role matched, using default redirect');
        return redirect()->intended(route('dashboard'));

    }

    /**
     * API endpoint for frontend role detection visualization (username-based)
     */
    public function detectRole(Request $request)
    {
        $username = strtolower($request->input('username', ''));

        // Logic solely for UI visual feedback based on username patterns
        if (str_starts_with($username, 'super') || $username === 'super_admin') {
            return response()->json(['role' => 'super_admin', 'theme' => 'purple']);
        } elseif (str_starts_with($username, 'admin') || $username === 'admin') {
            return response()->json(['role' => 'admin', 'theme' => 'gold']);
        } elseif (str_starts_with($username, 'teacher') || str_starts_with($username, 't_')) {
            return response()->json(['role' => 'teacher', 'theme' => 'blue']);
        } elseif (str_starts_with($username, 'student') || str_starts_with($username, 's_')) {
            return response()->json(['role' => 'student', 'theme' => 'green']);
        } elseif (str_starts_with($username, 'parent') || str_starts_with($username, 'p_')) {
            return response()->json(['role' => 'parent', 'theme' => 'purple']);
        } elseif (str_starts_with($username, 'registrar') || str_starts_with($username, 'r_')) {
            return response()->json(['role' => 'registrar', 'theme' => 'indigo']);
        }

        return response()->json(['role' => 'unknown', 'theme' => 'gray']);
    }
}
