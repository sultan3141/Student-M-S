<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use App\Models\Teacher;
use App\Models\SemesterStatus;
use Carbon\Carbon;

class TeacherDashboardController extends Controller
{
    public function index()
    {
        $teacher = Teacher::firstOrCreate(
            ['user_id' => Auth::id()],
            ['employee_id' => 'EMP' . Auth::id(), 'qualification' => 'PhD', 'specialization' => 'General']
        );

        // Get current semester information
        $currentSemester = $this->getCurrentSemesterInfo();

        // Fetch statistics using the new cached method
        $stats = $this->getStatistics($teacher);

        // Fetch recent activities using the new optimized method
        $activities = $this->getRecentActivities($teacher);

        // Fetch upcoming deadlines using the new optimized method
        $upcomingDeadlines = $this->getUpcomingDeadlines($teacher);

        // Get today's schedule for all sections assigned to this teacher
        $today = Carbon::now()->format('l'); // e.g., "Monday"
        $todaySchedule = \App\Models\Schedule::whereIn('section_id', function ($query) use ($teacher) {
            $query->select('section_id')
                ->from('teacher_assignments')
                ->where('teacher_id', $teacher->id);
        })
            ->where('day_of_week', $today)
            ->whereRaw('is_active = true')
            ->with(['section.grade'])
            ->orderBy('start_time')
            ->get()
            ->map(function ($schedule) {
                return [
                    'start_time' => Carbon::parse($schedule->start_time)->format('H:i'),
                    'end_time' => Carbon::parse($schedule->end_time)->format('H:i'),
                    'grade' => $schedule->section->grade->name ?? 'N/A',
                    'section' => $schedule->section->name ?? 'N/A',
                    'activity' => $schedule->activity ?? 'Class',
                    'location' => $schedule->location ?? 'Classroom',
                ];
            });

        return Inertia::render('Teacher/Dashboard', [
            'stats' => $stats,
            'recentActivity' => $activities,
            'deadlines' => $upcomingDeadlines,
            'teacher' => $teacher->load('user'),
            'currentSemester' => $currentSemester,
            'todaySchedule' => $todaySchedule,
            'today' => Carbon::now()->format('l, F j, Y'),
        ]);
    }

    /**
     * Get cached statistics for the teacher.
     */
    private function getStatistics($teacher)
    {
        $currentYear = \App\Models\AcademicYear::whereRaw('is_current = true')->first();
        $yearId = $currentYear ? $currentYear->id : null;

        return Cache::remember("teacher_stats_{$teacher->id}_year_{$yearId}", 300, function () use ($teacher, $yearId) {
            // Count unique students across all assigned sections for the current year
            $totalStudents = \App\Models\Registration::where('academic_year_id', $yearId)
                ->whereIn('section_id', function ($query) use ($teacher) {
                    $query->select('section_id')
                        ->from('teacher_assignments')
                        ->where('teacher_id', $teacher->id);
                })
                ->distinct('student_id')
                ->count('student_id');

            // Total subjects taught in current year
            $totalSubjects = \App\Models\TeacherAssignment::where('teacher_id', $teacher->id)
                ->where('academic_year_id', $yearId)
                ->distinct('subject_id')
                ->count('subject_id');

            // Count pending marks (simplified for now)
            $pendingMarks = 0;

            return [
                'totalStudents' => $totalStudents,
                'totalSubjects' => $totalSubjects,
                'pendingMarks' => $pendingMarks,
                'attendanceRate' => 98.5, // Mock for now
                'activeClasses' => \App\Models\TeacherAssignment::where('teacher_id', $teacher->id)
                    ->where('academic_year_id', $yearId)
                    ->distinct('section_id')
                    ->count('section_id'),
            ];
        });
    }

