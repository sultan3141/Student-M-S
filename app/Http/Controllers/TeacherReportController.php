<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Teacher;
use App\Models\Mark;
use Illuminate\Support\Facades\DB;

class TeacherReportController extends Controller
{
    public function index()
    {
        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();

        // 1. Score Statistics across all subjects
        $statistics = Mark::where('teacher_id', $teacher->id)
            ->selectRaw('
                count(*) as total,
                AVG(score) as average_score,
                MIN(score) as min_score,
                MAX(score) as max_score,
                SUM(CASE WHEN score >= 80 THEN 1 ELSE 0 END) as high_performers,
                SUM(CASE WHEN score >= 60 THEN 1 ELSE 0 END) as passing_students,
                SUM(CASE WHEN score < 60 THEN 1 ELSE 0 END) as failing_students
            ')
            ->first();

        // 2. Average Score per Subject
        $subjectPerformance = Mark::where('teacher_id', $teacher->id)
            ->join('subjects', 'marks.subject_id', '=', 'subjects.id')
            ->select('subjects.name', DB::raw('AVG(score) as average_score'))
            ->groupBy('subjects.id', 'subjects.name')
            ->get();

        // 3. Pass Rate per Class (Section)
        $classPassRate = Mark::where('teacher_id', $teacher->id)
            ->join('sections', 'marks.section_id', '=', 'sections.id')
            ->join('grades', 'marks.grade_id', '=', 'grades.id')
            ->select(
                DB::raw('grades.name || " - " || sections.name as class_name'),
                DB::raw('SUM(CASE WHEN score >= 60 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as pass_rate')
            )
            ->groupBy('grades.name', 'sections.name')
            ->get();

        return Inertia::render('Teacher/Reports/Index', [
            'statistics' => $statistics,
            'subjectPerformance' => $subjectPerformance,
            'classPassRate' => $classPassRate,
        ]);
    }
}
