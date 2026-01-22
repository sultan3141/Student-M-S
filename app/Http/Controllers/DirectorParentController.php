<?php

namespace App\Http\Controllers;

use App\Models\ParentProfile;
use App\Models\Student;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DirectorParentController extends Controller
{
    /**
     * Display parent directory.
     */
    public function index(Request $request)
    {
        $query = ParentProfile::with(['user', 'students.user', 'students.grade', 'students.section']);

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->whereHas('students', function ($q) {
                    $q->whereNotNull('user_id');
                });
            }
        }

        $parents = $query->paginate(15);

        return Inertia::render('Director/Parents/Index', [
            'parents' => $parents,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Display parent details.
     */
    public function show(ParentProfile $parent)
    {
        $parent->load(['user', 'students.user', 'students.grade', 'students.section', 'students.marks']);

        // Get student statistics
        $studentStats = [
            'total' => $parent->students->count(),
            'active' => $parent->students->whereNotNull('user_id')->count(),
            'grades' => $parent->students->pluck('grade.name')->unique()->values(),
        ];

        // Get recent marks for all linked students
        $recentMarks = [];
        foreach ($parent->students as $student) {
            $marks = $student->marks()
                ->with('assessment.subject')
                ->latest()
                ->take(5)
                ->get();
            $recentMarks[$student->id] = $marks;
        }

        return Inertia::render('Director/Parents/Show', [
            'parent' => $parent,
            'studentStats' => $studentStats,
            'recentMarks' => $recentMarks,
        ]);
    }
}
