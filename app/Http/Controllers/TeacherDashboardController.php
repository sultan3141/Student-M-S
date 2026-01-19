<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Teacher;

class TeacherDashboardController extends Controller
{
    public function index()
    {
        $teacher = Teacher::firstOrCreate(
            ['user_id' => Auth::id()],
            ['employee_id' => 'EMP'.Auth::id(), 'qualification' => 'PhD', 'specialization' => 'General']
        );
        
        // Mock data for demonstration
        $totalStudents = 150;
        $pendingMarksCount = 12;
        
        $activities = [
            'Submitted marks for Math - Grade 10A',
            'Updated assessment for Science - Grade 9B',
            'Created new assignment for English',
            'Reviewed submissions from Grade 11',
            'Graded final exam for Physics'
        ];

        $upcomingDeadlines = [
            ['title' => 'Math Midterm Submission', 'subject' => 'Mathematics', 'days_left' => '3'],
            ['title' => 'Science Final Grades', 'subject' => 'Science', 'days_left' => '5'],
            ['title' => 'English Essay Review', 'subject' => 'English', 'days_left' => '7'],
            ['title' => 'Physics Lab Reports', 'subject' => 'Physics', 'days_left' => '10'],
        ];

        return Inertia::render('Teacher/Dashboard', [
            'stats' => [
                'totalStudents' => $totalStudents,
                'pendingMarks' => $pendingMarksCount,
                'completionRate' => 75,
            ],
            'recentActivity' => $activities,
            'deadlines' => $upcomingDeadlines,
            'teacher' => $teacher->load('user'),
        ]);
    }
}
