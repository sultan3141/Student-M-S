<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Subject;
use App\Models\Grade;
use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AssessmentController extends Controller
{
    public function index()
    {
        $assessments = Assessment::with(['subject', 'grade', 'academicYear', 'creator'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return inertia('Teacher/Assessments/Index', [
            'assessments' => $assessments
        ]);
    }

    public function create()
    {
        $subjects = Subject::with('grade')->get();
        $grades = Grade::all();
        $academicYears = AcademicYear::where('status', 'active')->get();

        return inertia('Teacher/Assessments/Create', [
            'subjects' => $subjects,
            'grades' => $grades,
            'academicYears' => $academicYears
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'subject_id' => 'required|exists:subjects,id',
            'grade_id' => 'required|exists:grades,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester' => 'required|in:1,2',
            'assessment_type' => 'required|in:Midterm,Test,Assignment,Final',
            'max_score' => 'required|numeric|min:1|max:100',
            'due_date' => 'nullable|date|after:today',
            'status' => 'required|in:draft,published'
        ]);

        $validated['created_by'] = auth()->id();

        $assessment = Assessment::create($validated);

        return redirect()->route('assessments.index')
            ->with('success', 'Assessment created successfully.');
    }
    public function show(Assessment $assessment)
    {
        $assessment->load(['subject', 'grade', 'academicYear', 'creator', 'marks.student.user']);

        return inertia('Teacher/Assessments/Show', [
            'assessment' => $assessment
        ]);
    }

    public function edit(Assessment $assessment)
    {
        $subjects = Subject::with('grade')->get();
        $grades = Grade::all();
        $academicYears = AcademicYear::where('status', 'active')->get();

        return inertia('Teacher/Assessments/Edit', [
            'assessment' => $assessment,
            'subjects' => $subjects,
            'grades' => $grades,
            'academicYears' => $academicYears
        ]);
    }

    public function update(Request $request, Assessment $assessment)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'subject_id' => 'required|exists:subjects,id',
            'grade_id' => 'required|exists:grades,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester' => 'required|in:1,2',
            'assessment_type' => 'required|in:Midterm,Test,Assignment,Final',
            'max_score' => 'required|numeric|min:1|max:100',
            'due_date' => 'nullable|date',
            'status' => 'required|in:draft,published,completed'
        ]);

        $assessment->update($validated);

        return redirect()->route('assessments.index')
            ->with('success', 'Assessment updated successfully.');
    }

    public function destroy(Assessment $assessment)
    {
        $assessment->delete();

        return redirect()->route('assessments.index')
            ->with('success', 'Assessment deleted successfully.');
    }
}