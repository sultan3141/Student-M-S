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
        
        // Get current semester information
        $currentSemester = $this->getCurrentSemesterInfo();
        
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
            'currentSemester' => $currentSemester,
        ]);
    }

    /**
     * Get current semester information for teacher
     */
    private function getCurrentSemesterInfo()
    {
        $academicYear = \App\Models\AcademicYear::where('is_current', true)->first();
        
        if (!$academicYear) {
            return null;
        }

        $semester = $academicYear->getCurrentSemester();
        
        // precise status for each semester
        $semesters = [];
        foreach([1, 2] as $semNum) {
            $statusRecord = \App\Models\SemesterStatus::where('academic_year_id', $academicYear->id)
                ->where('semester', $semNum)
                ->first();
            
            $semesters[$semNum] = [
                'semester' => $semNum,
                'status' => $statusRecord ? $statusRecord->status : 'closed',
            ];
        }

        // Logic for "Active" display
        $status = $semester ? 'open' : 'closed';
        $displaySemester = $semester ?? ($academicYear->getOverallStatus() === 'completed' ? 2 : 1);

        $daysRemaining = 0;
        if ($semester) {
             // Simple estimation: End date of year for S2, Mid-point for S1
             $estimatedClose = $semester == 1 
                ? $academicYear->start_date->copy()->addMonths(6)
                : $academicYear->end_date;
             $daysRemaining = max(0, now()->diffInDays($estimatedClose, false));
        }

        return [
            'academic_year' => $academicYear->name,
            'semester' => $displaySemester,
            'status' => $status,
            'is_open' => $semester !== null,
            'can_enter_marks' => $semester !== null, // Teachers can only enter marks if semester is open
            'message' => $semester !== null 
                ? 'Semester is active. Mark entry is enabled.' 
                : 'No active semester. Mark entry is disabled.',
            'days_remaining' => $daysRemaining,
            'details' => $semesters, // Detailed status for S1 and S2
        ];
    }
}
