<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\Section;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Mark;
use App\Models\AssessmentType;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TeacherDeclareResultController extends Controller
{
    /**
     * Display the Result Declaration wizard
     * Allows teachers to verify students, bind subjects, and enter marks in 3 phases
     */
    public function index(Request $request)
    {
        $grades = Grade::with('sections.stream')->orderBy('level')->get()->map(function ($grade) {
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
                })->values()
            ];
        })->values();

        $assessmentTypes = AssessmentType::all();
        $currentAcademicYear = AcademicYear::whereRaw('is_current = true')->first();
        $currentSemester = $currentAcademicYear ? $currentAcademicYear->getCurrentSemester() : 1;

        return Inertia::render('Teacher/DeclareResult', [
            'grades' => $grades,
            'assessmentTypes' => $assessmentTypes,
            'currentSemester' => $currentSemester,
            'initialStep' => (int) $request->input('step', 1),
            'initialGradeId' => (int) $request->input('grade_id'),
            'initialSectionId' => (int) $request->input('section_id'),
            'initialSubjectId' => (int) $request->input('subject_id'),
            'initialStudentId' => (int) $request->input('student_id'),
            'initialShowClosed' => (bool) $request->input('show_closed', false),
        ]);
    }

    public function getStudents(Request $request)
    {
        $students = Student::with('user')
            ->where('grade_id', $request->grade_id)
            ->where('section_id', $request->section_id)
            ->orderBy('student_id')
            ->get();

        return response()->json($students);
    }

    /**
     * Get subjects for the selected grade
     */
    public function getSubjects(Request $request)
    {
        $request->validate([
            'grade_id' => 'required|exists:grades,id',
        ]);

        // Get all subjects for this grade
        $subjects = \App\Models\Subject::where('grade_id', $request->grade_id)
            ->orderBy('name')
            ->get()
            ->map(function ($subject) {
                return [
                    'id' => $subject->id,
                    'name' => $subject->name,
                    'code' => $subject->code,
                ];
            });

        return response()->json($subjects);
    }

    public function getAssessments(Request $request)
    {
        $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'section_id' => 'required|exists:sections,id',
            'subject_id' => 'required|exists:subjects,id',
        ]);

        $academicYear = AcademicYear::whereRaw('is_current = true')->first();

        if (!$academicYear) {
            return response()->json([]);
        }

        $showClosed = $request->query('show_closed', false);

        // Get assessments for the SPECIFIC section
        $assessmentsQuery = \App\Models\Assessment::where('grade_id', $request->grade_id)
            ->where('section_id', $request->section_id)
            ->where('subject_id', $request->subject_id)
            ->where('academic_year_id', $academicYear->id);

        $assessments = $assessmentsQuery->with('assessmentType')->get();

        // Filter out closed semesters unless explicitly requested
        if (!$showClosed) {
            $gradeId = $request->grade_id;
            $assessments = $assessments->filter(function ($assessment) use ($gradeId) {
                return \App\Models\SemesterStatus::isOpen($gradeId, $assessment->semester);
            });
        }

        $formattedAssessments = $assessments->map(function ($assessment) {
            return [
                'id' => $assessment->id,
                'name' => $assessment->name,
                'type_name' => $assessment->assessmentType ? $assessment->assessmentType->name : 'Custom',
                'total_marks' => $assessment->max_score,
                'max_score' => $assessment->max_score,
                'due_date' => $assessment->due_date ? $assessment->due_date->format('Y-m-d') : null,
                'status' => $assessment->status,
                'semester' => $assessment->semester,
            ];
        });

        return response()->json($formattedAssessments->values());
    }

    public function getExistingMarks(Request $request)
    {
        $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'section_id' => 'required|exists:sections,id',
            'subject_id' => 'required|exists:subjects,id',
            'student_ids' => 'required|string',
        ]);

        $studentIds = explode(',', $request->student_ids);

        // Get existing marks for these students
        $marks = Mark::whereIn('student_id', $studentIds)
            ->where('grade_id', $request->grade_id)
            ->where('section_id', $request->section_id)
            ->where('subject_id', $request->subject_id)
            ->whereNotNull('assessment_id')
            ->get();

        // Format as: { student_id: { assessment_id: score } }
        $formattedMarks = [];
        foreach ($marks as $mark) {
            if (!isset($formattedMarks[$mark->student_id])) {
                $formattedMarks[$mark->student_id] = [];
            }
            $formattedMarks[$mark->student_id][$mark->assessment_id] = $mark->score;
        }

        return response()->json($formattedMarks);
    }

    public function checkStatus(Request $request)
    {
        $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'semester' => 'required|in:1,2',
        ]);

        $isOpen = \App\Models\SemesterStatus::isOpen($request->grade_id, $request->semester);

        return response()->json(['is_open' => $isOpen]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'section_id' => 'required|exists:sections,id',
            'subject_id' => 'required|exists:subjects,id',
            'marks' => 'required|array',
            'marks.*' => 'required|array',
            'marks.*.*' => 'nullable|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $currentAcademicYear = AcademicYear::whereRaw('is_current = true')->first();

            if (!$currentAcademicYear) {
                throw new \Exception('No active academic year found.');
            }

            $teacher = auth()->user()->teacher;

            if (!$teacher) {
                throw new \Exception('Teacher profile not found.');
            }

            $savedCount = 0;
            $updatedCount = 0;

            // Iterate over students
            foreach ($validated['marks'] as $studentId => $studentMarks) {
                // Iterate over assessments for this student
                foreach ($studentMarks as $assessmentId => $markValue) {
                    if ($markValue === null || $markValue === '')
                        continue;

                    // Get assessment to verify and get max_score
                    $assessment = \App\Models\Assessment::find($assessmentId);

                    if (!$assessment)
                        continue;

                    // Check if semester is open
                    if (!\App\Models\SemesterStatus::isOpen($validated['grade_id'], $assessment->semester)) {
                        throw new \Exception("Result entry for Semester {$assessment->semester} is CLOSED.");
                    }

                    // Validate mark doesn't exceed max_score
                    if ($markValue > $assessment->max_score) {
                        throw new \Exception("Mark {$markValue} exceeds maximum score {$assessment->max_score} for assessment {$assessment->name}");
                    }

                    // Check if mark already exists
                    $existingMark = Mark::where('student_id', $studentId)
                        ->where('assessment_id', $assessmentId)
                        ->first();

                    if ($existingMark) {
                        // Allow updates if the score has changed
                        if ($existingMark->score != $markValue) {
                            $oldValue = $existingMark->score;
                            $existingMark->update([
                                'score' => $markValue,
                                'teacher_id' => $teacher->id,
                                'submitted_at' => now(),
                            ]);
                            $updatedCount++;

                            // Log Update
                            \App\Models\MarkChangeLog::create([
                                'mark_id' => $existingMark->id,
                                'teacher_id' => $teacher->id,
                                'action' => 'updated',
                                'old_value' => (string) $oldValue,
                                'new_value' => (string) $markValue,
                                'ip_address' => $request->ip(),
                                'user_agent' => $request->userAgent()
                            ]);
                        }
                    } else {
                        // Create new mark
                        $mark = Mark::create([
                            'student_id' => $studentId,
                            'assessment_id' => $assessmentId,
                            'score' => $markValue,
                            'max_score' => $assessment->max_score,
                            'teacher_id' => $teacher->id,
                            'subject_id' => $validated['subject_id'],
                            'grade_id' => $validated['grade_id'],
                            'section_id' => $validated['section_id'],
                            'academic_year_id' => $currentAcademicYear->id,
                            'semester' => $assessment->semester,
                            'is_submitted' => true,
                            'submitted_at' => now(),
                        ]);
                        $savedCount++;

                        // Log Creation
                        \App\Models\MarkChangeLog::create([
                            'mark_id' => $mark->id,
                            'teacher_id' => $teacher->id,
                            'action' => 'created',
                            'old_value' => null,
                            'new_value' => (string) $markValue,
                            'ip_address' => $request->ip(),
                            'user_agent' => $request->userAgent()
                        ]);
                    }
                }
            }

            DB::commit();

            // Invalidate semester rankings cache for affected semesters
            // Get unique semester values from the assessments processed
            $processedSemesters = collect();
            foreach ($validated['marks'] as $studentId => $studentMarks) {
                foreach ($studentMarks as $assessmentId => $markValue) {
                    if ($markValue === null || $markValue === '')
                        continue;
                    $assessment = \App\Models\Assessment::find($assessmentId);
                    if ($assessment) {
                        $processedSemesters->push($assessment->semester);
                    }
                }
            }

            // Invalidate cache for each unique semester
            foreach ($processedSemesters->unique() as $semester) {
                \App\Http\Controllers\SemesterRecordController::invalidateSemesterRankings(
                    $validated['section_id'],
                    $semester,
                    $currentAcademicYear->id
                );
            }

            $message = "Results saved successfully! ";
            if ($savedCount > 0)
                $message .= "{$savedCount} new marks saved. ";
            if ($updatedCount > 0)
                $message .= "{$updatedCount} marks updated.";

            return redirect()->route('teacher.declare-result.index')
                ->with('success', $message);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to save results: ' . $e->getMessage()]);
        }
    }
}
