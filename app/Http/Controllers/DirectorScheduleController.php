<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class DirectorScheduleController extends Controller
{
    /**
     * Display the school schedule.
     */
    /**
     * Display the school schedule.
     */
    public function index()
    {
        $grades = \App\Models\Grade::with(['sections'])->get();

        return Inertia::render('Director/Schedule/Index', [
            'grades' => $grades,
        ]);
    }

    /**
     * Get the school schedule data.
     */
    private function getSchoolSchedule()
    {
        // This method was returning hardcoded data. 
        // We will likely deprecate this or update it to fetch from DB if needed for exports.
        // For dynamic scheduling, we'll use API endpoints.
        return [];
    }

    /**
     * Store a new schedule.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'section_id' => 'required|exists:sections,id',
            'day_of_week' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'activity' => 'required|string|max:255',
        ]);

        // Get current academic year - using status = 'active'
        $academicYear = \App\Models\AcademicYear::where('status', 'active')->first();

        if (!$academicYear) {
            return back()->with('error', 'No active academic year found.');
        }

        \App\Models\Schedule::create([
            'academic_year_id' => $academicYear->id,
            'name' => 'Regular Schedule', // Default name
            'grade_id' => $validated['grade_id'],
            'section_id' => $validated['section_id'],
            'day_of_week' => $validated['day_of_week'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'activity' => $validated['activity'],
        ]);

        return back()->with('success', 'Schedule created successfully.');
    }

    /**
     * Store multiple schedules at once (bulk create for a period).
     */
    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'schedules' => 'required|array|min:1',
            'schedules.*.grade_id' => 'required|exists:grades,id',
            'schedules.*.section_id' => 'required|exists:sections,id',
            'schedules.*.day_of_week' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday',
            'schedules.*.start_time' => 'required|date_format:H:i',
            'schedules.*.end_time' => 'required|date_format:H:i',
            'schedules.*.activity' => 'required|string|max:255',
        ]);

        // Get current academic year - using status = 'active'
        $academicYear = \App\Models\AcademicYear::where('status', 'active')->first();

        if (!$academicYear) {
            return response()->json(['error' => 'No active academic year found.'], 400);
        }

        $created = [];
        foreach ($validated['schedules'] as $scheduleData) {
            $created[] = \App\Models\Schedule::create([
                'academic_year_id' => $academicYear->id,
                'name' => 'Regular Schedule',
                'grade_id' => $scheduleData['grade_id'],
                'section_id' => $scheduleData['section_id'],
                'day_of_week' => $scheduleData['day_of_week'],
                'start_time' => $scheduleData['start_time'],
                'end_time' => $scheduleData['end_time'],
                'activity' => $scheduleData['activity'],
                'is_active' => true,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => count($created) . ' schedule entries created successfully.',
            'schedules' => $created
        ]);
    }

    /**
     * Update the specified schedule.
     */
    public function update(Request $request, $id)
    {
        $schedule = \App\Models\Schedule::findOrFail($id);

        $validated = $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'section_id' => 'required|exists:sections,id',
            'day_of_week' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'activity' => 'required|string|max:255',
        ]);

        $schedule->update([
            'grade_id' => $validated['grade_id'],
            'section_id' => $validated['section_id'],
            'day_of_week' => $validated['day_of_week'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'activity' => $validated['activity'],
        ]);

        return back()->with('success', 'Schedule updated successfully.');
    }

    /**
     * Remove the specified schedule.
     */
    public function destroy($id)
    {
        $schedule = \App\Models\Schedule::findOrFail($id);
        $schedule->delete();

        return back()->with('success', 'Schedule deleted successfully.');
    }

    /**
     * Get schedule for a specific section (for students/parents/teachers to view).
     */
    public function getSectionSchedule($sectionId)
    {
        $schedules = \App\Models\Schedule::where('section_id', $sectionId)
            ->whereBoolTrue('is_active')
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get()
            ->groupBy('day_of_week');

        return response()->json($schedules);
    }

    /**
     * View schedule page for students/parents/teachers.
     */
    public function viewSchedule($sectionId)
    {
        $section = \App\Models\Section::with('grade')->findOrFail($sectionId);

        $schedules = \App\Models\Schedule::where('section_id', $sectionId)
            ->whereBoolTrue('is_active')
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

        return Inertia::render('Schedule/View', [
            'section' => $section,
            'schedules' => $schedules,
        ]);
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
    /**
     * Export schedule as PDF.
     */
    public function exportPdf(Request $request)
    {
        $query = \App\Models\Schedule::with(['grade', 'section'])
            ->whereBoolTrue('is_active')
            ->orderByRaw("CASE 
                WHEN day_of_week = 'Monday' THEN 1 
                WHEN day_of_week = 'Tuesday' THEN 2 
                WHEN day_of_week = 'Wednesday' THEN 3 
                WHEN day_of_week = 'Thursday' THEN 4 
                WHEN day_of_week = 'Friday' THEN 5 
                ELSE 6 END")
            ->orderBy('start_time');

        $viewData = [];

        if ($request->has('section_id') && $request->section_id) {
            $query->where('section_id', $request->section_id);
            $viewData['section'] = \App\Models\Section::find($request->section_id);
            $viewData['grade'] = $viewData['section'] ? $viewData['section']->grade : null;
        } elseif ($request->has('grade_id') && $request->grade_id) {
            $query->where('grade_id', $request->grade_id);
            $viewData['grade'] = \App\Models\Grade::find($request->grade_id);
        }

        $schedules = $query->get();

        // Process schedules into a grid format
        $timetable = [];
        $timeSlots = $schedules->map(function ($item) {
            return [
                'start' => \Carbon\Carbon::parse($item->start_time)->format('H:i'),
                'end' => \Carbon\Carbon::parse($item->end_time)->format('H:i'),
            ];
        })->unique(function ($item) {
            return $item['start'] . '-' . $item['end'];
        })->sortBy('start');

        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        foreach ($timeSlots as $slot) {
            $slotKey = $slot['start'] . ' - ' . $slot['end'];
            $timetable[$slotKey] = array_fill_keys($days, '');

            foreach ($schedules as $item) {
                $itemStart = \Carbon\Carbon::parse($item->start_time)->format('H:i');
                $itemEnd = \Carbon\Carbon::parse($item->end_time)->format('H:i');

                if ($itemStart === $slot['start'] && $itemEnd === $slot['end']) {
                    if (in_array($item->day_of_week, $days)) {
                        $timetable[$slotKey][$item->day_of_week] = $item->activity;
                    }
                }
            }
        }

        $viewData['timetable'] = $timetable;
        $viewData['days'] = $days;
        $viewData['schedules'] = $schedules;

        // Generate PDF using DomPDF
        try {
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('reports.schedule', $viewData);
            return $pdf->download('School_Schedule_' . now()->format('Y-m-d') . '.pdf');
        } catch (\Exception $e) {
            \Log::error('PDF Export Error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to generate PDF: ' . $e->getMessage()], 500);
        }

        // Fallback: Return JSON
        return response()->json($schedules);
    }

    /**
     * Export schedule as CSV.
     */
    public function exportCsv(Request $request)
    {
        $query = \App\Models\Schedule::with(['grade', 'section'])
            ->whereBoolTrue('is_active')
            ->orderByRaw("CASE 
                WHEN day_of_week = 'Monday' THEN 1 
                WHEN day_of_week = 'Tuesday' THEN 2 
                WHEN day_of_week = 'Wednesday' THEN 3 
                WHEN day_of_week = 'Thursday' THEN 4 
                WHEN day_of_week = 'Friday' THEN 5 
                ELSE 6 END")
            ->orderBy('start_time');

        if ($request->has('section_id') && $request->section_id) {
            $query->where('section_id', $request->section_id);
        } elseif ($request->has('grade_id') && $request->grade_id) {
            $query->where('grade_id', $request->grade_id);
        }

        $schedules = $query->get();

        $fileName = 'School_Schedule_' . now()->format('Y-m-d') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => "attachment; filename=\"$fileName\"",
        ];

        $callback = function () use ($schedules) {
            $file = fopen('php://output', 'w');

            // Write header
            fputcsv($file, ['Day', 'Start Time', 'End Time', 'Activity', 'Grade', 'Section']);

            // Write time slots
            foreach ($schedules as $item) {
                fputcsv($file, [
                    $item->day_of_week,
                    \Carbon\Carbon::parse($item->start_time)->format('H:i'),
                    \Carbon\Carbon::parse($item->end_time)->format('H:i'),
                    $item->activity,
                    $item->grade ? $item->grade->name : '',
                    $item->section ? $item->section->name : '',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
    /**
     * Get school schedule overview.
     */
    public function getOverview()
    {
        $totalClasses = \App\Models\Schedule::whereBoolTrue('is_active')->count();
        $activeSections = \App\Models\Schedule::whereBoolTrue('is_active')->distinct('section_id')->count('section_id');

        $classesPerDay = \App\Models\Schedule::whereBoolTrue('is_active')
            ->selectRaw('day_of_week, count(*) as count')
            ->groupBy('day_of_week')
            ->pluck('count', 'day_of_week');

        $earliestStart = \App\Models\Schedule::whereBoolTrue('is_active')->min('start_time');
        $latestEnd = \App\Models\Schedule::whereBoolTrue('is_active')->max('end_time');

        // Today's schedule preview
        $today = now()->format('l');
        $todaySchedule = \App\Models\Schedule::whereBoolTrue('is_active')
            ->where('day_of_week', $today)
            ->with(['grade:id,name', 'section:id,name'])
            ->orderBy('start_time')
            ->take(10)
            ->get();

        return response()->json([
            'total_classes' => $totalClasses,
            'active_sections' => $activeSections,
            'classes_per_day' => $classesPerDay,
            'earliest_start' => $earliestStart ? \Carbon\Carbon::parse($earliestStart)->format('g:i A') : 'N/A',
            'latest_end' => $latestEnd ? \Carbon\Carbon::parse($latestEnd)->format('g:i A') : 'N/A',
            'today' => $today,
            'today_schedule' => $todaySchedule
        ]);
    }
}
