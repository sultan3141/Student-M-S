<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Grade;
use App\Models\AcademicYear;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DirectorStudentController extends Controller
{
    /**
     * Display student directory.
     */
    public function index(Request $request)
    {
        $query = Student::with(['user', 'grade', 'section', 'parents.user'])
            ->latest();

        // Apply Filters
        if ($request->filled('grade_id')) {
            $query->where('grade_id', $request->grade_id);
        }

        if ($request->filled('section_id')) {
            $query->where('section_id', $request->section_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('student_id', 'like', "%{$search}%")
                  ->orWhereHas('user', function($u) use ($search) {
                      $u->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }
        
        $students = $query->paginate(15)->withQueryString();

        return Inertia::render('Director/Students/Index', [
            'students' => $students,
            'grades' => Grade::with('sections')->get(), // For filter dropdowns
            'filters' => $request->only(['grade_id', 'section_id', 'search']),
        ]);
    }

    /**
     * Display student profile (Read-only).
     */
    public function show(Student $student)
    {
        $student->load(['user', 'grade', 'section', 'parents.user', 'registrations', 'payments', 'marks', 'semesterResults']);
        
        return Inertia::render('Director/Students/Show', [
            'student' => $student,
            'registrations' => $student->registrations,
            'payment_history' => $student->payments,
            'marks' => $student->marks,
            'semester_results' => $student->semesterResults,
        ]);
    }
}
