<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\AssessmentComponent;
use App\Models\Teacher;
use App\Models\Section;
use App\Models\Subject;
use App\Models\Student;
use App\Models\Mark;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TeacherCustomAssessmentController extends Controller
{
    /**
     * Display teacher's custom assessments
     */
    public function index()
    {
        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
        
        $assessments = Assessment::where('teacher_id', $teacher->id)
            ->with(['subject', 'grade', 'section', 'components'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($assessment) {
                $studentsCount = Student::where('section_id', $assessment->section_id)->count();
                $marksEntered = Mark::where('assessment_id', $assessment->id)->whereNotNull('score')->count();
                
                return [
                    'id' => $assessment->id,
                    'name' => $assessment->name,
                    'subject_name' => $assessment->subject->name,
                    'section_name' => $assessment->grade->name . ' - ' . $assessment->section->name,
                    'semester' => $assessment->semester,
                    'status' => $assessment->status,
                    'components' => $assessment->components->map(function ($component) {
                        return [
                            'name' => $component->name,
                            'max_weight' => $component->max_weight,
                            'description' => $component->description,
                        ];
                    }),
                    'components_count' => $assessment->components->count(),
                    'students_count' => $studentsCount,
                    'completion_rate' => $studentsCount > 0 ? round(($marksEntered / $studentsCount) * 100) : 0,
                ];
            });

        return Inertia::render('Teacher/Assessments/Index', [
            'assessments' => $assessments,
        ]);
    }

    /**
     * Show form to create new assessment
     */
    public function create()
    {
        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
        
        // Get teacher's assigned sections
        $sections = Section::whereHas('teacherAssignments', function ($query) use ($teacher) {
            $query->where('teacher_id', $teacher->id);
        })->with(['grade'])->get()->map(function ($section) {
            return [
                'id' => $section->id,
                'full_name' => $section->grade->name . ' - ' . $section->name,
            ];
        });

        // Get teacher's subjects
        $subjects = Subject::whereHas('teacherAssignments', function ($query) use ($teacher) {
            $query->where('teacher_id', $teacher->id);
        })->get(['id', 'name']);

        return Inertia::render('Teacher/Assessments/Create', [
            'sections' => $sections,
            'subjects' => $subjects,
        ]);
    }

    /**
     * Store new custom assessment
     */
    public function store(Request $request)
    {
        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
        
        $validated = $request->validate([
            'section_id' => 'required|exists:sections,id',
            'subject_id' => 'required|exists:subjects,id',
            'semester' => 'required|in:1,2',
            'assessment_name' => 'required|string|max:255',
            'assessment_items' => 'required|array|min:1',
            'assessment_items.*.name' => 'required|string|max:255',
            'assessment_items.*.max_weight' => 'required|numeric|min:1|max:100',
            'assessment_items.*.description' => 'nullable|string|max:500',
        ]);

        // Validate total weight equals 100
        $totalWeight = collect($validated['assessment_items'])->sum('max_weight');
        if ($totalWeight != 100) {
            return back()->withErrors(['assessment_items' => 'Total weight must equal 100%']);
        }

        // Verify teacher has access to this section and subject
        $hasAssignment = $teacher->assignments()
            ->where('section_id', $validated['section_id'])
            ->where('subject_id', $validated['subject_id'])
            ->exists();

        if (!$hasAssignment) {
            return back()->withErrors(['section_id' => 'You are not assigned to this section and subject']);
        }

        DB::beginTransaction();
        try {
            // Get section and grade info
            $section = Section::with('grade')->findOrFail($validated['section_id']);
            
            // Create main assessment
            $assessment = Assessment::create([
                'teacher_id' => $teacher->id,
                'subject_id' => $validated['subject_id'],
                'grade_id' => $section->grade_id,
                'section_id' => $validated['section_id'],
                'academic_year_id' => 1, // You might want to get current academic year
                'name' => $validated['assessment_name'],
                'semester' => $validated['semester'],
                'max_score' => 100, // Total score is always 100
                'status' => 'draft',
            ]);

            // Create assessment components
            foreach ($validated['assessment_items'] as $item) {
                AssessmentComponent::create([
                    'assessment_id' => $assessment->id,
                    'name' => $item['name'],
                    'max_weight' => $item['max_weight'],
                    'description' => $item['description'] ?? null,
                ]);
            }

            DB::commit();

            return redirect()->route('teacher.custom-assessments.index')
                ->with('success', 'Assessment created successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create assessment: ' . $e->getMessage()]);
        }
    }

    /**
     * Show assessment details
     */
    public function show($id)
    {
        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
        
        $assessment = Assessment::where('teacher_id', $teacher->id)
            ->with(['subject', 'grade', 'section', 'components'])
            ->findOrFail($id);

        $students = Student::where('section_id', $assessment->section_id)
            ->with('user')
            ->orderBy('student_id')
            ->get();

        // Get marks for this assessment
        $marks = Mark::where('assessment_id', $assessment->id)
            ->get()
            ->keyBy('student_id');

        $studentsWithMarks = $students->map(function ($student) use ($marks, $assessment) {
            $mark = $marks->get($student->id);
            
            return [
                'id' => $student->id,
                'student_id' => $student->student_id,
                'name' => $student->user->name,
                'total_score' => $mark->score ?? null,
                'component_scores' => $mark ? json_decode($mark->component_scores, true) : [],
                'status' => $mark ? 'completed' : 'pending',
            ];
        });

        return Inertia::render('Teacher/Assessments/Show', [
            'assessment' => [
                'id' => $assessment->id,
                'name' => $assessment->name,
                'subject_name' => $assessment->subject->name,
                'section_name' => $assessment->grade->name . ' - ' . $assessment->section->name,
                'semester' => $assessment->semester,
                'status' => $assessment->status,
                'components' => $assessment->components->map(function ($component) {
                    return [
                        'id' => $component->id,
                        'name' => $component->name,
                        'max_weight' => $component->max_weight,
                        'description' => $component->description,
                    ];
                }),
            ],
            'students' => $studentsWithMarks,
        ]);
    }

    /**
     * Show marks entry form for specific assessment
     */
    public function enterMarks($id)
    {
        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
        
        $assessment = Assessment::where('teacher_id', $teacher->id)
            ->with(['subject', 'grade', 'section', 'components'])
            ->findOrFail($id);

        $students = Student::where('section_id', $assessment->section_id)
            ->with('user')
            ->orderBy('student_id')
            ->get();

        // Get existing marks
        $marks = Mark::where('assessment_id', $assessment->id)
            ->get()
            ->keyBy('student_id');

        $studentsWithMarks = $students->map(function ($student) use ($marks) {
            $mark = $marks->get($student->id);
            
            return [
                'id' => $student->id,
                'student_id' => $student->student_id,
                'name' => $student->user->name,
                'component_scores' => $mark ? json_decode($mark->component_scores, true) : [],
                'total_score' => $mark->score ?? 0,
            ];
        });

        return Inertia::render('Teacher/Assessments/EnterMarks', [
            'assessment' => [
                'id' => $assessment->id,
                'name' => $assessment->name,
                'subject_name' => $assessment->subject->name,
                'section_name' => $assessment->grade->name . ' - ' . $assessment->section->name,
                'semester' => $assessment->semester,
                'components' => $assessment->components->map(function ($component) {
                    return [
                        'id' => $component->id,
                        'name' => $component->name,
                        'max_weight' => $component->max_weight,
                        'description' => $component->description,
                    ];
                }),
            ],
            'students' => $studentsWithMarks,
        ]);
    }

    /**
     * Store marks for assessment
     */
    public function storeMarks(Request $request, $id)
    {
        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
        
        $assessment = Assessment::where('teacher_id', $teacher->id)->findOrFail($id);
        
        $validated = $request->validate([
            'marks' => 'required|array',
            'marks.*.student_id' => 'required|exists:students,id',
            'marks.*.component_scores' => 'required|array',
            'marks.*.total_score' => 'required|numeric|min:0|max:100',
        ]);

        DB::beginTransaction();
        try {
            foreach ($validated['marks'] as $markData) {
                Mark::updateOrCreate(
                    [
                        'student_id' => $markData['student_id'],
                        'assessment_id' => $assessment->id,
                    ],
                    [
                        'teacher_id' => $teacher->id,
                        'subject_id' => $assessment->subject_id,
                        'grade_id' => $assessment->grade_id,
                        'section_id' => $assessment->section_id,
                        'academic_year_id' => $assessment->academic_year_id,
                        'semester' => $assessment->semester,
                        'score' => $markData['total_score'],
                        'max_score' => 100,
                        'component_scores' => json_encode($markData['component_scores']),
                        'is_submitted' => true,
                        'submitted_at' => now(),
                    ]
                );
            }

            // Update assessment status
            $assessment->update(['status' => 'active']);

            DB::commit();

            return redirect()->route('teacher.custom-assessments.show', $assessment->id)
                ->with('success', 'Marks saved successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to save marks: ' . $e->getMessage()]);
        }
    }
}
