<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdmissionController extends Controller
{
    public function create()
    {
        return inertia('Admissions/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_name' => 'required|string|max:255',
            'student_email' => 'nullable|email|max:255',
            'parent_name' => 'required|string|max:255',
            'parent_email' => 'required|email|max:255',
            'parent_phone' => 'required|string|max:20',
            'grade_applying_for' => 'required|integer|between:9,12',
            'previous_school' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        \App\Models\Admission::create($validated);

        return redirect()->back()->with('status', 'Application submitted successfully! We will contact you soon.');
    }
}
