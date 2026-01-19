<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\TeacherAssignment;
use App\Models\Mark;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DirectorTeacherController extends Controller
{
    /**
     * Display teacher directory.
     */
    public function index(Request $request)
    {
        $query = Teacher::with(['user', 'assignments.subject', 'assignments.grade']);

        // Apply filters
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->whereHas('user');
            } elseif ($request->status === 'inactive') {
                $query->whereDoesntHave('user');
            }
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $teachers = $query->paginate(12);

        // Add performance metrics to each teacher
        $teachers->getCollection()->transform(function ($teacher) {
            $teacher->performance = $this->getPerformanceMetrics($teacher->id)->original;
            return $teacher;
        });

        return Inertia::render('Director/Teachers/Index', [
            'teachers' => $teachers,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new teacher.
     */
    public function create()
    {
        return Inertia::render('Director/Teachers/Create', [
            // Add any needed data like subjects, grades, etc.
        ]);
    }

    /**
     * Store a new teacher.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:8',
            'employee_id' => 'required|string|unique:teachers',
            'qualification' => 'nullable|string',
            'specialization' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'department' => 'nullable|string',
            // Assignment data
            'subjects' => 'nullable|array',
            'grades' => 'nullable|array',
            'sections' => 'nullable|array',
        ]);

        // Create user
        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->assignRole('teacher');

        // Create teacher profile
        $teacher = Teacher::create([
            'user_id' => $user->id,
            'employee_id' => $validated['employee_id'],
            'qualification' => $validated['qualification'] ?? null,
            'specialization' => $validated['specialization'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'department' => $validated['department'] ?? null,
        ]);

        // Create assignments if provided
        if (!empty($validated['subjects'])) {
            // Implementation depends on your assignment structure
            // This is a simplified version
            foreach ($validated['subjects'] as $index => $subjectId) {
                TeacherAssignment::create([
                    'teacher_id' => $teacher->id,
                    'subject_id' => $subjectId,
                    'grade_id' => $validated['grades'][$index] ?? null,
                    'section_id' => $validated['sections'][$index] ?? null,
                    'academic_year_id' => 1, // Get current academic year
                ]);
            }
        }

        return redirect()->route('director.teachers.index')
            ->with('success', 'Teacher created successfully');
    }

    /**
     * Display the specified teacher.
     */
    public function show(Teacher $teacher)
    {
        $teacher->load(['user', 'assignments.subject', 'assignments.grade']);
        $performance = $this->getPerformanceMetrics($teacher->id)->original;

        return Inertia::render('Director/Teachers/Show', [
            'teacher' => $teacher,
            'performance' => $performance,
        ]);
    }

    /**
     * Show the form for editing the specified teacher.
     */
    public function edit(Teacher $teacher)
    {
        $teacher->load(['user', 'assignments']);

        return Inertia::render('Director/Teachers/Edit', [
            'teacher' => $teacher,
        ]);
    }

    /**
     * Update teacher.
     */
    public function update(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'qualification' => 'nullable|string',
            'specialization' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'department' => 'nullable|string',
        ]);

        // Update teacher profile
        $teacher->update($validated);

        // Update user name if provided
        if ($request->filled('name')) {
            $teacher->user->update(['name' => $validated['name']]);
        }

        return redirect()->back()->with('success', 'Teacher updated successfully');
    }

    /**
     * Remove teacher.
     */
    public function destroy(Teacher $teacher)
    {
        // Soft delete or disable the user instead of hard delete
        $teacher->user->delete();
        $teacher->delete();

        return redirect()->route('director.teachers.index')
            ->with('success', 'Teacher removed successfully');
    }

    /**
     * Get teacher performance metrics.
     */
    public function getPerformanceMetrics($id)
    {
        $teacher = Teacher::findOrFail($id);

        // Get all marks for this teacher's classes
        $marks = Mark::whereHas('assessment', function ($q) use ($teacher) {
            $q->where('teacher_id', $teacher->id);
        })->whereNotNull('marks_obtained');

        $avgScore = $marks->avg('marks_obtained') ?? 0;
        $totalStudents = $marks->distinct('student_id')->count();
        $passCount = $marks->where('marks_obtained', '>=', 50)->count();
        $passRate = $marks->count() > 0 ? ($passCount / $marks->count()) * 100 : 0;

        return response()->json([
            'avgClassScore' => round($avgScore, 2),
            'totalStudents' => $totalStudents,
            'passRate' => round($passRate, 2),
            'performance' => $avgScore >= 85 ? 'Excellent' : ($avgScore >= 75 ? 'Good' : 'Needs Improvement'),
        ]);
    }
}
