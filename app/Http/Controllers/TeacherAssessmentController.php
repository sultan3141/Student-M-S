<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Teacher;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeacherAssessmentController extends Controller
{
    /**
     * Display assessment dashboard for a specific class
     */
    public function index(Request $request)
    {
        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
        
        // Get query parameters for class selection
        $gradeId = $request->query('grade_id');
        $sectionId = $request->query('section_id');
        $subjectId = $request->query('subject_id');
        $semester = $request->query('semester', '1');
        
        // Get teacher's assignments for dropdowns
        $assignments = $teacher->assignments()
            ->with(['grade', 'section', 'subject'])
            ->get();
        
        $assessments = collect();
        $totalWeight = 0;
        $studentCount = 0;
        
        if ($gradeId && $sectionId && $subjectId) {
            // Fetch assessments for the selected class
            $assessments = Assessment::forClass($gradeId, $sectionId, $subjectId)
                ->bySemester($semester)
                ->with(['assessmentType', 'marks'])
                ->orderBy('due_date')
                ->get()
                ->map(function ($assessment) {
                    return [
                        'id' => $assessment->id,
                        'name' => $assessment->name,
                        'type' => $assessment->assessmentType->name,
                        'weight' => $assessment->weight_percentage,
                        'due_date' => $assessment->due_date?->format('Y-m-d'),
                        'status' => $assessment->status,
                        'completion' => $assessment->completion_percentage,
                        'average' => round($assessment->average_score ?? 0, 2),
                    ];
                });
            
            $totalWeight = $assessments->sum('weight');
            $studentCount = Student::where('section_id', $sectionId)->count();
        }
        
        return Inertia::render('Teacher/Assessments/Index', [
            'assignments' => $assignments,
            'assessments' => $assessments,
            'totalWeight' => $totalWeight,
            'studentCount' => $studentCount,
            'semester' => $semester,
            'selectedClass' => [
                'grade_id' => $gradeId,
                'section_id' => $sectionId,
                'subject_id' => $subjectId,
            ],
        ]);
    }

    /**
     * Store a new assessment
     */
    public function store(Request $request)
    {
        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'grade_id' => 'required|exists:grades,id',
            'section_id' => 'required|exists:sections,id',
            'subject_id' => 'required|exists:subjects,id',
            'assessment_type_id' => 'required|exists:assessment_types,id',
            'weight_percentage' => 'required|numeric|min:0|max:100',
            'max_score' => 'nullable|numeric|min:0',
            'semester' => 'required|in:1,2',
            'due_date' => 'nullable|date',
            'description' => 'nullable|string',
        ]);
        
        $assessment = Assessment::create(array_merge($validated, [
            'teacher_id' => $teacher->id,
            'status' => 'draft',
        ]));
        
        return redirect()->back()->with('success', 'Assessment created successfully.');
    }

    /**
     * Update an existing assessment
     */
    public function update(Request $request, Assessment $assessment)
    {
        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
        
        // Verify teacher owns this assessment
        if ($assessment->teacher_id !== $teacher->id) {
            abort(403);
        }
        
        // Cannot edit locked assessments
        if ($assessment->status === 'locked') {
            return redirect()->back()->withErrors(['error' => 'Cannot edit locked assessment.']);
        }
        
        $validated = $request->validate([
            'name' => 'string|max:255',
            'weight_percentage' => 'numeric|min:0|max:100',
            'max_score' => 'nullable|numeric|min:0',
            'due_date' => 'nullable|date',
            'description' => 'nullable|string',
            'status' => 'in:draft,published,locked',
        ]);
        
        $assessment->update($validatedas)
        return redirect()->back()->with('success', 'Assessment updated successfully.');
    }

    /**
     * Delete an assessment
     */
    public function destroy(Assessment $assessment)
    {
        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
        
        if ($assessment->teacher_id !== $teacher->id) {
            abort(403);
        }
        
        // Cannot delete if marks exist
        if ($assessment->marks()->exists()) {
            return redirect()->back()->withErrors(['error' => 'Cannot delete assessment with existing marks.']);
        }
        
        $assessment->delete();
        
        return redirect()->back()->with('success', 'Assessment deleted successfully.');
    }
}
