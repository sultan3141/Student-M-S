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
        
        // 1. Mark Distribution across all subjects
        $distribution = Mark::where('teacher_id', $teacher->id)
            ->selectRaw('
                count(*) as total,
                SUM(CASE WHEN score >= 90 THEN 1 ELSE 0 END) as grade_A,
                SUM(CASE WHEN score >= 80 AND score < 90 THEN 1 ELSE 0 END) as grade_B,
                SUM(CASE WHEN score >= 70 AND score < 80 THEN 1 ELSE 0 END) as grade_C,
                SUM(CASE WHEN score >= 60 AND score < 70 THEN 1 ELSE 0 END) as grade_D,
                SUM(CASE WHEN score < 60 THEN 1 ELSE 0 END) as grade_F
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
                DB::raw('CONCAT(grades.name, " - ", sections.name) as class_name'),
                DB::raw('SUM(CASE WHEN score >= 60 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as pass_rate')
            )
            ->groupBy('grades.name', 'sections.name')
            ->get();

        return Inertia::render('Teacher/Reports/Index', [
            'distribution' => $distribution,
            'subjectPerformance' => $subjectPerformance,
            'classPassRate' => $classPassRate,
        ]);
    }
}
