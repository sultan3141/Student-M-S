<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RegistrarController extends Controller
{
    public function dashboard()
    {
        $stats = cache()->remember('registrar_dashboard_stats', 300, function() {
            return [
                'newToday' => \App\Models\Student::whereDate('created_at', today())->count(),
                'totalActive' => \App\Models\Student::count(),
                'pendingPayments' => \App\Models\Payment::where('status', 'Pending')->count(),
                'pendingAmount' => \App\Models\Payment::where('status', 'Pending')->sum('amount'),
                'totalGuardians' => \App\Models\ParentProfile::count(),
            ];
        });

        // Fetch recent students - Optimized
        $recentStudents = \App\Models\Student::select(['id', 'user_id', 'grade_id', 'section_id', 'student_id', 'gender', 'created_at'])
            ->with([
                'user:id,name', 
                'grade:id,name', 
                'section:id,name'
            ])
            ->latest()
            ->take(5)
            ->get();

        return inertia('Registrar/Dashboard', [
            'stats' => $stats,
            'recentStudents' => $recentStudents,
            'grades' => cache()->remember('grades_list', 3600, fn() => \App\Models\Grade::all(['id', 'name', 'level'])),
        ]);
    }


    // Note: Student creation logic moved to RegistrarStudentController
}
