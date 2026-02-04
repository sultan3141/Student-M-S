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
        // Get current academic year
        $year = \DB::table('academic_years')
            ->where('is_current', true)
            ->orWhere('status', 'active')
            ->orderBy('created_at', 'desc')
            ->first();
        
        if ($year) {
            return redirect()->route('student.academic.year.show', ['academicYear' => $year->id]);
        }
        
        return redirect()->route('student.dashboard')->with('error', 'No active academic year found.');
    }

    public function show($academicYearId)
    {
        $user = auth()->user();
        $student = $user->student()->with(['grade', 'section'])->first();
        
        if (!$student) {
            return redirect()->route('student.dashboard')->with('error', 'Student profile not found');
        }

        $academicYear = \App\Models\AcademicYear::findOrFail($academicYearId);
        
        // Get all subjects for this grade/stream
        $subjectsQuery = \App\Models\Subject::where('grade_id', $student->grade_id);
        if ($student->stream_id) {
            $subjectsQuery->where(function($q) use ($student) {
                $q->where('stream_id', $student->stream_id)
                  ->orWhereNull('stream_id');
            });
        }
        $assignedSubjects = $subjectsQuery->get();

        // Get marks only for PUBLISHED assessments
        $marks = \App\Models\Mark::where('student_id', $student->id)
            ->where('academic_year_id', $academicYearId)
            ->whereHas('assessment') // Check status removed for immediate visibility
            ->get();

        // Calculate semester averages based on SUBJECT TOTALS (SUM), not mark averages
        $semester1Totals = $marks->where('semester', '1')->groupBy('subject_id')->map(fn($m) => $m->sum('score'));
        $semester2Totals = $marks->where('semester', '2')->groupBy('subject_id')->map(fn($m) => $m->sum('score'));
        
        $semester1Average = $semester1Totals->isNotEmpty() ? round($semester1Totals->avg(), 2) : 0;
        $semester2Average = $semester2Totals->isNotEmpty() ? round($semester2Totals->avg(), 2) : 0;
        
        $finalAverage = 0;
        if ($semester1Average > 0 && $semester2Average > 0) {
            $finalAverage = round(($semester1Average + $semester2Average) / 2, 2);
        } elseif ($semester1Average > 0) {
            $finalAverage = $semester1Average;
        } elseif ($semester2Average > 0) {
            $finalAverage = $semester2Average;
        }

        // Map subjects for display
        $subjectPerformance = $assignedSubjects->map(function ($subject) use ($marks) {
            $subjectMarks = $marks->where('subject_id', $subject->id);
            $sem1Total = $subjectMarks->where('semester', '1')->isNotEmpty() 
                ? $subjectMarks->where('semester', '1')->sum('score') 
                : null;
            $sem2Total = $subjectMarks->where('semester', '2')->isNotEmpty() 
                ? $subjectMarks->where('semester', '2')->sum('score') 
                : null;
            
            $finalAvg = null;
            if ($sem1Total !== null && $sem2Total !== null) {
                $finalAvg = round(($sem1Total + $sem2Total) / 2, 2);
            } elseif ($sem1Total !== null) {
                $finalAvg = $sem1Total;
            } elseif ($sem2Total !== null) {
                $finalAvg = $sem2Total;
            }

            return [
                'id' => $subject->id,
                'name' => $subject->name,
                'code' => $subject->code,
                'credit_hours' => $subject->credit_hours ?? 3,
                'semester1_average' => $sem1Total, // Changed to total sum
                'semester2_average' => $sem2Total, // Changed to total sum
                'final_average' => $finalAvg,
            ];
        });

        $rankData = $this->calculateYearRank($student, $academicYearId);

        return Inertia::render('Student/AcademicYearRecord/Show', [
            'student' => $student,
            'academic_year' => $academicYear,
            'semester1_average' => $semester1Average,
            'semester2_average' => $semester2Average,
            'final_average' => $finalAverage,
            'subjects' => $subjectPerformance,
            'final_rank' => $rankData['rank'] ?? '-',
            'total_students' => $rankData['total'] ?? 0,
            'is_complete' => $semester1Average > 0 && $semester2Average > 0,
        ]);
    }

    /**
     * Calculate final year rank based on combined semester averages - with caching
     */
    private function calculateYearRankFast($studentId, $sectionId, $academicYearId)
    {
        $cacheKey = "year_rank_{$sectionId}_{$academicYearId}";
        
        return cache()->remember($cacheKey, 300, function () use ($studentId, $sectionId, $academicYearId) {
            // Get all students in the same section
            $sectionStudents = Student::where('section_id', $sectionId)
                ->pluck('id');

            // Fetch all marks for section to calculate ranks based on SUMs
            $sectionMarks = Mark::whereIn('student_id', $sectionStudents)
                ->where('academic_year_id', $academicYearId)
                ->whereHas('assessment') // Check status removed
                ->get();

            $rankings = $sectionMarks->groupBy('student_id')->map(function ($studentMarks) {
                $sem1Totals = $studentMarks->where('semester', '1')->groupBy('subject_id')->map(fn($m) => $m->sum('score'));
                $sem2Totals = $studentMarks->where('semester', '2')->groupBy('subject_id')->map(fn($m) => $m->sum('score'));
                
                $sem1Avg = $sem1Totals->isNotEmpty() ? $sem1Totals->avg() : 0;
                $sem2Avg = $sem2Totals->isNotEmpty() ? $sem2Totals->avg() : 0;
                
                if ($sem1Avg > 0 && $sem2Avg > 0) {
                    return ($sem1Avg + $sem2Avg) / 2;
                }
                return max($sem1Avg, $sem2Avg);
            })
            ->sortDesc();
            
            // Find this student's rank
            $rank = $rankings->keys()->search($studentId);

            return [
                'rank' => $rank !== false ? $rank + 1 : null,
                'total' => $rankings->count(),
            ];
        });
    }
    
    /**
     * Calculate final year rank based on combined semester averages
     */
    private function calculateYearRank($student, $academicYearId)
    {
        return $this->calculateYearRankFast($student->id, $student->section_id, $academicYearId);
    }
}
