<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Mark;
use App\Models\Student;
use Illuminate\Http\Request;

class MarkController extends Controller
{
    public function uploadForm(Assessment $assessment)
    {
        // Get all students in the assessment's grade
        $students = Student::with('user')
            ->where('grade_id', $assessment->grade_id)
            ->get();

        // Get existing marks for this assessment
        $existingMarks = Mark::where('assessment_id', $assessment->id)
            ->pluck('score', 'student_id');

        return inertia('Teacher/Marks/Upload', [
            'assessment' => $assessment->load(['subject', 'grade']),
            'students' => $students,
            'existingMarks' => $existingMarks
        ]);
    }

    public function bulkStore(Request $request, Assessment $assessment)
    {
        $validated = $request->validate([
            'marks' => 'required|array',
            'marks.*.student_id' => 'required|exists:students,id',
            'marks.*.score' => 'required|numeric|min:0|max:' . $assessment->max_score,
            'marks.*.remarks' => 'nullable|string|max:500'
        ]);

        foreach ($validated['marks'] as $markData) {
            Mark::updateOrCreate(
                [
                    'student_id' => $markData['student_id'],
                    'assessment_id' => $assessment->id
                ],
                [
                    'score' => $markData['score'],
                    'remarks' => $markData['remarks'] ?? null
                ]
            );
        }

        return redirect()->route('assessments.show', $assessment)
            ->with('success', 'Marks uploaded successfully.');
    }

    public function studentMarks(Student $student)
    {
        $marks = Mark::with(['assessment.subject', 'assessment.academicYear'])
            ->where('student_id', $student->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('Student/Marks/Index', [
            'student' => $student->load('user'),
            'marks' => $marks
        ]);
    }
}