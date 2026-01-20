<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RegistrarController extends Controller
{
    public function dashboard()
    {
        // Calculate stats
        $newStudentsToday = \App\Models\Student::whereDate('created_at', today())->count();
        $totalStudents = \App\Models\Student::count();
        $pendingPayments = \App\Models\Payment::where('status', 'Pending')->count();
        $pendingAmount = \App\Models\Payment::where('status', 'Pending')->sum('amount');

        // Fetch recent students
        $recentStudents = \App\Models\Student::with(['user', 'grade', 'section'])
            ->latest()
            ->take(5)
            ->get();

        return inertia('Registrar/Dashboard', [
            'stats' => [
                'newToday' => $newStudentsToday,
                'totalActive' => $totalStudents,
                'pendingPayments' => $pendingPayments,
                'pendingAmount' => $pendingAmount,
            ],
            'recentStudents' => $recentStudents,
            'grades' => \App\Models\Grade::all(['id', 'name', 'level']),
        ]);
    }


    // Note: Student creation logic moved to RegistrarStudentController
}
