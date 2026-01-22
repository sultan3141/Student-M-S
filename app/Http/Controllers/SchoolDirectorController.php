<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use App\Models\Grade;
use App\Models\Subject;
use App\Models\AcademicYear;
use Illuminate\Http\Request;

class SchoolDirectorController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'total_students' => Student::count(),
            'total_teachers' => User::role('teacher')->count(),
            'total_assessments' => Assessment::count(),
            'active_academic_year' => AcademicYear::where('status', 'active')->first(),
        ];

        $recentAssessments = Assessment::with(['subject', 'grade', 'creator'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $gradeStats = Grade::withCount(['students'])->get();

        return inertia('SchoolDirector/Dashboard', [
            'stats' => $stats,
            'recentAssessments' => $recentAssessments,
            'gradeStats' => $gradeStats
        ]);
    }

    public function teachers()
    {
        $teachers = User::role('teacher')
            ->with(['teacher'])
            ->paginate(10);

        return inertia('SchoolDirector/Teachers/Index', [
            'teachers' => $teachers
        ]);
    }

    public function assessments()
    {
        $assessments = Assessment::with(['subject', 'grade', 'creator'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return inertia('SchoolDirector/Assessments/Index', [
            'assessments' => $assessments
        ]);
    }

    public function reports()
    {
        $assessmentsByType = Assessment::selectRaw('assessment_type, COUNT(*) as count')
            ->groupBy('assessment_type')
            ->get();

        $assessmentsByGrade = Assessment::with('grade')
            ->selectRaw('grade_id, COUNT(*) as count')
            ->groupBy('grade_id')
            ->get();

        return inertia('SchoolDirector/Reports', [
            'assessmentsByType' => $assessmentsByType,
            'assessmentsByGrade' => $assessmentsByGrade
        ]);
    }
}