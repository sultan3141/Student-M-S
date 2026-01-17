<?php

namespace App\Http\Controllers;

use App\Services\RankingService;
use App\Models\AssessmentType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherRankingController extends Controller
{
    protected $rankingService;

    public function __construct(RankingService $rankingService)
    {
        $this->rankingService = $rankingService;
    }

    /**
     * Retrieve real-time live rankings for the dashboard widget.
     * Returns a JSON response containing the top 5 students, performance trends,
     * and class-wide statistics (average, highest score, pass rate).
     *
     * @param Request $request
     * @param int $classId
     * @return \Illuminate\Http\JsonResponse
     */
    public function live(Request $request, $classId)
    {
        $subject = $request->query('subject', 'Mathematics');
        
        // Mock data for demonstration
        $rankings = collect([
            [
                'rank_position' => 1,
                'average_score' => 94.5,
                'student' => ['user' => ['name' => 'Sara Chen']],
                'trend' => 'up'
            ],
            [
                'rank_position' => 2,
                'average_score' => 89.2,
                'student' => ['user' => ['name' => 'Michael Brown']],
                'trend' => 'stable'
            ],
            [
                'rank_position' => 3,
                'average_score' => 87.8,
                'student' => ['user' => ['name' => 'Emma Garcia']],
                'trend' => 'up'
            ],
            [
                'rank_position' => 4,
                'average_score' => 85.4,
                'student' => ['user' => ['name' => 'James Lee']],
                'trend' => 'down'
            ],
            [
                'rank_position' => 5,
                'average_score' => 82.1,
                'student' => ['user' => ['name' => 'David Wilson']],
                'trend' => 'stable'
            ]
        ]);

        $stats = [
            'class_average' => 76.4,
            'highest_score' => 94.5,
            'above_80' => 8,
            'below_50' => 3,
            'total_students' => 25
        ];

        return response()->json([
            'rankings' => $rankings,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the full ranking report page.
     */
    public function index(Request $request)
    {
         // Mock classes for dropdown
         $classes = [
            ['id' => 1, 'name' => 'Grade 10 - Section A', 'subject' => 'Mathematics'],
            ['id' => 2, 'name' => 'Grade 11 - Section B', 'subject' => 'Physics'],
        ];

        return Inertia::render('Teacher/Rankings/Index', [
            'classes' => $classes,
        ]);
    }
}
