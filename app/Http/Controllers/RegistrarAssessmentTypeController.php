<?php

namespace App\Http\Controllers;

use App\Models\AssessmentType;
use App\Models\Grade;
use App\Models\Section;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RegistrarAssessmentTypeController extends Controller
{
    public function index()
    {
        $assessmentTypes = AssessmentType::with(['grade', 'section', 'subject'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Registrar/AssessmentTypes/Index', [
            'assessmentTypes' => $assessmentTypes,
        ]);
    }

    public function create()
    {
        $grades = Grade::with('sections')->orderBy('level')->get();

        return Inertia::render('Registrar/AssessmentTypes/Create', [
            'grades' => $grades,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'grade_id' => 'required|exists:grades,id',
            'section_id' => 'required|exists:sections,id',
            'subject_id' => 'required|exists:subjects,id',
            'weight' => 'nullable|numeric|min:0|max:100',
            'description' => 'nullable|string',
        ]);

        AssessmentType::create($validated);

        return redirect()->route('registrar.assessment-types.index')
            ->with('success', 'Assessment type created successfully!');
    }

    public function edit($id)
    {
        $assessmentType = AssessmentType::with(['grade', 'section', 'subject'])->findOrFail($id);
        $grades = Grade::with('sections')->orderBy('level')->get();

        return Inertia::render('Registrar/AssessmentTypes/Edit', [
            'assessmentType' => $assessmentType,
            'grades' => $grades,
        ]);
    }

    public function update(Request $request, $id)
    {
        $assessmentType = AssessmentType::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'grade_id' => 'required|exists:grades,id',
            'section_id' => 'required|exists:sections,id',
            'subject_id' => 'required|exists:subjects,id',
            'weight' => 'nullable|numeric|min:0|max:100',
            'description' => 'nullable|string',
        ]);

        $assessmentType->update($validated);

        return redirect()->route('registrar.assessment-types.index')
            ->with('success', 'Assessment type updated successfully!');
    }

    public function destroy($id)
    {
        $assessmentType = AssessmentType::findOrFail($id);
        $assessmentType->delete();

        return redirect()->route('registrar.assessment-types.index')
            ->with('success', 'Assessment type deleted successfully!');
    }

    public function getSubjects(Request $request)
    {
        $subjects = DB::table('grade_subject')
            ->join('subjects', 'grade_subject.subject_id', '=', 'subjects.id')
            ->where('grade_subject.grade_id', $request->grade_id)
            ->where('grade_subject.section_id', $request->section_id)
            ->whereRaw('grade_subject.is_active = true')
            ->select('subjects.id', 'subjects.name', 'subjects.code')
            ->get();

        return response()->json($subjects);
    }
}
