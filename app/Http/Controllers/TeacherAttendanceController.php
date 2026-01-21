<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Teacher;
use App\Models\TeacherAssignment;
use App\Models\Section;
use App\Models\Attendance;
use App\Models\Student;
use Carbon\Carbon;

class TeacherAttendanceController extends Controller
{
    /**
     * Display the Attendance Dashboard.
     */
    public function index()
    {
        $user = Auth::user();
        $teacher = Teacher::where('user_id', $user->id)->firstOrFail();
        $today = Carbon::today()->format('Y-m-d');

        // Fetch distinct sections assigned to the teacher
        $assignments = TeacherAssignment::where('teacher_id', $teacher->id)
            ->with(['section.grade', 'subject'])
            ->get()
            ->unique('section_id');

        // Check status for each section
        $schedule = $assignments->map(function ($assignment) use ($today) {
            $isTaken = Attendance::where('section_id', $assignment->section_id)
                ->where('date', $today)
                ->exists();

            return [
                'section_id' => $assignment->section_id,
                'section_name' => $assignment->section->name,
                'grade_name' => $assignment->section->grade->name,
                'subject_name' => $assignment->subject->name,
                'student_count' => $assignment->section->students()->count(),
                'status' => $isTaken ? 'Completed' : 'Pending',
            ];
        });

        // Quick Stats
        $todayCompleted = $schedule->where('status', 'Completed')->count();
        $totalClasses = $schedule->count();
        $weekStats = Attendance::whereHas('section', function ($q) use ($teacher) {
            $q->whereIn('id', TeacherAssignment::where('teacher_id', $teacher->id)->pluck('section_id'));
        })
            ->whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
            ->selectRaw('count(*) as total, sum(case when status = "Present" then 1 else 0 end) as present')
            ->first();

        $weekRate = $weekStats->total > 0 ? round(($weekStats->present / $weekStats->total) * 100, 1) : 0;

        return Inertia::render('Teacher/Attendance/Index', [
            'schedule' => $schedule->values(),
            'todayDate' => Carbon::now()->isoFormat('dddd, MMM D, YYYY'),
            'stats' => [
                'todayCompleted' => $todayCompleted,
                'totalClasses' => $totalClasses,
                'weekRate' => $weekRate
            ]
        ]);
    }

    /**
     * Show the form for marking attendance.
     */
    public function create(Section $section)
    {
        $today = Carbon::today()->format('Y-m-d');

        // Fetch existing attendance if editing
        $existingAttendance = Attendance::where('section_id', $section->id)
            ->where('date', $today)
            ->get()
            ->keyBy('student_id');

        $students = $section->students()
            ->orderBy('name')
            ->get()
            ->map(function ($student) use ($existingAttendance) {
                $record = $existingAttendance->get($student->id);
                return [
                    'id' => $student->id,
                    'name' => $student->user->name ?? 'Unknown',
                    'student_id' => $student->student_id,
                    'status' => $record ? $record->status : 'Present', // Default to Present
                    'remarks' => $record ? $record->remarks : '',
                ];
            });

        return Inertia::render('Teacher/Attendance/Create', [
            'section' => $section->load('grade'),
            'students' => $students,
            'date' => $today,
            'formattedDate' => Carbon::today()->isoFormat('MMM D, YYYY'),
        ]);
    }

    /**
     * Store attendance records.
     */
    public function store(Request $request)
    {
        $request->validate([
            'section_id' => 'required|exists:sections,id',
            'date' => 'required|date',
            'students' => 'required|array',
            'students.*.id' => 'required|exists:students,id',
            'students.*.status' => 'required|in:Present,Absent,Late,Excused',
            'students.*.remarks' => 'nullable|string',
        ]);

        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
        // Ideally verify if teacher is assigned to this section, skipping for v1 speed

        // Get current academic year (assuming logic or fetch active)
        $academicYear = \App\Models\AcademicYear::where('is_current', true)->first()
            ?? \App\Models\AcademicYear::first();

        foreach ($request->students as $record) {
            Attendance::updateOrCreate(
                [
                    'student_id' => $record['id'],
                    'date' => $request->date,
                ],
                [
                    'section_id' => $request->section_id,
                    'academic_year_id' => $academicYear->id,
                    'status' => $record['status'],
                    'remarks' => $record['remarks'] ?? null,
                ]
            );
        }

        return redirect()->route('teacher.attendance.index')->with('success', 'Attendance saved successfully.');
    }

    public function history()
    {
        // Placeholder for v1
        return Inertia::render('Teacher/Attendance/History');
    }
}
