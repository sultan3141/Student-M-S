<?php

namespace App\Http\Controllers;

use App\Models\DocumentTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentTemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $templates = DocumentTemplate::latest()->get();
        $grades = \App\Models\Grade::with('sections')->get();
        $academic_years = \App\Models\AcademicYear::orderBy('start_date', 'desc')->get();

        // Add Student Query for Transcripts tab
        $studentQuery = \App\Models\Student::with(['user', 'grade', 'section']);
        
        if ($request->filled('search')) {
            $search = $request->search;
            $studentQuery->where(function($q) use ($search) {
                $q->where('student_id', 'like', "%{$search}%")
                  ->orWhereHas('user', function($u) use ($search) {
                      $u->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('grade_id')) {
            $studentQuery->where('grade_id', $request->grade_id);
        }

        $students = $studentQuery->paginate(10)->withQueryString();

        return Inertia::render('Director/Documents/Index', [
            'templates' => $templates,
            'grades' => $grades,
            'academic_years' => $academic_years,
            'students' => $students,
            'filters' => $request->only(['search', 'grade_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Director/Documents/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'description' => 'nullable|string',
            'template_content' => 'required|string', // HTML content
            'is_active' => 'boolean',
        ]);

        // Extract placeholders from content robustly
        preg_match_all('/\{\{\s*(.*?)\s*\}\}/', $validated['template_content'], $matches);
        // Trim each placeholder to handle {{ name }} vs {{name}}
        $placeholders = collect($matches[1])->map(fn($p) => trim($p))->unique()->values()->all();
        $validated['placeholders'] = $placeholders;

        DocumentTemplate::create($validated);

        return redirect()->route('director.documents.index')
            ->with('success', 'Document template created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(DocumentTemplate $documentTemplate)
    {
        // Preview logic could go here
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $documentTemplate = DocumentTemplate::findOrFail($id);
        return Inertia::render('Director/Documents/Edit', [
            'template' => $documentTemplate
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $documentTemplate = DocumentTemplate::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'description' => 'nullable|string',
            'template_content' => 'required|string',
            'is_active' => 'boolean',
        ]);

        // Extract placeholders from content robustly
        preg_match_all('/\{\{\s*(.*?)\s*\}\}/', $validated['template_content'], $matches);
        // Trim each placeholder to handle {{ name }} vs {{name}}
        $placeholders = collect($matches[1])->map(fn($p) => trim($p))->unique()->values()->all();
        $validated['placeholders'] = $placeholders;

        $documentTemplate->update($validated);

        return redirect()->route('director.documents.index')
            ->with('success', 'Document template updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $documentTemplate = DocumentTemplate::findOrFail($id);
        $documentTemplate->delete();

        return redirect()->route('director.documents.index')
            ->with('success', 'Document template deleted successfully.');
    }
}
