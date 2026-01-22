<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function dashboard()
    {
        $recentAssessments = Assessment::with(['subject', 'grade', 'marks'])
            ->where('created_by', auth()->id())
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $stats = [
            'total_assessments' => Assessment::where('created_by', auth()->id())->count(),
            'published_assessments' => Assessment::where('created_by', auth()->id())->where('status', 'published')->count(),
            'draft_assessments' => Assessment::where('created_by', auth()->id())->where('status', 'draft')->count(),
            'total_marks_uploaded' => Mark::whereHas('assessment', function($query) {
                $query->where('created_by', auth()->id());
            })->count(),
        ];

        // Get assessments that need marks uploaded
        $assessmentsNeedingMarks = Assessment::with(['subject', 'grade'])
            ->where('created_by', auth()->id())
            ->where('status', 'published')
            ->whereDoesntHave('marks')
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get();

        return inertia('Teacher/Dashboard', [
            'recentAssessments' => $recentAssessments,
            'stats' => $stats,
            'assessmentsNeedingMarks' => $assessmentsNeedingMarks
        ]);
    }
}