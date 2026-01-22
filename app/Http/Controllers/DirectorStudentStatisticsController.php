<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Grade;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DirectorStudentStatisticsController extends Controller
{
    /**
     * Display student statistics page.
     */
    public function index()
    {
        $statistics = $this->getStatistics();
        
        return Inertia::render('Director/Statistics/Students', [
            'statistics' => $statistics,
        ]);
    }

    /**
     * Get student enrollment statistics.
     */
    public function getStatistics()
    {
        // Total student counts
        $totalStudents = Student::count();
        $maleStudents = Student::where('gender', 'Male')->count();
        $femaleStudents = Student::where('gender', 'Female')->count();

        // Total teacher/instructor count
        $totalInstructors = \App\Models\Teacher::count();

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

    /**
     * Get statistics as JSON (for AJAX).
     */
    public function getStatisticsJson()
    {
        return response()->json($this->getStatistics());
    }
}
