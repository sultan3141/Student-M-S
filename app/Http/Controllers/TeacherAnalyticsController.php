<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherAnalyticsController extends Controller
{
    public function index(Request $request)
    {
        // Mock classes/subjects for dropdown
        $classes = [
            ['id' => 1, 'name' => 'Grade 10 - Section A', 'subject' => 'Mathematics'],
            ['id' => 2, 'name' => 'Grade 11 - Section B', 'subject' => 'Physics'],
        ];

        return Inertia::render('Teacher/Analytics/Index', [
            'classes' => $classes,
        ]);
    }

    /**
     * Get detailed analytics for a specific class.
     * Calculates score distribution (histogram data), key performance metrics
     * (pass rate, top performers), and historical trend data for charts.
     *
     * @param Request $request
     * @param int $classId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getClassAnalytics(Request $request, $classId)

    {
        // Mock data logic simulating a DB query for class performance
        
        // 1. Performance Distribution (Histogram)
        $distribution = [
            '90-100' => 4,
            '80-89' => 10,
            '70-79' => 15,
            '60-69' => 8,
            '50-59' => 3,
            '0-49' => 5
        ];

        // 2. Key Metrics
        $metrics = [
            'classAverage' => 68.5,
            'passRate' => 89,
            'topPerformer' => ['name' => 'Sara Chen', 'score' => 90.0],
            'mostImproved' => ['name' => 'Lisa Johnson', 'score' => '+15.2%'],
            'needsAttention' => 5 // count of students below 50%
        ];

        // 3. Historical Average Trend (Class average over time)
        $trendDates = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
        $trendScores = [62, 65, 64, 67, 68.5];

        return response()->json([
            'distribution' => $distribution,
            'metrics' => $metrics,
            'trends' => [
                'dates' => $trendDates,
                'scores' => $trendScores
            ]
        ]);
    }

    public function getStudentAnalytics(Request $request, $studentId)
    {
        // Mock student history
        $history = [
            ['assessment' => 'Midterm Exam', 'score' => 92, 'classAvg' => 68, 'rank' => 1],
            ['assessment' => 'Test 1', 'score' => 88, 'classAvg' => 65, 'rank' => 2],
            ['assessment' => 'Test 2', 'score' => 95, 'classAvg' => 70, 'rank' => 1],
            ['assessment' => 'Assignment 1', 'score' => 100, 'classAvg' => 75, 'rank' => 1],
            ['assessment' => 'Final Exam', 'score' => 90, 'classAvg' => 68, 'rank' => 1],
        ];

        return response()->json([
            'history' => $history,
            'semesterAverage' => 90.0,
            'rank' => 1,
            'trend' => 'up'
        ]);
    }
}
