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
        $teacher = Teacher::where('user_id', Auth::id())->first();

        if (!$teacher) {
            return Inertia::render('Teacher/Assessments/Index', [
                'assessments' => [],
                'error' => 'Teacher profile not found. Please contact the administrator.'
            ]);
        }

        // Get current academic year and open semester
        $academicYear = \App\Models\AcademicYear::current();
        if (!$academicYear) {
            return Inertia::render('Teacher/Assessments/Index', [
                'assessments' => [],
                'error' => 'No active academic year found.'
            ]);
        }
        $currentSemester = $academicYear->getCurrentSemester() ?? 1;

        // Get all assessments created by this teacher
        $assessmentsQuery = Assessment::with(['grade', 'section', 'subject', 'assessmentType'])
            ->where('teacher_id', $teacher->id);

        // Apply filters if provided
        if ($request->filled('grade_id')) {
            $assessmentsQuery->where('grade_id', $request->grade_id);
        }

        if ($request->filled('section_id')) {
            $assessmentsQuery->where('section_id', $request->section_id);
        }

        $assessments = $assessmentsQuery->orderBy('due_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        // Filter out assessments from closed semesters to "clear" the view for the new semester
        $filteredAssessments = $assessments->filter(function ($assessment) {
            return \App\Models\SemesterStatus::isOpen($assessment->grade_id, $assessment->semester);
        })->values();

        return Inertia::render('Teacher/Assessments/Index', [
            'assessments' => $filteredAssessments,
            'all_assessments_count' => $assessments->count(),
            'current_semester' => $currentSemester,
            'filters' => $request->only(['grade_id', 'section_id']),
        ]);
    }

    /**
     * Show create form with fixed grades (1-12)
     */
    public function create()
    {
        $teacher = Teacher::where('user_id', Auth::id())->first();

        if (!$teacher) {
            return redirect()->route('teacher.dashboard')
                ->with('error', 'Teacher profile not found. Please contact the administrator.');
        }

        $academicYear = \App\Models\AcademicYear::whereRaw('is_current = true')->first();

        if (!$academicYear) {
            return redirect()->route('teacher.dashboard')
                ->with('error', 'No active academic year found. Please contact the administrator.');
        }

        // Get all grades 1-12 with their sections (all sections, not just assigned)
        $grades = \App\Models\Grade::with('sections.stream')
            ->whereIn('level', range(1, 12))
            ->orderBy('level')
            ->get()
            ->map(function ($grade) {
                return [
                    'id' => $grade->id,
                    'name' => $grade->name,
                    'level' => $grade->level,
                    'sections' => $grade->sections->map(function ($section) {
                        return [
                            'id' => $section->id,
                            'name' => $section->name,
                            'stream_name' => $section->stream->name ?? null,
                        ];
                    }),
                ];
            });

        return Inertia::render('Teacher/Assessments/CreateSimple', [
            'grades' => $grades,
            'academicYear' => $academicYear,
            'currentSemester' => $academicYear->getCurrentSemester() ?? 1,
        ]);
    }

    /**
     * Get subjects for selected grade (across all sections)
     */
    public function getSubjectsForClass(Request $request)
    {
        $request->validate([
            'grade_id' => 'required|exists:grades,id',
        ]);

        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
        $gradeId = $request->grade_id;

        // Get subjects this teacher teaches in this grade (across all sections)
        $subjects = \App\Models\TeacherAssignment::with('subject')
            ->where('teacher_id', $teacher->id)
            ->where('grade_id', $gradeId)
            ->get()
            ->pluck('subject')
            ->unique('id')
            ->map(function ($subject) {
                return [
                    'id' => $subject->id,
                    'name' => $subject->name,
                    'code' => $subject->code,
                ];
            })
            ->values();

        return response()->json([
            'subjects' => $subjects
        ]);
    }

    /**
     * Get subjects for selected grade (all sections)
     */
    public function getSubjects(Request $request)
    {
        $request->validate([
            'grade_id' => 'required|exists:grades,id',
        ]);

        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
        $gradeId = $request->grade_id;

        // Get subjects this teacher teaches in this grade (across all sections)
        $subjects = \App\Models\TeacherAssignment::with('subject')
            ->where('teacher_id', $teacher->id)
            ->where('grade_id', $gradeId)
            ->get()
            ->pluck('subject')
            ->unique('id')
            ->map(function ($subject) {
                return [
                    'id' => $subject->id,
                    'name' => $subject->name,
                    'code' => $subject->code,
                ];
            })
            ->values();

        return response()->json($subjects);
    }

    /**
     * Get assessment types for selected subject
     */
    public function getAssessmentTypes(Request $request)
    {
        $types = \App\Models\AssessmentType::where('grade_id', $request->grade_id)
            ->where('section_id', $request->section_id)
            ->where('subject_id', $request->subject_id)
            ->get();

        return response()->json($types);
    }

    /**
     * Get assessment types for selected grade and subject (ignoring section specific ones)
     */
    public function getAssessmentTypesForClass(Request $request)
    {
        $request->validate([
            'grade_id' => 'required',
            'subject_id' => 'required',
        ]);

        $types = \App\Models\AssessmentType::where('grade_id', $request->grade_id)
            ->where('subject_id', $request->subject_id)
            ->whereNull('section_id') // Only get types applicable to the whole grade/class
            ->orWhere(function ($q) use ($request) {
                // Also get global types if any (where grade, subject, section are null)
                $q->whereNull('grade_id')->whereNull('subject_id')->whereNull('section_id');
            })
            // Or types that match grade but no subject/section
            ->orWhere(function ($q) use ($request) {
                $q->where('grade_id', $request->grade_id)->whereNull('subject_id')->whereNull('section_id');
            })
            ->get();

        return response()->json($types);
    }

    /**
     * Store assessment for ALL sections in the grade
     */
    public function store(Request $request)
    {
        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
        $academicYear = \App\Models\AcademicYear::whereRaw('is_current = true')->first();

        $validated = $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'subject_id' => 'required|exists:subjects,id',
            'assessments' => 'required|array|min:1',
            'assessments.*.name' => 'required|string|max:255',
            'assessments.*.total_marks' => 'required|numeric|min:0',
            'assessments.*.assessment_type_id' => 'nullable|exists:assessment_types,id',
            'assessments.*.due_date' => 'nullable|date',
            'assessments.*.description' => 'nullable|string',
        ]);

        // Get all sections in this grade that the teacher teaches this subject
        $sections = \App\Models\TeacherAssignment::where('teacher_id', $teacher->id)
            ->where('grade_id', $validated['grade_id'])
            ->where('subject_id', $validated['subject_id'])
            ->distinct()
            ->pluck('section_id');

        if ($sections->isEmpty()) {
            return back()->withErrors(['error' => 'You are not assigned to teach this subject in this grade.']);
        }

        // Create assessments for each section
        $totalCreated = 0;

        foreach ($validated['assessments'] as $assessmentData) {
            // Determine weight - use type default if not specified, else 0 (teacher can update later)
            $weight = 0;
            if (!empty($assessmentData['assessment_type_id'])) {
                $type = \App\Models\AssessmentType::find($assessmentData['assessment_type_id']);
                if ($type) {
                    $weight = $type->weight ?? $type->weight_percentage ?? 0;
                }
            }

            foreach ($sections as $sectionId) {
                Assessment::create([
                    'name' => $assessmentData['name'],
                    'teacher_id' => $teacher->id,
                    'grade_id' => $validated['grade_id'],
                    'section_id' => $sectionId,
                    'subject_id' => $validated['subject_id'],
                    'assessment_type_id' => $assessmentData['assessment_type_id'] ?? null,
                    'due_date' => $assessmentData['due_date'] ?? now()->addDays(7),
                    'max_score' => $assessmentData['total_marks'],
                    'description' => $assessmentData['description'] ?? null,
                    'academic_year_id' => $academicYear->id,
                    'weight_percentage' => $weight,
                    'semester' => $academicYear->getCurrentSemester() ?? '1',
                    'status' => 'published',
                ]);
                $totalCreated++;
            }
        }

        return redirect()->route('teacher.assessments-simple.index')
            ->with('success', count($validated['assessments']) . " assessment(s) created successfully for " . $sections->count() . " section(s)!");
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

        $assessment->update($validated);
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

    /**
     * Unified Assessment Manager (Single Page Interface)
     */
    public function unified(Request $request)
    {
        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
        $academicYear = \App\Models\AcademicYear::whereRaw('is_current = true')->first();

        // Get grades 1-12 with their sections (all sections, not just assigned)
        $grades = \App\Models\Grade::with('sections')
            ->whereIn('level', range(1, 12))
            ->orderBy('level')
            ->get()
            ->map(function ($grade) {
                return [
                    'id' => $grade->id,
                    'name' => $grade->name,
                    'sections' => $grade->sections->map(function ($section) {
                        return [
                            'id' => $section->id,
                            'name' => $section->name,
                        ];
                    }),
                ];
            });

        return Inertia::render('Teacher/Assessments/Unified', [
            'grades' => $grades,
            'academicYear' => $academicYear,
        ]);
    }

    /**
     * Fetch all data for the Unified Grid (Students + Assessments + Marks)
     */
    public function unifiedData(Request $request)
    {
        $request->validate([
            'grade_id' => 'required',
            'section_id' => 'required',
            'subject_id' => 'required',
        ]);

        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
        $gradeId = $request->grade_id;
        $sectionId = $request->section_id;
        $subjectId = $request->subject_id;
        $academicYear = \App\Models\AcademicYear::whereRaw('is_current = true')->first();

        // 1. Get Students
        $students = Student::where('grade_id', $gradeId)
            ->where('section_id', $sectionId)
            ->where('academic_year_id', $academicYear->id)
            ->with('user')
            ->orderBy('student_id')
            ->get()
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'name' => $s->user->name,
                    'student_id' => $s->student_id,
                    'avatar' => $s->user->profile_photo_url ?? null, // simpler avatar handling
                ];
            });

        // 2. Get Assessments for this specific class/subject
        $assessments = Assessment::where('grade_id', $gradeId)
            // Assessments can be specific to a section OR global for the grade (null section_id)
            // But usually teachers create them for specific sections or we clone them.
            // For now, let's fetch assessments linked to this section AND subject.
            ->where('section_id', $sectionId)
            ->where('subject_id', $subjectId)
            ->where('teacher_id', $teacher->id)
            ->orderBy('created_at', 'asc')
            ->get();

        // 3. Get Marks
        $assessmentIds = $assessments->pluck('id');
        $marks = \App\Models\Mark::whereIn('assessment_id', $assessmentIds)
            ->whereIn('student_id', $students->pluck('id'))
            ->get()
            ->groupBy('student_id')
            ->map(function ($studentMarks) {
                return $studentMarks->mapWithKeys(function ($mark) {
                    return [$mark->assessment_id => $mark->score];
                });
            });

        return response()->json([
            'students' => $students,
            'assessments' => $assessments,
            'marks' => $marks
        ]);
    }
}