    /**
     * Get recent activities for the teacher.
     */
    private function getRecentActivities($teacher)
    {
        // Cache briefly to avoid spamming the database on refresh
        return Cache::remember("teacher_recent_activities_{$teacher->id}", 60, function () use ($teacher) {
            return \App\Models\Mark::where('teacher_id', $teacher->id)
                ->select(['id', 'student_id', 'subject_id', 'assessment_type_id', 'created_at'])
                ->with(['student.user:id,name', 'subject:id,name', 'assessmentType:id,name'])
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($mark) {
                    return [
                        'id' => $mark->id,
                        'type' => 'grade_entry',
                        'title' => 'Grade Entered',
                        'description' => "Entered " . ($mark->assessmentType->name ?? 'mark') . " for " . ($mark->student->user->name ?? 'Student'),
                        'time' => $mark->created_at->diffForHumans(),
                        'status' => 'completed'
                    ];
                });
        });
    }

    /**
     * Get upcoming deadlines for the teacher.
     */
    private function getUpcomingDeadlines($teacher)
    {
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
        $academicYear = \App\Models\AcademicYear::whereRaw('is_current = true')->first();

        if (!$academicYear) {
            return null;
        }

        // Cache per academic year to avoid cross-year leaks
        return Cache::remember("current_semester_info_year_{$academicYear->id}", 600, function () use ($academicYear) {
            $semester = $academicYear->getCurrentSemester();

            // precise status for each semester
            $semesters = [];
            foreach ([1, 2] as $semNum) {
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
                $startDate = Carbon::parse($academicYear->start_date);
                $endDate = Carbon::parse($academicYear->end_date);

                $estimatedClose = $semester == 1
                    ? $startDate->copy()->addMonths(6)
                    : $endDate;
                $daysRemaining = max(0, now()->diffInDays($estimatedClose, false));
            }

            return [
                'academic_year' => $academicYear->name,
                'semester' => $displaySemester,
                'status' => $status,
                'is_open' => $semester !== null,
                'can_enter_marks' => $semester !== null,
                'message' => $semester !== null
                    ? 'Semester is active. Mark entry is enabled.'
                    : 'No active semester. Mark entry is disabled.',
                'days_remaining' => $daysRemaining,
                'details' => $semesters,
            ];
        });
    }
    public function schedule(Request $request)
    {
        $teacher = Teacher::firstOrCreate(
            ['user_id' => Auth::id()],
            ['employee_id' => 'EMP' . Auth::id(), 'qualification' => 'PhD', 'specialization' => 'General']
        );

        // Get sections assigned to this teacher
        $sections = \App\Models\Section::whereIn('id', function ($query) use ($teacher) {
            $query->select('section_id')
                ->from('teacher_assignments')
                ->where('teacher_id', $teacher->id);
        })->with('grade')->get();

        $selectedSectionId = $request->section_id;

        // If grade_id is provided but not section_id, pick the first section for that grade
        if (!$selectedSectionId && $request->grade_id) {
            $selectedSectionId = $sections->where('grade_id', $request->grade_id)->first()?->id;
        }

        // Default to first available section if none selected
        $selectedSectionId = $selectedSectionId ?? $sections->first()?->id;

        $schedule = [];
        if ($selectedSectionId) {
            $schedule = \App\Models\Schedule::where('section_id', $selectedSectionId)
<<<<<<< Updated upstream
                ->whereRaw('is_active = true')
=======
                ->where('is_active', true)
>>>>>>> Stashed changes
                ->orderByRaw("CASE day_of_week 
                    WHEN 'Monday' THEN 1 
                    WHEN 'Tuesday' THEN 2 
                    WHEN 'Wednesday' THEN 3 
                    WHEN 'Thursday' THEN 4 
                    WHEN 'Friday' THEN 5 
                    ELSE 6 END")
                ->orderBy('start_time')
                ->get()
                ->groupBy('day_of_week');
        }

        return Inertia::render('Teacher/Schedule', [
            'sections' => $sections,
            'selectedSectionId' => $selectedSectionId,
            'schedule' => $schedule,
        ]);
    }
}
