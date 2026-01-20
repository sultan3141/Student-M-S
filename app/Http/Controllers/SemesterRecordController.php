<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Mark;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SemesterRecordController extends Controller
{
    /**
     * Display list of all completed semesters for the student
     */
    public function index()
    {
        $user = auth()->user();
        $student = $user->student()->with(['grade', 'section'])->first();
        
        if (!$student) {
            return redirect()->route('student.dashboard')
                ->with('error', 'Student profile not found');
        }

        // Get all semesters where the student has marks
        $semesters = Mark::where('student_id', $student->id)
            ->with('academicYear')
            ->select('semester', 'academic_year_id')
            ->groupBy('semester', 'academic_year_id')
            ->get()
            ->map(function ($mark) use ($student) {
                $semester = $mark->semester;
                $yearId = $mark->academic_year_id;
                
                // Calculate semester average
                $semesterMarks = Mark::where('student_id', $student->id)
                    ->where('semester', $semester)
                    ->where('academic_year_id', $yearId)
                    ->get();
                
                $average = $semesterMarks->avg('marks_obtained');
                
                // Calculate class rank
                $rank = $this->calculateSemesterRank($student, $semester, $yearId);
                
                return [
                    'semester' => $semester,
                    'academic_year_id' => $yearId,
                    'academic_year' => $mark->academicYear,
                    'average' => round($average, 2),
                    'rank' => $rank['rank'],
                    'total_students' => $rank['total'],
                ];
            });

        return Inertia::render('Student/SemesterRecord/Index', [
            'student' => $student,
            'semesters' => $semesters,
        ]);
    }

    /**
     * Display detailed records for a specific semester
     */
    public function show($semester, $academicYearId)
    {
        $user = auth()->user();
        $student = $user->student()->with(['grade', 'section'])->first();
        
        if (!$student) {
            return redirect()->route('student.dashboard')
                ->with('error', 'Student profile not found');
        }

        // Get academic year
        $academicYear = AcademicYear::find($academicYearId);
        
        // Get all marks for this semester
        $marks = Mark::where('student_id', $student->id)
            ->where('semester', $semester)
            ->where('academic_year_id', $academicYearId)
            ->with(['subject', 'assessment.assessmentType'])
            ->get();

        // Group marks by subject and calculate subject averages
        $subjectRecords = $marks->groupBy('subject_id')->map(function ($subjectMarks) {
            $subject = $subjectMarks->first()->subject;
            $average = $subjectMarks->avg('marks_obtained');
            
            return [
                'subject' => $subject,
                'marks' => $subjectMarks,
                'average' => round($average, 2),
                'teacher' => $subject->teacher ?? 'N/A',
            ];
        })->values();

        // Calculate semester average
        $semesterAverage = $marks->avg('marks_obtained');
        
        // Calculate class rank
        $rankInfo = $this->calculateSemesterRank($student, $semester, $academicYearId);

        return Inertia::render('Student/SemesterRecord/Show', [
            'student' => $student,
            'semester' => $semester,
            'academic_year' => $academicYear,
            'subject_records' => $subjectRecords,
            'semester_average' => round($semesterAverage, 2),
            'rank' => $rankInfo['rank'],
            'total_students' => $rankInfo['total'],
        ]);
    }

    /**
     * Calculate class rank for a student in a specific semester
     */
    private function calculateSemesterRank($student, $semester, $academicYearId)
    {
        // Get all students in the same section
        $sectionStudents = Student::where('section_id', $student->section_id)
            ->pluck('id');

        // Calculate semester averages for all students in the section
        $rankings = Mark::whereIn('student_id', $sectionStudents)
            ->where('semester', $semester)
            ->where('academic_year_id', $academicYearId)
            ->select('student_id', DB::raw('AVG(marks_obtained) as avg_score'))
            ->groupBy('student_id')
            ->orderByDesc('avg_score')
            ->get();

        // Find this student's rank
        $rank = $rankings->search(function ($item) use ($student) {
            return $item->student_id == $student->id;
        });

        return [
            'rank' => $rank !== false ? $rank + 1 : null,
            'total' => $rankings->count(),
        ];
    }
}
