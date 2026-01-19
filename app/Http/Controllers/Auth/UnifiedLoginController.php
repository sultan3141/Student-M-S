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

        if ($user->hasRole('admin')) {
            return redirect()->intended(Route::has('admin.dashboard') ? route('admin.dashboard') : '/dashboard');
        } elseif ($user->hasRole('registrar')) {
            return redirect()->intended(route('registrar.dashboard'));
        } elseif ($user->hasRole('teacher')) {
            return redirect()->intended(route('teacher.dashboard'));
        } elseif ($user->hasRole('student') || $user->student) {
            return redirect()->intended(route('student.dashboard'));
        } elseif ($user->hasRole('parent')) {
            return redirect()->intended(route('parent.dashboard'));
        }

        // Default fallback
        return redirect()->intended(route('dashboard'));
    }

    /**
     * API endpoint for frontend role detection visualization (username-based)
     */
    public function detectRole(Request $request)
    {
        $username = strtolower($request->input('username', ''));
        
        // Logic solely for UI visual feedback based on username patterns
        if (str_starts_with($username, 'admin') || $username === 'admin') {
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
