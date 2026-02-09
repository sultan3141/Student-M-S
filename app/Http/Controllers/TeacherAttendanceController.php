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
use App\Models\Grade;
use App\Models\Subject;
use App\Models\AcademicYear;
use Carbon\Carbon;

class TeacherAttendanceController extends Controller
{
    /**
     * Get grades that teacher teaches.
     */
    public function getGrades()
    {
        $teacher = Auth::user()->teacher;

        // Get unique grades from teacher assignments
        $grades = Grade::whereIn('id', function ($query) use ($teacher) {
            $query->select('grade_id')
                ->from('sections')
                ->whereIn('id', TeacherAssignment::where('teacher_id', $teacher->id)
                    ->pluck('section_id'));
        })->orderBy('name')->get();

        return response()->json($grades);
    }

    /**
     * Get sections for a specific grade that teacher teaches.
     */
    public function getSections(Request $request)
    {
        $teacher = Auth::user()->teacher;
        $gradeId = $request->grade_id;

        // Get sections for this grade that teacher teaches
        $sections = Section::where('grade_id', $gradeId)
            ->whereIn('id', TeacherAssignment::where('teacher_id', $teacher->id)
                ->pluck('section_id'))
            ->orderBy('name')
            ->get();

        return response()->json($sections);
    }

    /**
     * Get subjects teacher teaches for a specific section.
     */
    public function getSubjects(Request $request)
    {
        $teacher = Auth::user()->teacher;
        $sectionId = $request->section_id;

        // Get subjects teacher teaches for this section
        $subjects = Subject::whereIn('id', TeacherAssignment::where('teacher_id', $teacher->id)
            ->where('section_id', $sectionId)
            ->pluck('subject_id'))
            ->orderBy('name')
            ->get();

        return response()->json($subjects);
    }

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
            if (!$assignment->section || !$assignment->subject) {
                return null;
            }

            $isTaken = Attendance::where('section_id', $assignment->section_id)
                ->where('date', $today)
                ->exists();

