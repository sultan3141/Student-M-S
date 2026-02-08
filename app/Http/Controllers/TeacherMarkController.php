<?php

namespace App\Http\Controllers;

use App\Models\Mark;
use App\Models\Student;
use App\Services\RankingService;
use App\Models\AssessmentType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TeacherMarkController extends Controller
{
    protected $rankingService;

    public function __construct(RankingService $rankingService)
    {
        $this->rankingService = $rankingService;
    }

    /**
     * Display the main mark entry dashboard.
     * Fetches assigned classes and available assessment types for the teacher
     * to begin the mark entry process.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Mock data for the index page if models aren't fully set up
        $classes = [
            ['id' => 1, 'name' => 'Grade 10 - Section A', 'subject' => 'Mathematics'],
            ['id' => 2, 'name' => 'Grade 11 - Section B', 'subject' => 'Physics'],
        ];

        $assessmentTypes = AssessmentType::all();

        return Inertia::render('Teacher/Marks/Index', [
            'classes' => $classes,
            'assessmentTypes' => $assessmentTypes,
        ]);
    }

    /**
     * Show the mark entry wizard or specific assessment entry page
     */
    public function create(Request $request)
    {
        $teacher = \App\Models\Teacher::where('user_id', Auth::id())->firstOrFail();
        
        // Get assessment_id from query if entering marks for specific assessment
        $assessmentId = $request->query('assessment_id');
        
        if ($assessmentId) {
            // Render mark entry page for specific assessment
            $assessment = \App\Models\Assessment::with(['assessmentType', 'subject', 'grade', 'section'])
                ->findOrFail($assessmentId);
            
            // Verify teacher owns this assessment
            if ($assessment->teacher_id !== $teacher->id) {
                abort(403);
            }
            
            // Get students in this section
            $students = Student::where('section_id', $assessment->section_id)
                ->with(['user:id,name'])
                ->get()
                ->map(function ($student) use ($assessment) {
                    $mark = \App\Models\Mark::where('assessment_id', $assessment->id)
                        ->where('student_id', $student->id)
                        ->first();
                    
                    return [
                        'id' => $student->id,
                        'name' => $student->user->name,
                        'student_id' => $student->student_id,
                        'student_id_number' => $student->student_id,
                        'mark' => $mark->score ?? null, // Changed from marks_obtained to score
                        'status' => $mark ? ($mark->is_submitted ? 'saved' : 'draft') : 'pending',
                    ];
                });
            
            return Inertia::render('Teacher/Marks/Entry', [
                'assessment' => [
                    'id' => $assessment->id,
                    'name' => $assessment->name,
                    'type' => $assessment->assessmentType->name,
                    'weight' => $assessment->weight_percentage,
                    'max_score' => $assessment->max_score,
                    'due_date' => $assessment->due_date?->format('Y-m-d'),
                ],
                'students' => $students,
                'subject' => $assessment->subject->name,
                'semester' => $assessment->semester,
                'is_locked' => !\App\Models\SemesterStatus::isOpen($assessment->grade_id, $assessment->semester, $assessment->academic_year_id),
            ]);
        }
        
        // Otherwise, render the old wizard (fallback)
        $assignments = $teacher->assignments()
            ->with(['grade', 'section', 'subject'])
            ->get()
            ->map(function ($assignment) {
                return [
                    'id' => $assignment->id,
                    'grade' => $assignment->grade,
                    'grade_id' => $assignment->grade_id,
                    'section' => $assignment->section,
                    'section_id' => $assignment->section_id,
                    'subject' => $assignment->subject,
                    'subject_id' => $assignment->subject_id,
                ];
            });

        $currentAcademicYear = '2025-2026';
        $assessmentTypes = AssessmentType::all();

        return Inertia::render('Teacher/Marks/Create', [
            'assignments' => $assignments,
            'currentAcademicYear' => $currentAcademicYear,
            'assessmentTypes' => $assessmentTypes,
        ]);
    }

    /**
     * Store or update marks for an assessment.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'assessment_id' => 'required|exists:assessments,id',
            'marks' => 'required|array',
            'marks.*.student_id' => 'required',
            'marks.*.mark' => 'required|numeric|min:0|max:100',
        ]);

        $teacher = \App\Models\Teacher::where('user_id', Auth::id())->firstOrFail();
        $assessment = \App\Models\Assessment::findOrFail($validated['assessment_id']);
        
        // Verify teacher owns this assessment
        if ($assessment->teacher_id !== $teacher->id) {
            abort(403);
        }

        // Verify semester is OPEN (for specific academic year)
        if (!\App\Models\SemesterStatus::isOpen($assessment->grade_id, $assessment->semester, $assessment->academic_year_id)) {
            return redirect()->back()->withErrors(['error' => "Result entry for Semester {$assessment->semester} is currently CLOSED."]);
        }

        DB::transaction(function () use ($validated, $assessment, $teacher, $request) {
            foreach ($validated['marks'] as $item) {
                // Fetch existing to track changes
                $existingMark = Mark::where('student_id', $item['student_id'])
                    ->where('assessment_id', $validated['assessment_id'])
                    ->first();

                $oldScore = $existingMark ? $existingMark->score : null;
                $newScore = $item['mark'];

                // Update or Create
                $mark = Mark::updateOrCreate(
                    [
                        'student_id' => $item['student_id'],
                        'assessment_id' => $validated['assessment_id'],
                    ],
                    [
                        'subject_id' => $assessment->subject_id,
                        'grade_id' => $assessment->grade_id,
                        'section_id' => $assessment->section_id,
                        'semester' => $assessment->semester,
                        'teacher_id' => $teacher->id,
                        'score' => $newScore,
                        'assessment_type_id' => $assessment->assessment_type_id,
                        'academic_year_id' => $assessment->academic_year_id,
                        'is_submitted' => true,
                    ]
                );

                // Audit Log
                if ($oldScore !== (float)$newScore) { // Compare values
                   $action = $existingMark ? 'updated' : 'created';
                   // If it's an update but value didn't change (strict check vs approx), skip? 
                   // But here we checked !== so we log.
                   
                   \App\Models\MarkChangeLog::create([
                        'mark_id' => $mark->id,
                        'teacher_id' => $teacher->id,
                        'action' => $action,
                        'old_value' => $oldScore !== null ? (string)$oldScore : null,
                        'new_value' => (string)$newScore,
                        'ip_address' => $request->ip(),
                        'user_agent' => $request->userAgent()
                   ]);
                }
            }
            
            // Clear cache after marks are updated
            $studentIds = collect($validated['marks'])->pluck('student_id');
            foreach ($studentIds as $studentId) {
                \Cache::forget("student_{$studentId}_semesters");
                \Cache::forget("student_{$studentId}_semester_{$assessment->semester}_year_{$assessment->academic_year_id}");
                \Cache::forget("student_{$studentId}_academic_year_{$assessment->academic_year_id}");
            }
            
            // Invalidate semester rankings for this section
            // This ensures all students see updated rankings immediately
            \App\Http\Controllers\SemesterRecordController::invalidateSemesterRankings(
                $assessment->section_id,
                $assessment->semester,
                $assessment->academic_year_id
            );
        });

        return redirect()->back()->with('success', 'Marks saved successfully.');
    }
}
