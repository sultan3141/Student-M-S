<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class DirectorScheduleController extends Controller
{
    /**
     * Display the school schedule.
     */
    public function index()
    {
        $schedule = $this->getSchoolSchedule();
        
        return Inertia::render('Director/Schedule/Index', [
            'schedule' => $schedule,
        ]);
    }

    /**
     * Get the school schedule data.
     */
    private function getSchoolSchedule()
    {
        return [
            'weekDays' => [
                [
                    'day' => 'Monday',
                    'date' => 'Every Monday',
                    'color' => 'from-blue-500 to-blue-600',
                    'activities' => ['Assembly', 'Classes', 'Sports Practice'],
                    'startTime' => '08:00 AM',
                    'endTime' => '03:30 PM',
                ],
                [
                    'day' => 'Tuesday',
                    'date' => 'Every Tuesday',
                    'color' => 'from-purple-500 to-purple-600',
                    'activities' => ['Classes', 'Lab Sessions', 'Club Activities'],
                    'startTime' => '08:00 AM',
                    'endTime' => '03:30 PM',
                ],
                [
                    'day' => 'Wednesday',
                    'date' => 'Every Wednesday',
                    'color' => 'from-pink-500 to-pink-600',
                    'activities' => ['Classes', 'Workshops', 'Counseling'],
                    'startTime' => '08:00 AM',
                    'endTime' => '03:30 PM',
                ],
                [
                    'day' => 'Thursday',
                    'date' => 'Every Thursday',
                    'color' => 'from-green-500 to-green-600',
                    'activities' => ['Classes', 'Competitions', 'Meetings'],
                    'startTime' => '08:00 AM',
                    'endTime' => '03:30 PM',
                ],
                [
                    'day' => 'Friday',
                    'date' => 'Every Friday',
                    'color' => 'from-amber-500 to-amber-600',
                    'activities' => ['Classes', 'Cultural Activities', 'Wrap-up'],
                    'startTime' => '08:00 AM',
                    'endTime' => '03:30 PM',
                ],
            ],
            'timeSlots' => [
                ['time' => '08:00 AM', 'activity' => 'Assembly & Morning Meeting', 'duration' => '30 min', 'location' => 'Main Hall'],
                ['time' => '08:30 AM', 'activity' => 'Period 1', 'duration' => '60 min', 'location' => 'Classrooms'],
                ['time' => '09:30 AM', 'activity' => 'Period 2', 'duration' => '60 min', 'location' => 'Classrooms'],
                ['time' => '10:30 AM', 'activity' => 'Break', 'duration' => '15 min', 'location' => 'Playground'],
                ['time' => '10:45 AM', 'activity' => 'Period 3', 'duration' => '60 min', 'location' => 'Classrooms'],
                ['time' => '11:45 AM', 'activity' => 'Period 4', 'duration' => '60 min', 'location' => 'Classrooms'],
                ['time' => '12:45 PM', 'activity' => 'Lunch Break', 'duration' => '45 min', 'location' => 'Cafeteria'],
                ['time' => '01:30 PM', 'activity' => 'Period 5', 'duration' => '60 min', 'location' => 'Classrooms'],
                ['time' => '02:30 PM', 'activity' => 'Period 6', 'duration' => '60 min', 'location' => 'Classrooms'],
                ['time' => '03:30 PM', 'activity' => 'Dismissal', 'duration' => '30 min', 'location' => 'Main Gate'],
            ],
            'gradeSchedules' => [
                [
                    'grade' => 'Grade 9-10',
                    'startTime' => '08:00 AM',
                    'endTime' => '03:30 PM',
                    'lunchTime' => '12:45 PM - 01:30 PM',
                    'periods' => 6,
                    'specialPrograms' => ['Sports: Mon & Thu', 'Clubs: Tue & Wed', 'Counseling: Wed', 'Cultural: Fri'],
                ],
                [
                    'grade' => 'Grade 11-12',
                    'startTime' => '08:00 AM',
                    'endTime' => '03:30 PM',
                    'lunchTime' => '12:45 PM - 01:30 PM',
                    'periods' => 6,
                    'specialPrograms' => ['Sports: Mon & Thu', 'Clubs: Tue & Wed', 'Counseling: Wed', 'Cultural: Fri'],
                ],
            ],
            'notes' => [
                'School operates Monday to Friday (5-day week)',
                'Saturday and Sunday are holidays',
                'Assembly is mandatory every Monday morning',
                'Special events may alter the regular schedule',
                'Parents are notified of any schedule changes via email',
            ],
        ];
    }

    /**
     * Get schedule for a specific grade.
     */
    public function getGradeSchedule($grade)
    {
        $schedule = $this->getSchoolSchedule();
        
        return response()->json([
            'grade' => $grade,
            'schedule' => $schedule,
        ]);
    }

    /**
     * Get today's schedule.
     */
    public function getTodaySchedule()
    {
        $schedule = $this->getSchoolSchedule();
        $today = now()->format('l'); // Get day name (Monday, Tuesday, etc.)
        
        $todaySchedule = collect($schedule['weekDays'])
            ->firstWhere('day', $today);
        
        return response()->json([
            'today' => $today,
            'schedule' => $todaySchedule,
            'timeSlots' => $schedule['timeSlots'],
        ]);
    }

    /**
     * Export schedule as PDF.
     */
    public function exportPdf()
    {
        $schedule = $this->getSchoolSchedule();
        
        // Generate PDF using DomPDF if available
        if (class_exists('Barryvdh\DomPDF\Facade\Pdf')) {
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('reports.schedule', [
                'schedule' => $schedule,
            ]);
            
            return $pdf->download('School_Schedule_' . now()->format('Y-m-d') . '.pdf');
        }
        
        // Fallback: Return JSON
        return response()->json($schedule);
    }

    /**
     * Export schedule as CSV.
     */
    public function exportCsv()
    {
        $schedule = $this->getSchoolSchedule();
        
        $fileName = 'School_Schedule_' . now()->format('Y-m-d') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => "attachment; filename=\"$fileName\"",
        ];
        
        $callback = function () use ($schedule) {
            $file = fopen('php://output', 'w');
            
            // Write header
            fputcsv($file, ['Time', 'Activity', 'Duration', 'Location']);
            
            // Write time slots
            foreach ($schedule['timeSlots'] as $slot) {
                fputcsv($file, [
                    $slot['time'],
                    $slot['activity'],
                    $slot['duration'],
                    $slot['location'],
                ]);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }
}
