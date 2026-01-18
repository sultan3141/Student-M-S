<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Student;
use App\Models\Mark;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AssessmentController extends Controller
{
    /**
     * Display a listing of assessments.
     */
    public function index(Request $request)
    {
        $query = Assessment::with(['subject', 'grade', 'section', 'assessmentType'])
            ->forTeacher(auth()->user()->teacher->id);

        // Filter by semester if provided
        if ($request->has('semester')) {
            $query->bySemester($request->semester);
        }

        // Filter by grade if provided
        if ($request->has('grade_id')) {
            $query->where('grade_id', $request->grade_id);
        }

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $assessments = $query->orderBy('due_date', 'desc')->get()->map(function ($assessment) {
            return [
                'id' => $assessment->id,
                'name' => $assessment->name,
                'subject' => $assessment->subject->name ?? 'N/A',
                'grade' => $assessment->grade->name ?? 'N/A',
                'section' => $assessment->section->name ?? 'N/A',
                'type' => $assessment->assessmentType->name ?? 'N/A',
                'weight' => $assessment->weight_percentage,
                'semester' => $assessment->semester,
                'due_date' => $assessment->due_date?->format('M d, Y'),
                'status' => $assessment->status,
                'completion_percentage' => $assessment->completion_percentage,
            ];
        });

        return Inertia::render('Teacher/Assessments/Index', [
            'assessments' => $assessments,
        ]);
    }

    /**
     * Show the form for creating a new assessment.
     */
    public function create()
    {
        return Inertia::render('Teacher/Assessments/Create');
    }

    /**
     * Store a newly created assessment.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'subject_id' => 'required|exists:subjects,id',
            'grade_id' => 'required|exists:grades,id',
            'section_id' => 'required|exists:sections,id',
            'assessment_type_id' => 'required|exists:assessment_types,id',
            'name' => 'required|string|max:255',
            'weight_percentage' => 'required|numeric|min:0|max:100',
            'max_score' => 'nullable|numeric|min:0',
            'semester' => 'required|in:1,2',
            'due_date' => 'nullable|date',
            'description' => 'nullable|string',
            'status' => 'nullable|in:draft,published,locked',
        ]);

        $assessment = Assessment::create($validated);

        return redirect()->route('teacher.marks.wizard.index')->with('success', 'Assessment created successfully!');
    }

    /**
     * Get performance statistics for an assessment.
     */
    public function getStats($id)
    {
        $assessment = Assessment::with('marks')->findOrFail($id);
        
        $marks = $assessment->marks->whereNotNull('marks_obtained')->pluck('marks_obtained');
        
        if ($marks->isEmpty()) {
            return response()->json([
                'average' => 0,
                'highest' => 0,
                'lowest' => 0,
                'pass_rate' => 0,
                'std_deviation' => 0,
                'distribution' => [
                    '0-49' => 0,
                    '50-59' => 0,
                    '60-69' => 0,
                    '70-79' => 0,
                    '80-89' => 0,
                    '90-100' => 0,
                ],
                'total_students' => Student::where('section_id', $assessment->section_id)->count(),
                'marks_entered' => 0,
            ]);
        }

        $average = $marks->avg();
        $highest = $marks->max();
        $lowest = $marks->min();
        $passRate = ($marks->filter(fn($mark) => $mark >= 50)->count() / $marks->count()) * 100;
        
        // Calculate standard deviation
        $variance = $marks->map(fn($mark) => pow($mark - $average, 2))->avg();
        $stdDeviation = sqrt($variance);

        // Distribution
        $distribution = [
            '0-49' => $marks->filter(fn($m) => $m >= 0 && $m < 50)->count(),
            '50-59' => $marks->filter(fn($m) => $m >= 50 && $m < 60)->count(),
            '60-69' => $marks->filter(fn($m) => $m >= 60 && $m < 70)->count(),
            '70-79' => $marks->filter(fn($m) => $m >= 70 && $m < 80)->count(),
            '80-89' => $marks->filter(fn($m) => $m >= 80 && $m < 90)->count(),
            '90-100' => $marks->filter(fn($m) => $m >= 90 && $m <= 100)->count(),
        ];

        return response()->json([
            'average' => round($average, 2),
            'highest' => $highest,
            'lowest' => $lowest,
            'pass_rate' => round($passRate, 2),
            'std_deviation' => round($stdDeviation, 2),
            'distribution' => $distribution,
            'total_students' => Student::where('section_id', $assessment->section_id)->count(),
            'marks_entered' => $marks->count(),
        ]);
    }

    /**
     * Export CSV template for bulk mark entry.
     */
    public function exportTemplate($id)
    {
        $assessment = Assessment::with(['section.students'])->findOrFail($id);
        
        $students = $assessment->section->students()->orderBy('name')->get();

        $csvData = "Student ID,Student Name,Mark (0-100)\n";
        foreach ($students as $student) {
            $csvData .= "{$student->student_id},{$student->name},\n";
        }

        return response($csvData, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="marks_template_' . $assessment->name . '.csv"',
        ]);
    }

    /**
     * Import marks from CSV.
     */
    public function importMarks(Request $request, $id)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
        ]);

        $assessment = Assessment::findOrFail($id);
        $file = $request->file('file');
        
        $csvData = array_map('str_getcsv', file($file->getRealPath()));
        $header = array_shift($csvData); // Remove header row

        $imported = 0;
        $errors = [];

        DB::beginTransaction();
        try {
            foreach ($csvData as $index => $row) {
                if (count($row) < 3) continue;

                $studentId = trim($row[0]);
                $mark = trim($row[2]);

                if (empty($mark)) continue;

                // Validate mark
                if (!is_numeric($mark) || $mark < 0 || $mark > 100) {
                    $errors[] = "Row " . ($index + 2) . ": Invalid mark value '$mark'";
                    continue;
                }

                // Find student
                $student = Student::where('student_id', $studentId)
                    ->where('section_id', $assessment->section_id)
                    ->first();

                if (!$student) {
                    $errors[] = "Row " . ($index + 2) . ": Student '$studentId' not found";
                    continue;
                }

                // Create or update mark
                Mark::updateOrCreate(
                    [
                        'student_id' => $student->id,
                        'assessment_id' => $assessment->id,
                    ],
                    [
                        'marks_obtained' => $mark,
                        'max_marks' => $assessment->max_score,
                    ]
                );

                $imported++;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'imported' => $imported,
                'errors' => $errors,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
