<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentAcademicController extends Controller
{
    public function audit()
    {
        $user = auth()->user();
        $student = $user->student;

        // Get all registrations with grades and results
        $registrations = $student->registrations()
            ->with(['grade', 'academicYear', 'section'])
            ->orderBy('academic_year_id', 'desc')
            ->get();

        // Get semester and final results for each registration
        $gradeHistory = [];
        foreach ($registrations as $registration) {
            $semesterResults = $student->semesterResults()
                ->where('academic_year_id', $registration->academic_year_id)
                ->where('grade_id', $registration->grade_id)
                ->get();

            $finalResult = $student->finalResults()
                ->where('academic_year_id', $registration->academic_year_id)
                ->where('grade_id', $registration->grade_id)
                ->first();

            $gradeHistory[] = [
                'grade' => $registration->grade,
                'academic_year' => $registration->academicYear,
                'section' => $registration->section,
                'semester_results' => $semesterResults,
                'final_result' => $finalResult,
            ];
        }

        return Inertia::render('Student/Academic/Audit', [
            'student' => $student,
            'gradeHistory' => $gradeHistory,
        ]);
    }

    public function results()
    {
        $user = auth()->user();
        $student = $user->student()->with(['grade', 'section'])->first();
        $academicYear = \App\Models\AcademicYear::where('status', 'active')->first();

        // Get all marks for this student with subject and academic year info
        $marks = \App\Models\Mark::where('student_id', $student->id)
            ->with(['subject', 'academicYear'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Group marks by subject to calculate subject-wise performance
        $subjectPerformance = [];
        $subjects = $marks->groupBy('subject_id');
        
        foreach ($subjects as $subjectId => $subjectMarks) {
            $subject = $subjectMarks->first()->subject;
            $averageScore = $subjectMarks->avg('score_obtained');
            
            // Get detailed assessment breakdown for this subject
            $assessmentBreakdown = $subjectMarks->map(function($mark) {
                return [
                    'assessment_type' => $mark->assessment_type,
                    'semester' => $mark->semester,
                    'score' => $mark->score_obtained,
                    'max_score' => $mark->max_score ?? 100,
                    'date' => $mark->created_at->format('Y-m-d'),
                ];
            });
            
            $subjectPerformance[] = [
                'subject' => $subject,
                'average_score' => round($averageScore, 2),
                'assessments' => $assessmentBreakdown,
            ];
        }
        
        // Calculate trend data (average score per semester)
        $trendData = $marks->groupBy(function($mark) {
            return $mark->academicYear->name . ' - ' . $mark->semester;
        })->map(function($periodMarks, $period) {
            return [
                'period' => $period,
                'average' => round($periodMarks->avg('score_obtained'), 2),
            ];
        })->values();

        return Inertia::render('Student/Academic/Results', [
            'student' => $student,
            'subjectPerformance' => $subjectPerformance,
            'trendData' => $trendData,
            'academicYear' => $academicYear,
        ]);
    }

    public function rankings()
    {
        $user = auth()->user();
        $student = $user->student()->with(['grade', 'section'])->first();
        $academicYear = \App\Models\AcademicYear::where('status', 'active')->first();

        // Get Leaderboard for the student's section
        $sectionStudents = \App\Models\Student::where('section_id', $student->section_id)
            ->with('user')
            ->pluck('id');

        $leaderboard = \App\Models\Mark::whereIn('student_id', $sectionStudents)
            ->where('academic_year_id', $academicYear->id)
            ->selectRaw('student_id, AVG(score_obtained) as avg_score')
            ->groupBy('student_id')
            ->orderByDesc('avg_score')
            ->get()
            ->map(function ($item, $index) use ($sectionStudents) {
                $studentInfo = \App\Models\Student::find($item->student_id);
                return [
                    'rank' => $index + 1,
                    'student_name' => $studentInfo->user->name, // In real app, might want to mask names
                    'average' => round($item->avg_score, 2),
                    'is_current_user' => $item->student_id == auth()->user()->student->id,
                ];
            });

        return Inertia::render('Student/Academic/Rankings', [
            'student' => $student,
            'leaderboard' => $leaderboard,
            'academicYear' => $academicYear,
        ]);
    }

    public function courses()
    {
        $user = auth()->user();
        $student = $user->student;
        $academicYear = \App\Models\AcademicYear::where('status', 'active')->first();

        $courses = \App\Models\Subject::where('grade_id', $student->grade_id)->get()->map(function($subject) use ($student, $academicYear) {
            // Find teacher for this subject in student's section
            $teacherAssignment = \App\Models\TeacherAssignment::where('subject_id', $subject->id)
                ->where('section_id', $student->section_id)
                ->where('academic_year_id', $academicYear->id)
                ->with(['teacher.user'])
                ->first();

            return [
                'id' => $subject->id,
                'name' => $subject->name,
                'code' => $subject->code,
                'teacher' => $teacherAssignment ? $teacherAssignment->teacher->user->name : 'Not Assigned',
                'teacher_email' => $teacherAssignment ? $teacherAssignment->teacher->user->email : null,
            ];
        });

        return Inertia::render('Student/Academic/Courses', [
            'student' => $student,
            'courses' => $courses,
            'academicYear' => $academicYear,
        ]);
    }
}
