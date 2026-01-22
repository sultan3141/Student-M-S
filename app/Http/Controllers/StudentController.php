<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Mark;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function dashboard()
    {
        // Get the authenticated user's student profile
        $user = auth()->user();
        $student = $user->student; 

        if (!$student) {
            abort(403, 'User is not linked to a student profile.');
        }

        // Load grade, section, and academic year info
        $student->load(['grade', 'section', 'parent']);
        
        $subjects = \App\Models\Subject::where('grade_id', $student->grade_id)->get();

        // Get recent marks for this student
        $recentMarks = Mark::with(['assessment.subject', 'assessment.academicYear'])
            ->where('student_id', $student->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Get assessments for this student's grade
        $upcomingAssessments = Assessment::with(['subject', 'creator'])
            ->where('grade_id', $student->grade_id)
            ->where('status', 'published')
            ->whereDoesntHave('marks', function($query) use ($student) {
                $query->where('student_id', $student->id);
            })
            ->orderBy('due_date', 'asc')
            ->limit(5)
            ->get();

        // Calculate average score
        $averageScore = Mark::where('student_id', $student->id)
            ->join('assessments', 'marks.assessment_id', '=', 'assessments.id')
            ->selectRaw('AVG((marks.score / assessments.max_score) * 100) as average')
            ->value('average');

        return inertia('Student/Dashboard', [
            'student' => $student,
            'subjects' => $subjects,
            'academicYear' => \App\Models\AcademicYear::where('status', 'active')->first(),
            'recentMarks' => $recentMarks,
            'upcomingAssessments' => $upcomingAssessments,
            'averageScore' => round($averageScore ?? 0, 1)
        ]);
    }

    public function marks()
    {
        $user = auth()->user();
        $student = $user->student;

        if (!$student) {
            abort(403, 'User is not linked to a student profile.');
        }

        $marks = Mark::with(['assessment.subject', 'assessment.academicYear'])
            ->where('student_id', $student->id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        // Group marks by subject for better organization
        $marksBySubject = Mark::with(['assessment.subject'])
            ->where('student_id', $student->id)
            ->get()
            ->groupBy('assessment.subject.name');

        return inertia('Student/Marks/Index', [
            'student' => $student->load(['grade', 'section']),
            'marks' => $marks,
            'marksBySubject' => $marksBySubject
        ]);
    }
}
