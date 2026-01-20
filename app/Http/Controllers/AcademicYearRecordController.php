<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Mark;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AcademicYearRecordController extends Controller
{
    /**
     * Redirect to the current academic year record
     */
    public function current()
    {
        // Try strict boolean first, then integer 1
        $year = AcademicYear::where('is_current', true)->orWhere('is_current', 1)->first();
        
        // Fallback to the latest academic year if no "current" year is marked
        if (!$year) {
            $year = AcademicYear::orderBy('created_at', 'desc')->first();
        }
        
        if ($year) {
            return redirect()->route('student.academic.year.show', ['academicYear' => $year->id]);
        }
        
        return redirect()->route('student.dashboard')->with('error', 'No active academic year found.');
    }

    /**
     * Display academic year record (both semesters combined)
     */
    public function show($academicYearId)
    {
        $user = auth()->user();
        $student = $user->student()->with(['grade', 'section'])->first();
        
        if (!$student) {
            return redirect()->route('student.dashboard')
                ->with('error', 'Student profile not found');
        }

        // Get academic year
        $academicYear = AcademicYear::findOrFail($academicYearId);
        
        // Get marks for both semesters
        $semester1Marks = Mark::where('student_id', $student->id)
            ->where('semester', '1')
            ->where('academic_year_id', $academicYearId)
            ->get();
            
        $semester2Marks = Mark::where('student_id', $student->id)
            ->where('semester', '2')
            ->where('academic_year_id', $academicYearId)
            ->get();

        // Calculate semester averages
        $semester1Average = $semester1Marks->count() > 0 ? $semester1Marks->avg('marks_obtained') : null;
        $semester2Average = $semester2Marks->count() > 0 ? $semester2Marks->avg('marks_obtained') : null;
        
        // Calculate final year average
        $finalAverage = null;
        if ($semester1Average !== null && $semester2Average !== null) {
            $finalAverage = ($semester1Average + $semester2Average) / 2;
        }

        // Get all subjects taken during the year (from both semesters)
        $allMarks = Mark::where('student_id', $student->id)
            ->where('academic_year_id', $academicYearId)
            ->with(['subject'])
            ->get();
            
        $subjects = $allMarks->groupBy('subject_id')->map(function ($subjectMarks) {
            $subject = $subjectMarks->first()->subject;
            
            return [
                'id' => $subject->id,
                'name' => $subject->name,
                'code' => $subject->code,
                'teacher' => $subject->teacher ?? 'N/A',
            ];
        })->values();

        // Calculate final year rank (only if both semesters completed)
        $finalRank = null;
        $totalStudents = null;
        
        if ($semester1Average !== null && $semester2Average !== null) {
            $rankInfo = $this->calculateYearRank($student, $academicYearId);
            $finalRank = $rankInfo['rank'];
            $totalStudents = $rankInfo['total'];
        }

        return Inertia::render('Student/AcademicYearRecord/Show', [
            'student' => $student,
            'academic_year' => $academicYear,
            'semester1_average' => $semester1Average ? round($semester1Average, 2) : null,
            'semester2_average' => $semester2Average ? round($semester2Average, 2) : null,
            'final_average' => $finalAverage ? round($finalAverage, 2) : null,
            'subjects' => $subjects,
            'final_rank' => $finalRank,
            'total_students' => $totalStudents,
            'is_complete' => $semester1Average !== null && $semester2Average !== null,
        ]);
    }

    /**
     * Calculate final year rank based on combined semester averages
     */
    private function calculateYearRank($student, $academicYearId)
    {
        // Get all students in the same section
        $sectionStudents = Student::where('section_id', $student->section_id)
            ->pluck('id');

        // Calculate year averages for all students
        $rankings = collect();
        
        foreach ($sectionStudents as $studentId) {
            $sem1Avg = Mark::where('student_id', $studentId)
                ->where('semester', '1')
                ->where('academic_year_id', $academicYearId)
                ->avg('marks_obtained');
                
            $sem2Avg = Mark::where('student_id', $studentId)
                ->where('semester', '2')
                ->where('academic_year_id', $academicYearId)
                ->avg('marks_obtained');
            
            // Only include students who completed both semesters
            if ($sem1Avg !== null && $sem2Avg !== null) {
                $yearAvg = ($sem1Avg + $sem2Avg) / 2;
                
                $rankings->push((object)[
                    'student_id' => $studentId,
                    'year_average' => $yearAvg,
                ]);
            }
        }
        
        // Sort by average descending
        $rankings = $rankings->sortByDesc('year_average')->values();
        
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
