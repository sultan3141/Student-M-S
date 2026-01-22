<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RegistrarPaymentController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $query = \App\Models\Payment::with(['student.user', 'academicYear'])
            ->latest();

        // Search functionality
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('student.user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('student', function($q) use ($search) {
                $q->where('student_id', 'like', "%{$search}%");
            });
        }

        $payments = $query->paginate(10)->withQueryString();

        // Stats for Fee Collection Center
        $stats = [
             'todayCollected' => \App\Models\Payment::whereDate('transaction_date', today())->sum('amount'),
             'monthlyCollected' => \App\Models\Payment::whereMonth('transaction_date', now()->month)->sum('amount'),
             'pendingCount' => \App\Models\Payment::where('status', 'Pending')->count(),
        ];

        return inertia('Registrar/Payments/Index', [
            'payments' => $payments,
            'stats' => $stats,
             'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        // Pass active academic year
        $academicYear = \App\Models\AcademicYear::where('status', 'active')->first();
        return inertia('Registrar/Payments/Create', [
            'academicYear' => $academicYear,
        ]);
    }

    public function store(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'student_search' => 'required|string', // precise ID or name search later
            'amount' => 'required|numeric|min:0',
            'type' => 'required|in:Monthly,Semester,Annual',
            'status' => 'required|in:Pending,Paid,Partial',
            'academic_year_id' => 'required|exists:academic_years,id',
        ]);

        // Find student by ID (exact match for now for safety)
        $student = \App\Models\Student::where('student_id', $validated['student_search'])->first();

        if (!$student) {
            return back()->withErrors(['student_search' => 'Student not found with this ID.']);
        }

        \App\Models\Payment::create([
            'student_id' => $student->id,
            'academic_year_id' => $validated['academic_year_id'],
            'amount' => $validated['amount'],
            'type' => $validated['type'],
            'status' => $validated['status'],
            'transaction_date' => now(),
        ]);

        return redirect()->route('registrar.payments.index')->with('success', 'Payment recorded successfully.');
    }
}
