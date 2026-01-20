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
            ->whereRaw('is_current = TRUE')
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
        $student = $user->student()->select('id', 'student_id', 'grade_id', 'section_id')->first();
        
        if (!$student) {
            return redirect()->route('student.dashboard')->with('error', 'Student profile not found');
        }

        // Get academic year
        $academicYear = cache()->remember("academic_year_{$academicYearId}", 3600, function() use ($academicYearId) {
            return \DB::table('academic_years')->where('id', $academicYearId)->select('id', 'name')->first();
        });
        
        // Get semester averages in one query
        $semesterAverages = \DB::table('marks')
            ->where('student_id', $student->id)
            ->where('academic_year_id', $academicYearId)
            ->select('semester', \DB::raw('ROUND(AVG(score), 2) as avg_score'))
            ->groupBy('semester')
            ->get()
            ->keyBy('semester');
        
        $semester1Average = $semesterAverages->get('1')?->avg_score;
        $semester2Average = $semesterAverages->get('2')?->avg_score;
        
        $finalAverage = null;
        if ($semester1Average && $semester2Average) {
            $finalAverage = round(($semester1Average + $semester2Average) / 2, 2);
        }

        // Get detailed subject performance
        $subjects = \DB::table('marks')
            ->join('subjects', 'marks.subject_id', '=', 'subjects.id')
            ->where('marks.student_id', $student->id)
            ->where('marks.academic_year_id', $academicYearId)
            ->select(
                'subjects.id', 
                'subjects.name', 
                'subjects.code',
                'subjects.credit_hours',
                'marks.semester',
                'marks.score'
            )
            ->get()
            ->groupBy('id')
            ->map(function ($marks) {
                $subject = $marks->first();
                $sem1Marks = $marks->where('semester', '1')->pluck('score');
                $sem2Marks = $marks->where('semester', '2')->pluck('score');
                
                $sem1Avg = $sem1Marks->isEmpty() ? null : round($sem1Marks->avg(), 2);
                $sem2Avg = $sem2Marks->isEmpty() ? null : round($sem2Marks->avg(), 2);
                
                $finalAvg = null;
                if ($sem1Avg !== null && $sem2Avg !== null) {
                    $finalAvg = round(($sem1Avg + $sem2Avg) / 2, 2);
                } elseif ($sem1Avg !== null) {
                    $finalAvg = $sem1Avg;
                } elseif ($sem2Avg !== null) {
                    $finalAvg = $sem2Avg;
                }

                return [
                    'id' => $subject->id,
                    'name' => $subject->name,
                    'code' => $subject->code,
                    'credit_hours' => $subject->credit_hours ?? 3,
                    'semester1_average' => $sem1Avg,
                    'semester2_average' => $sem2Avg,
                    'final_average' => $finalAvg,
                ];
            })->values();

        // Get rank
        $finalRank = \DB::table('final_results')
            ->where('student_id', $student->id)
            ->where('academic_year_id', $academicYearId)
            ->value('final_rank') ?? 'N/A';
        
        $totalStudents = cache()->remember("section_{$student->section_id}_count", 3600, function() use ($student) {
            return \DB::table('students')->where('section_id', $student->section_id)->count();
        });

        // Get student info
        $studentInfo = \DB::table('students')
            ->join('grades', 'students.grade_id', '=', 'grades.id')
            ->join('sections', 'students.section_id', '=', 'sections.id')
            ->where('students.id', $student->id)
            ->select('students.id', 'students.student_id', 'grades.name as grade_name', 'sections.name as section_name')
            ->first();

        return Inertia::render('Student/AcademicYearRecord/Show', [
            'student' => [
                'id' => $student->id,
                'student_id' => $student->student_id,
                'grade' => ['name' => $studentInfo->grade_name],
                'section' => ['name' => $studentInfo->section_name],
            ],
            'academic_year' => $academicYear,
            'semester1_average' => $semester1Average,
            'semester2_average' => $semester2Average,
            'final_average' => $finalAverage,
            'subjects' => $subjects,
            'final_rank' => $finalRank,
            'total_students' => $totalStudents,
            'is_complete' => $semester1Average && $semester2Average,
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

            // Calculate year averages for all students in one query
            $rankings = Mark::whereIn('student_id', $sectionStudents)
                ->where('academic_year_id', $academicYearId)
                ->select('student_id', 'semester', DB::raw('AVG(score) as avg_score'))
                ->groupBy('student_id', 'semester')
                ->get()
                ->groupBy('student_id')
                ->map(function ($studentMarks) {
                    $sem1 = $studentMarks->where('semester', '1')->first();
                    $sem2 = $studentMarks->where('semester', '2')->first();
                    
                    if ($sem1 && $sem2) {
                        return ($sem1->avg_score + $sem2->avg_score) / 2;
                    }
                    return null;
                })
                ->filter()
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
