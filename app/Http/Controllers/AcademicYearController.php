<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    public function index()
    {
        $years = \App\Models\AcademicYear::orderBy('start_date', 'desc')->get();
        return inertia('Director/AcademicYears/Index', [
            'years' => $years
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:academic_years,name',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        \App\Models\AcademicYear::create([
            'name' => $validated['name'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'status' => 'planned', // Default to planned
        ]);

        return redirect()->back()->with('success', 'Academic Year created successfully.');
    }

    public function activate($id)
    {
        // Set all others to inactive/planned? No, just inactive if they were active.
        // Usually only one active at a time.
        \App\Models\AcademicYear::where('status', 'active')->update(['status' => 'inactive']);

        $year = \App\Models\AcademicYear::findOrFail($id);
        $year->update(['status' => 'active']);

        return redirect()->back()->with('success', "{$year->name} is now the Active Academic Year.");
    }
}