            return [
                'section_id' => $assignment->section_id,
                'section_name' => $assignment->section->name ?? 'Unknown Section',
                'grade_name' => $assignment->section->grade->name ?? 'Unknown Grade',
                'subject_name' => $assignment->subject->name ?? 'Unknown Subject',
                'student_count' => $assignment->section->students()->count() ?? 0,
                'status' => $isTaken ? 'Completed' : 'Pending',
            ];
        })->filter()->values();

        // Quick Stats
        $todayCompleted = $schedule->where('status', 'Completed')->count();
        $totalClasses = $schedule->count();
        $weekStats = Attendance::whereHas('section', function ($q) use ($teacher) {
            $q->whereIn('id', TeacherAssignment::where('teacher_id', $teacher->id)->pluck('section_id'));
        })
            ->whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
            ->selectRaw("count(*) as total, sum(case when status = 'Present' then 1 else 0 end) as present")
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
    public function create(Request $request)
    {
        $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'section_id' => 'required|exists:sections,id',
            'subject_id' => 'required|exists:subjects,id',
        ]);

        $today = Carbon::today()->format('Y-m-d');
        $section = Section::findOrFail($request->section_id);
        $subject = Subject::findOrFail($request->subject_id);
        $grade = Grade::findOrFail($request->grade_id);

        // Check if attendance already exists and is locked
        $existingLocked = Attendance::where('section_id', $section->id)
            ->where('subject_id', $subject->id)
            ->where('date', $today)
            ->whereRaw('is_locked = true')
            ->exists();

        if ($existingLocked) {
            return redirect()->route('teacher.attendance.index')
                ->with('error', 'Attendance for this subject has already been submitted and cannot be edited.');
        }

        // Get existing attendance (if any, unlocked)
        $existingAttendance = Attendance::where('section_id', $section->id)
            ->where('subject_id', $subject->id)
            ->where('date', $today)
            ->whereRaw('is_locked = false')
            ->get()
            ->keyBy('student_id');

        $students = $section->students()
            ->with('user')
            ->join('users', 'students.user_id', '=', 'users.id')
            ->orderBy('users.name')
            ->select('students.*')
            ->get()
            ->map(function ($student) use ($existingAttendance) {
                $record = $existingAttendance->get($student->id);
                return [
                    'id' => $student->id,
                    'name' => $student->user->name ?? 'Unknown',
                    'student_id' => $student->student_id,
                    'status' => $record ? $record->status : 'Present',
                    'remarks' => $record ? $record->remarks : '',
                ];
            });

        return Inertia::render('Teacher/Attendance/Create', [
            'section' => $section,
            'subject' => $subject,
            'grade' => $grade,
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
            'subject_id' => 'required|exists:subjects,id',
            'date' => 'required|date',
            'students' => 'required|array',
            'students.*.id' => 'required|exists:students,id',
            'students.*.status' => 'required|in:Present,Absent,Late,Excused',
            'students.*.remarks' => 'nullable|string',
        ]);

        $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();

        // Get current academic year
        $academicYear = AcademicYear::whereRaw('is_current = true')->first();

        if (!$academicYear) {
            return redirect()->back()->with('error', 'No active academic year found.');
        }

        // Check if already locked
        $existingLocked = Attendance::where('section_id', $request->section_id)
            ->where('subject_id', $request->subject_id)
            ->where('date', $request->date)
            ->whereRaw('is_locked = true')
            ->exists();

        if ($existingLocked) {
            return redirect()->back()->with('error', 'Attendance has already been submitted and cannot be modified.');
        }

        // Delete existing unlocked attendance for this section/subject/date
        Attendance::where('section_id', $request->section_id)
            ->where('subject_id', $request->subject_id)
            ->where('date', $request->date)
            ->whereRaw('is_locked = false')
            ->delete();

        // Create new attendance records (locked)
        foreach ($request->students as $record) {
            Attendance::create([
                'student_id' => $record['id'],
                'section_id' => $request->section_id,
                'subject_id' => $request->subject_id,
                'academic_year_id' => $academicYear->id,
                'date' => $request->date,
                'status' => $record['status'],
                'remarks' => $record['remarks'] ?? null,
                'is_locked' => true, // Lock after saving
            ]);
        }

        return redirect()->route('teacher.attendance.index')
            ->with('success', 'Attendance recorded successfully and locked.');
    }

    public function history(Request $request)
    {
        $user = Auth::user();
        $teacher = Teacher::where('user_id', $user->id)->firstOrFail();
        $today = Carbon::today()->format('Y-m-d');

        // Get filter parameters
        $dateFrom = $request->input('date_from', Carbon::now()->subDays(30)->format('Y-m-d'));
        $dateTo = $request->input('date_to', Carbon::yesterday()->format('Y-m-d'));
        $gradeFilter = $request->input('grade_id');
        $sectionFilter = $request->input('section_id');
        $subjectFilter = $request->input('subject_id');

        // Get sections teacher teaches
        $teacherSectionIds = TeacherAssignment::where('teacher_id', $teacher->id)
            ->pluck('section_id')
            ->unique();

        // Build query for past attendance records
        $query = Attendance::with(['student.user', 'section.grade', 'subject'])
            ->whereIn('section_id', $teacherSectionIds)
            ->where('date', '<', $today)
            ->whereBetween('date', [$dateFrom, $dateTo])
            ->whereRaw('is_locked = true');

        // Apply filters
        if ($gradeFilter) {
            $query->whereHas('section', function ($q) use ($gradeFilter) {
                $q->where('grade_id', $gradeFilter);
            });
        }

        if ($sectionFilter) {
            $query->where('section_id', $sectionFilter);
        }

        if ($subjectFilter) {
            $query->where('subject_id', $subjectFilter);
        }

        // Get attendance records grouped by date, section, and subject
        $attendanceRecords = $query->orderBy('date', 'desc')
            ->get()
            ->groupBy(function ($item) {
                return $item->date->format('Y-m-d') . '_' . $item->section_id . '_' . $item->subject_id;
            })
            ->map(function ($group) {
                $first = $group->first();
                $totalStudents = $group->count();
                $presentCount = $group->where('status', 'Present')->count();
                $absentCount = $group->where('status', 'Absent')->count();
                $lateCount = $group->where('status', 'Late')->count();
                $excusedCount = $group->where('status', 'Excused')->count();

                return [
                    'date' => $first->date->format('Y-m-d'),
                    'formatted_date' => $first->date->isoFormat('MMM D, YYYY'),
                    'section_id' => $first->section_id,
                    'section_name' => $first->section->name,
                    'grade_name' => $first->section->grade->name,
                    'subject_id' => $first->subject_id,
                    'subject_name' => $first->subject->name,
                    'total_students' => $totalStudents,
                    'present' => $presentCount,
                    'absent' => $absentCount,
                    'late' => $lateCount,
                    'excused' => $excusedCount,
                    'attendance_rate' => $totalStudents > 0 ? round(($presentCount / $totalStudents) * 100, 1) : 0,
                    'students' => $group->map(function ($record) {
                        return [
                            'name' => $record->student->user->name ?? 'Unknown',
                            'student_id' => $record->student->student_id,
                            'status' => $record->status,
                            'remarks' => $record->remarks,
                        ];
                    })->values()
                ];
            })
            ->values();

        // Get filter options
        $grades = Grade::whereIn('id', function ($query) use ($teacher) {
            $query->select('grade_id')
                ->from('sections')
                ->whereIn('id', TeacherAssignment::where('teacher_id', $teacher->id)
                    ->pluck('section_id'));
        })->orderBy('name')->get();

        $sections = Section::whereIn('id', $teacherSectionIds)
            ->with('grade')
            ->orderBy('name')
            ->get();

        $subjects = Subject::whereIn('id', TeacherAssignment::where('teacher_id', $teacher->id)
            ->pluck('subject_id'))
            ->orderBy('name')
            ->get();

        // Calculate summary stats
        $totalRecords = $attendanceRecords->count();
        $avgAttendanceRate = $attendanceRecords->avg('attendance_rate') ?? 0;

        return Inertia::render('Teacher/Attendance/History', [
            'records' => $attendanceRecords,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'grade_id' => $gradeFilter,
                'section_id' => $sectionFilter,
                'subject_id' => $subjectFilter,
            ],
            'filterOptions' => [
                'grades' => $grades,
                'sections' => $sections,
                'subjects' => $subjects,
            ],
            'stats' => [
                'total_records' => $totalRecords,
                'avg_attendance_rate' => round($avgAttendanceRate, 1),
            ]
        ]);
    }
}
