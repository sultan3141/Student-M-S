<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\AcademicYear;
use App\Models\SemesterPeriod;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DirectorDashboardController extends Controller
{
    /**
     * Display the main director dashboard.
     * Optimized with aggressive caching for instant load times
     */
    public function index()
    {
        // Cache the entire dashboard for 5 minutes
        $cacheKey = 'director_dashboard_complete';
        $dashboardData = cache()->remember($cacheKey, now()->addMinutes(5), function () {
            return [
                'statistics' => $this->getStatistics(),
                'recentData' => $this->getRecentData(),
                'semesterStatus' => $this->getSemesterStatus(),
            ];
        });

        return Inertia::render('Director/Dashboard', $dashboardData);
    }

    /**
     * Get school-wide statistics.
     * Extended cache TTL for better performance
     */
    private function getStatistics()
    {
        return cache()->remember('director_stats_overview', now()->addHours(1), function () {
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
        });
    }

    /**
     * Get recent students and parents for dashboard.
     * Optimized with extended cache TTL
     */
    private function getRecentData()
    {
        // Cache for 30 minutes for better performance
        return cache()->remember('director_recent_data', now()->addMinutes(30), function () {
            return [
                'recentStudents' => Student::query()
                    ->select(['students.id', 'students.user_id', 'students.grade_id', 'students.section_id', 'students.student_id', 'students.created_at'])
                    ->with([
                        'user:id,name',
                        'grade:id,name',
                        'section:id,name',
                        'parents:id'
                    ])
                    ->join('users', 'students.user_id', '=', 'users.id')
                    ->orderBy('users.name', 'asc')
                    ->take(10) // Reduced from 50 for faster dashboard load
                    ->get(),
                'recentParents' => \App\Models\ParentProfile::with(['user:id,name', 'students:id'])
                    ->latest()
                    ->take(5)
                    ->get(),
            ];
        });
    }

    /**
     * Get semester status for current academic year.
     * Cached for better performance
     */
    private function getSemesterStatus()
    {
        return cache()->remember('director_semester_status', now()->addMinutes(10), function () {
            // PostgreSQL-compatible boolean query
            $currentAcademicYear = \App\Models\AcademicYear::whereRaw("is_current = true")->first();

            if (!$currentAcademicYear) {
                // If no current academic year, return default empty status for semesters
                $semesters = [];
                foreach ([1, 2] as $semNum) {
                    // If there's no current academic year, we can't fetch SemesterPeriod data for it.
                    // We can return a default "closed" or "unavailable" status.
                    $semesters[] = [
                        'semester' => $semNum,
                        'status' => 'unavailable',
                        'is_open' => false,
                        'is_closed' => true,
                    ];
                }
                return [
                    'academicYear' => 'N/A',
                    'semesters' => $semesters,
                ];
            }

            $semesters = \App\Models\SemesterPeriod::where('academic_year_id', $currentAcademicYear->id)
                ->get()
                ->map(function ($semester) use ($currentAcademicYear) {
                    $daysRemaining = 0;
                    // Assuming 'semester' property is 1 for first semester, 2 for second
                    if ($semester->semester) {
                        $startDate = Carbon::parse($currentAcademicYear->start_date);
                        $endDate = Carbon::parse($currentAcademicYear->end_date);

                        $estimatedClose = $semester->semester == 1
                            ? $startDate->copy()->addMonths(6) // Assuming first semester is roughly 6 months
                            : $endDate; // Assuming second semester ends with the academic year
                        $daysRemaining = max(0, Carbon::now()->diffInDays($estimatedClose, false));
                    }

                    return [
                        'semester' => $semester->semester,
                        'status' => $semester->status,
                        'is_open' => $semester->isOpen(),
                        'is_closed' => $semester->isClosed(),
                    ];
                });

            return [
                'academicYear' => $currentAcademicYear->name,
                'semesters' => $semesters,
            ];
        });
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
