<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
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
        
        // Fetch statistics using the new cached method
        $stats = $this->getStatistics($teacher);
        
        // Fetch recent activities using the new optimized method
        $activities = $this->getRecentActivities($teacher);

        // Fetch upcoming deadlines using the new optimized method
        $upcomingDeadlines = $this->getUpcomingDeadlines($teacher);

        return Inertia::render('Teacher/Dashboard', [
            'stats' => $stats,
            'recentActivity' => $activities,
            'deadlines' => $upcomingDeadlines,
            'teacher' => $teacher->load('user'),
            'currentSemester' => $currentSemester,
        ]);
    }

    /**
     * Get cached statistics for the teacher.
     */
    private function getStatistics($teacher)
    {
        return Cache::remember("teacher_stats_{$teacher->id}", 300, function() use ($teacher) {
            // Count unique students across all assigned sections
            $totalStudents = \App\Models\Registration::whereIn('section_id', function($query) use ($teacher) {
                $query->select('section_id')
                    ->from('teacher_assignments')
                    ->where('teacher_id', $teacher->id);
            })->count();

            // Total subjects taught
            $totalSubjects = $teacher->subjects()->count();

            // Count pending marks (this is potentially heavy, can be simplified or cached)
            // For a more accurate count, you'd need to define what "pending marks" means
            // e.g., assignments created but not all students have marks entered.
            $pendingMarks = 0; // Placeholder or simplified logic for now

            return [
                'totalStudents' => $totalStudents,
                'totalSubjects' => $totalSubjects,
                'pendingMarks' => $pendingMarks,
                'attendanceRate' => 98.5, // Mock for now
                'activeClasses' => $teacher->teacherAssignments()->distinct('section_id')->count(),
            ];
        });
    }

    /**
     * Get recent activities for the teacher.
     */
    private function getRecentActivities($teacher)
    {
        // Assuming 'Mark' model represents grade entries
        return \App\Models\Mark::where('teacher_id', $teacher->id)
            ->with(['student.user:id,name', 'subject:id,name']) // Eager load only necessary columns
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($mark) {
                return [
                    'id' => $mark->id,
                    'type' => 'grade_entry',
                    'title' => 'Grade Entered',
                    'description' => "Entered " . ($mark->assessment_type ?? 'mark') . " for " . ($mark->student->user->name ?? 'Student'),
                    'time' => $mark->created_at->diffForHumans(),
                    'status' => 'completed'
                ];
            });
    }

    /**
     * Get upcoming deadlines for the teacher.
     */
    private function getUpcomingDeadlines($teacher)
    {
        // This is a placeholder. In a real application, you would fetch this from a database
        // e.g., from an 'assignments' or 'deadlines' table, filtered by teacher's subjects/sections.
        // For now, returning the mock data as per the original structure.
        return [
            ['title' => 'Math Midterm Submission', 'subject' => 'Mathematics', 'days_left' => '3'],
            ['title' => 'Science Final Grades', 'subject' => 'Science', 'days_left' => '5'],
            ['title' => 'English Essay Review', 'subject' => 'English', 'days_left' => '7'],
            ['title' => 'Physics Lab Reports', 'subject' => 'Physics', 'days_left' => '10'],
        ];
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
