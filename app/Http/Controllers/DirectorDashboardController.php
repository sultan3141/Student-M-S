<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Teacher;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DirectorDashboardController extends Controller
{
    /**
     * Display the main director dashboard.
     */
    public function index()
    {
        $statistics = $this->getStatistics();
        $recentData = $this->getRecentData();

        return Inertia::render('Director/Dashboard', [
            'statistics' => $statistics,
            'recentData' => $recentData,
        ]);
    }

    /**
     * Get school-wide statistics.
     */
    private function getStatistics()
    {
        // Total student counts
        $totalStudents = Student::count();
        $maleStudents = Student::where('gender', 'Male')->count();
        $femaleStudents = Student::where('gender', 'Female')->count();

        // Total teacher/instructor count
        $totalInstructors = Teacher::count();

        // Total parents
        $totalParents = \App\Models\ParentProfile::count();

        return [
            'students' => [
                'male' => $maleStudents,
                'female' => $femaleStudents,
                'total' => $totalStudents,
                'malePercent' => $totalStudents > 0 ? round(($maleStudents / $totalStudents) * 100, 1) : 0,
                'femalePercent' => $totalStudents > 0 ? round(($femaleStudents / $totalStudents) * 100, 1) : 0,
            ],
            'instructors' => $totalInstructors,
            'parents' => $totalParents,
        ];
    }

    /**
     * Get all students and recent parents for dashboard.
     */
    private function getRecentData()
    {
        return [
            'recentStudents' => Student::with(['user', 'grade', 'section', 'parents.user'])
                ->get()
                ->sortBy(fn($student) => $student->user->name ?? '')
                ->values(),
            'recentParents' => \App\Models\ParentProfile::with(['user', 'students'])
                ->latest()
                ->take(5)
                ->get(),
        ];
    }

    /**
     * Get academic health metrics.
     */
    public function getAcademicHealth()
    {
        return response()->json([
            'average_performance' => 75,
            'pass_rate' => 85,
            'top_subjects' => ['Mathematics', 'English', 'Science'],
        ]);
    }

    /**
     * Get operational metrics.
     */
    public function getOperationalMetrics()
    {
        return response()->json([
            'attendance_rate' => 92,
            'teacher_utilization' => 88,
            'class_capacity' => 78,
        ]);
    }

    /**
     * Get financial overview.
     */
    public function getFinancialOverview()
    {
        return response()->json([
            'total_revenue' => 0,
            'pending_payments' => 0,
            'collection_rate' => 0,
        ]);
    }
}
