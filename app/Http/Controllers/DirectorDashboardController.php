<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Teacher;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DirectorDashboardController extends Controller
{
    /**
     * Display the main director dashboard (now showing student statistics).
     */
    public function index()
    {
        $statistics = $this->getStatistics();

        return Inertia::render('Director/Dashboard', [
            'statistics' => $statistics,
        ]);
    }

    /**
     * Get student enrollment statistics.
     */
    private function getStatistics()
    {
        // Total student counts
        $totalStudents = Student::count();
        $maleStudents = Student::where('gender', 'Male')->count();
        $femaleStudents = Student::where('gender', 'Female')->count();

        // Total teacher/instructor count
        $totalInstructors = Teacher::count();

        return [
            'students' => [
                'male' => $maleStudents,
                'female' => $femaleStudents,
                'total' => $totalStudents,
                'malePercent' => $totalStudents > 0 ? round(($maleStudents / $totalStudents) * 100, 1) : 0,
                'femalePercent' => $totalStudents > 0 ? round(($femaleStudents / $totalStudents) * 100, 1) : 0,
            ],
            'instructors' => $totalInstructors,
        ];
    }
}
