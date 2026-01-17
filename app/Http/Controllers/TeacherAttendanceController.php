<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TeacherAttendanceController extends Controller
{
    public function index()
    {
        // Similar to marks, select section first
        $sections = \App\Models\Section::with('grade')->get();
        return inertia('Teacher/Attendance/Index', [
            'sections' => $sections,
        ]);
    }

    public function create(Request $request)
    {
        $section = \App\Models\Section::with('grade')->findOrFail($request->section_id);
        $date = $request->date ?? now()->format('Y-m-d');

        // Fetch students and any existing attendance for this date
        $students = \App\Models\Student::where('section_id', $section->id)
            ->with(['user', 'attendances' => function($query) use ($date) {
                $query->where('date', $date);
            }])
            ->orderBy('student_id')
            ->get();

        return inertia('Teacher/Attendance/Create', [
            'section' => $section,
            'date' => $date,
            'students' => $students,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'section_id' => 'required',
            'date' => 'required|date',
            'attendances' => 'required|array', // [student_id => status]
            'attendances.*' => 'required|in:Present,Absent,Late,Excused',
        ]);

        $academicYear = \App\Models\AcademicYear::where('status', 'active')->first();

        foreach ($validated['attendances'] as $studentId => $status) {
            \App\Models\Attendance::updateOrCreate(
                [
                    'student_id' => $studentId, 
                    'date' => $validated['date'],
                ],
                [
                    'section_id' => $validated['section_id'],
                    'academic_year_id' => $academicYear->id,
                    'status' => $status,
                ]
            );
        }

        return redirect()->route('teacher.attendance.index')->with('success', 'Attendance recorded successfully.');
    }
}
