<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AcademicYear;
use App\Models\Grade;
use App\Models\Student;

class RegistrarAcademicYearController extends Controller
{
    /**
     * Display the Academic Year Manager.
     */
    public function index()
    {
        $currentYear = AcademicYear::whereRaw('is_current::boolean = TRUE')->first();
        // Placeholder for next year logic
        $nextYear = AcademicYear::where('id', '>', $currentYear->id ?? 0)->first();

        // Promotion Stats (Simulation)
        $grades = Grade::all();
        $promotionStats = $grades->pluck('name')->mapWithKeys(function ($grade) {
            return [$grade => [
                'eligible' => rand(20, 50),
                'borderline' => rand(1, 5),
                'repeat' => rand(0, 2),
            ]];
        });

        return inertia('Registrar/Academic/Index', [
            'currentYear' => $currentYear,
            'nextYear' => $nextYear,
            'promotionStats' => $promotionStats,
        ]);
    }

    /**
     * Run promotion simulation or execution.
     */
    public function promote(Request $request)
    {
        $validated = $request->validate([
            'mode' => 'required|in:simulate,execute',
        ]);

        // Logic for promotion would go here
        // 1. Identify current active year
        // 2. Identify passing students based on Marks
        // 3. Move students to next grade (e.g. 9->10)
        // 4. Create new Section assignments for next year on 'Proposed' status

        return redirect()->back()->with('success', 'Promotion process initiated successfully.');
    }
}
