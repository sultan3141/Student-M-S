<?php

namespace App\Http\Controllers;

use App\Models\DocumentTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DirectorDocumentsController extends Controller
{
    /**
     * Display documents management page.
     */
    public function index()
    {
        $templates = DocumentTemplate::all();
        
        return Inertia::render('Director/Documents/Index', [
            'templates' => $templates,
        ]);
    }

    /**
     * Show create document form.
     */
    public function create()
    {
        $documentTypes = [
            'transcript' => 'Student Transcript',
            'certificate' => 'Certificate of Completion',
            'report_card' => 'Report Card',
            'admission_letter' => 'Admission Letter',
            'transfer_letter' => 'Transfer Letter',
            'conduct_certificate' => 'Conduct Certificate',
            'custom' => 'Custom Document',
        ];

        return Inertia::render('Director/Documents/Create', [
            'documentTypes' => $documentTypes,
        ]);
    }

    /**
     * Store a new document template.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'description' => 'nullable|string',
            'template_content' => 'required|string',
            'placeholders' => 'nullable|array',
            'is_default' => 'boolean',
            'is_active' => 'boolean',
        ]);

        // Ensure proper boolean types
        $validated['is_default'] = $request->boolean('is_default');
        $validated['is_active'] = $request->boolean('is_active');

        DocumentTemplate::create($validated);

        return redirect()->route('director.documents.index')
            ->with('success', 'Document template created successfully.');
    }

    /**
     * Show edit form.
     */
    public function edit(DocumentTemplate $document)
    {
        $documentTypes = [
            'transcript' => 'Student Transcript',
            'certificate' => 'Certificate of Completion',
            'report_card' => 'Report Card',
            'admission_letter' => 'Admission Letter',
            'transfer_letter' => 'Transfer Letter',
            'conduct_certificate' => 'Conduct Certificate',
            'custom' => 'Custom Document',
        ];

        return Inertia::render('Director/Documents/Edit', [
            'document' => $document,
            'documentTypes' => $documentTypes,
        ]);
    }

    /**
     * Update document template.
     */
    public function update(Request $request, DocumentTemplate $document)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'description' => 'nullable|string',
            'template_content' => 'required|string',
            'placeholders' => 'nullable|array',
            'is_default' => 'boolean',
            'is_active' => 'boolean',
        ]);

        // Ensure proper boolean types
        $validated['is_default'] = $request->boolean('is_default');
        $validated['is_active'] = $request->boolean('is_active');

        $document->update($validated);

        return redirect()->route('director.documents.index')
            ->with('success', 'Document template updated successfully.');
    }

    /**
     * Delete document template.
     */
    public function destroy(DocumentTemplate $document)
    {
        $document->delete();

        return redirect()->route('director.documents.index')
            ->with('success', 'Document template deleted successfully.');
    }

    /**
     * Generate document for a student.
     */
    public function generate(Request $request)
    {
        $validated = $request->validate([
            'template_id' => 'required|exists:document_templates,id',
            'student_id' => 'required|exists:students,id',
            'format' => 'required|in:pdf,docx',
        ]);

        $template = DocumentTemplate::findOrFail($validated['template_id']);
        $student = \App\Models\Student::with('user', 'grade', 'section')->findOrFail($validated['student_id']);

        // Fetch academic data
        $marks = \App\Models\Mark::with(['subject', 'assessment'])
            ->where('student_id', $student->id)
            ->get()
            ->groupBy('subject.name');
            
        $subjects = [];
        $totalScore = 0;
        $subjectCount = 0;
        
        foreach ($marks as $subjectName => $subjectMarks) {
            // Simplified calculation: Sum of scores (This assumes scores are normalized or raw totals)
            // Ideally should weigh by assessment type
            $subjectTotal = $subjectMarks->sum('score');
            
            $subjects[] = [
                'name' => $subjectName,
                'marks' => $subjectTotal,
                'grade' => $subjectTotal >= 50 ? 'Pass' : 'Fail', 
            ];
            $totalScore += $subjectTotal;
            $subjectCount++;
        }
        
        $average = $subjectCount > 0 ? $totalScore / $subjectCount : 0;

        // Prepare data for template rendering
        $data = [
            'student_name' => $student->user->name,
            'student_dob' => $student->user->dob ?? 'N/A', // Assuming dob property
            'student_id' => $student->student_id,
            'grade' => $student->grade->name,
            'section' => $student->section->name,
            'academic_year' => '2025-2026', // Should be dynamic from session/settings
            'date' => now()->format('d F Y'),
            'school_name' => config('app.name', 'School'),
            'subjects' => $subjects,
            'total_score' => $totalScore,
            'average' => number_format($average, 2),
            'result' => $average >= 50 ? 'PROMOTED' : 'RETAINED',
            'principal_signature' => '____________________',
        ];

        // Render template
        $content = $template->render($data);

        // Generate file based on format
        if ($validated['format'] === 'pdf') {
            return $this->generatePDF($content, $template->name, $student->student_id);
        } else {
            return $this->generateDocx($content, $template->name, $student->student_id);
        }
    }

    /**
     * Generate PDF document.
     */
    private function generatePDF($content, $templateName, $studentId)
    {
        try {
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($content);
            $filename = "{$templateName}_{$studentId}_" . date('Y-m-d_H-i-s') . '.pdf';
            return $pdf->download($filename);
        } catch (\Exception $e) {
            return back()->with('error', 'PDF generation failed: ' . $e->getMessage());
        }
    }

    /**
     * Generate DOCX document.
     */
    private function generateDocx($content, $templateName, $studentId)
    {
        // For now, return as HTML download
        // Full DOCX support would require additional package
        $filename = "{$templateName}_{$studentId}_" . date('Y-m-d_H-i-s') . '.html';
        
        return response()->streamDownload(function () use ($content) {
            echo $content;
        }, $filename, [
            'Content-Type' => 'text/html; charset=UTF-8',
        ]);
    }

    /**
     * Show document template details.
     */
    public function show(DocumentTemplate $document)
    {
        return Inertia::render('Director/Documents/Show', [
            'document' => $document,
        ]);
    }

    /**
     * Preview document template.
     */
    public function preview(DocumentTemplate $document)
    {
        $sampleData = [
            'student_name' => 'John Doe',
            'student_id' => 'STU-001',
            'grade' => 'Grade 10',
            'section' => 'A',
            'date' => now()->format('Y-m-d'),
            'school_name' => config('app.name', 'School'),
        ];

        $content = $document->render($sampleData);

        return response()->view('documents.preview', [
            'content' => $content,
            'title' => $document->name,
        ]);
    }

    /**
     * Generate batch documents.
     */
    public function generateBatch(Request $request)
    {
        $validated = $request->validate([
            'template_id' => 'required|exists:document_templates,id',
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:students,id',
            'format' => 'required|in:pdf,docx',
        ]);

        // This would typically generate multiple documents
        // For now, return a success message
        return back()->with('success', 'Batch document generation started.');
    }

    /**
     * Export Data (CSV).
     */
    public function exportData(Request $request)
    {
        $type = $request->input('type', 'students');
        $gradeId = $request->input('grade_id');
        $sectionId = $request->input('section_id');
        
        $filename = "{$type}_export_" . date('Y-m-d_H-i-s') . ".csv";

        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename={$filename}",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function() use ($type, $gradeId, $sectionId) {
            $file = fopen('php://output', 'w');
            
            if ($type === 'students') {
                fputcsv($file, ['Student ID', 'Name', 'Grade', 'Section', 'Status', 'Enrollment Date']);
                
                $query = \App\Models\Student::with('user', 'grade', 'section');
                if ($gradeId) $query->where('grade_id', $gradeId);
                if ($sectionId) $query->where('section_id', $sectionId);

                $query->chunk(100, function($students) use ($file) {
                    foreach ($students as $student) {
                        fputcsv($file, [
                            $student->student_id,
                            $student->user->name ?? 'N/A',
                            $student->grade->name ?? 'N/A',
                            $student->section->name ?? 'N/A',
                            $student->status ?? 'Active',
                            $student->created_at->format('Y-m-d')
                        ]);
                    }
                });
            } 
            elseif ($type === 'teachers') {
                fputcsv($file, ['Employee ID', 'Name', 'Department', 'Phone', 'Email']);
                \App\Models\Teacher::with('user')->chunk(100, function($teachers) use ($file) {
                    foreach ($teachers as $teacher) {
                        fputcsv($file, [
                            $teacher->employee_id,
                            $teacher->user->name ?? 'N/A',
                            $teacher->department ?? 'N/A',
                            $teacher->phone ?? 'N/A',
                            $teacher->user->email ?? 'N/A'
                        ]);
                    }
                });
            }
            elseif ($type === 'marks') {
                fputcsv($file, ['Student ID', 'Student Name', 'Grade', 'Subject', 'Assessment', 'Mark', 'Total']);
                
                $query = \App\Models\Mark::with(['student.user', 'student.grade', 'subject', 'assessment']);
                if ($gradeId) {
                    $query->whereHas('student', function($q) use ($gradeId) {
                        $q->where('grade_id', $gradeId);
                    });
                }
                
                $query->chunk(500, function($marks) use ($file) {
                    foreach ($marks as $mark) {
                        fputcsv($file, [
                            $mark->student->student_id ?? 'N/A',
                            $mark->student->user->name ?? 'N/A',
                            $mark->student->grade->name ?? 'N/A',
                            $mark->subject->name ?? 'N/A',
                            $mark->assessment->title ?? 'N/A', // Changed from type check
                             $mark->score,                             // Assuming score is the field
                            100 // Assuming default total 100 for now
                        ]);
                    }
                });
            }
            elseif ($type === 'fees') {
                fputcsv($file, ['Student ID', 'Student Name', 'Grade', 'Amount', 'Type', 'Status', 'Date']);
                
                $query = \App\Models\Payment::with(['student.user', 'student.grade']);
                if ($gradeId) {
                    $query->whereHas('student', function($q) use ($gradeId) {
                        $q->where('grade_id', $gradeId);
                    });
                }

                $query->chunk(500, function($payments) use ($file) {
                    foreach ($payments as $payment) {
                        fputcsv($file, [
                            $payment->student->student_id ?? 'N/A',
                            $payment->student->user->name ?? 'N/A',
                            $payment->student->grade->name ?? 'N/A',
                            $payment->amount,
                            $payment->type,
                            $payment->status,
                            $payment->transaction_date ? $payment->transaction_date->format('Y-m-d') : 'N/A'
                        ]);
                    }
                });
            }
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
