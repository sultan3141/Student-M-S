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
    public function index(Request $request)
    {
        $grades = Grade::with('sections')->orderBy('level')->get();
        $assessmentTypes = AssessmentType::all();

        return Inertia::render('Teacher/DeclareResult', [
            'grades' => $grades,
            'assessmentTypes' => $assessmentTypes,
            'initialStep' => (int) $request->input('step', 1),
            'initialGradeId' => (int) $request->input('grade_id'),
            'initialSectionId' => (int) $request->input('section_id'),
            'initialSubjectId' => (int) $request->input('subject_id'),
            'initialStudentId' => (int) $request->input('student_id'),
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

    public function getSubjects(Request $request)
    {
        // Get subjects assigned to this grade/section from grade_subject pivot table
        $subjects = DB::table('grade_subject')
            ->join('subjects', 'grade_subject.subject_id', '=', 'subjects.id')
            ->where('grade_subject.grade_id', $request->grade_id)
            ->where('grade_subject.section_id', $request->section_id)
            ->select('subjects.id', 'subjects.name', 'subjects.code')
            ->distinct()
            ->get();

        return response()->json($subjects);
    }

    public function getAssessments(Request $request)
    {
        $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'section_id' => 'required|exists:sections,id',
            'subject_id' => 'required|exists:subjects,id',
        ]);

        $academicYear = AcademicYear::where('is_current', true)->first();

        // Get assessments for the SPECIFIC section only
        $assessments = \App\Models\Assessment::where('grade_id', $request->grade_id)
            ->where('section_id', $request->section_id) // Only this section
            ->where('subject_id', $request->subject_id)
            ->where('academic_year_id', $academicYear->id)
            ->with('assessmentType')
            ->get()
            ->map(function ($assessment) {
                return [
                    'id' => $assessment->id,
                    'name' => $assessment->name,
                    'type_name' => $assessment->assessmentType ? $assessment->assessmentType->name : 'Custom',
                    'total_marks' => $assessment->max_score, // Map max_score to total_marks for frontend
                    'max_score' => $assessment->max_score,
                    'due_date' => $assessment->due_date,
                    'max_score' => $assessment->max_score,
                    'due_date' => $assessment->due_date,
                    'status' => $assessment->status,
                    'semester' => $assessment->semester,
                ];
            });

        return response()->json($assessments);
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
            $currentAcademicYear = AcademicYear::where('is_current', true)->first();
            
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
                    if ($markValue === null || $markValue === '') continue;

                    // Get assessment to verify and get max_score
                    $assessment = \App\Models\Assessment::find($assessmentId);
                    
                    if (!$assessment) continue;

                    // Check if semester is open
                    // Note: We check per assessment's semester. 
                    // Optimization: Could check once if all assessments share semester.
                    // But safe to check always.
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
                        $oldScore = $existingMark->score;
                        // Update existing mark
                        $existingMark->update([
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
                        $updatedCount++;

                        // Log Change
                        if ($oldScore != $markValue) {
                            \App\Models\MarkChangeLog::create([
                                'mark_id' => $existingMark->id,
                                'teacher_id' => $teacher->id,
                                'action' => 'updated',
                                'old_value' => (string)$oldScore,
                                'new_value' => (string)$markValue,
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
                            'new_value' => (string)$markValue,
                            'ip_address' => $request->ip(),
                            'user_agent' => $request->userAgent()
                        ]);
                    }
                }
            }
            
            DB::commit();
            
            $message = "Results saved successfully! ";
            if ($savedCount > 0) $message .= "{$savedCount} new marks saved. ";
            if ($updatedCount > 0) $message .= "{$updatedCount} marks updated.";
            
            return redirect()->route('teacher.declare-result.index')
                ->with('success', $message);
                
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to save results: ' . $e->getMessage()]);
        }
    }
}
