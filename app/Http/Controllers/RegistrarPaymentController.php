<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RegistrarPaymentController extends Controller
{
    public function index()
    {
        return inertia('Registrar/Payments/Index', [
            'payments' => \App\Models\Payment::with(['student.user', 'academicYear'])
                ->latest()
                ->paginate(10),
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
