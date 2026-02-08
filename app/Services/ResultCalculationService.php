<?php

namespace App\Services;

use App\Models\AcademicYear;
use App\Models\Grade;
use App\Models\Mark;
use App\Models\Student;
use App\Models\SemesterResult;
use App\Models\FinalResult;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ResultCalculationService
{
    /**
     * Calculate and persist results for a specific semester
     */
    /**
     * Calculate and persist results for a specific semester
     */
    public function calculateSemesterResults($academicYearId, $semester)
    {
        Log::info("Starting Semester Result Calculation: Year {$academicYearId}, Semester {$semester}");
        
        // Iterate through ALL Sections (instead of Grades) to calculate Section-based Ranks
        $sections = \App\Models\Section::all();

        foreach ($sections as $section) {
            // Get all students in this section
            $students = Student::where('section_id', $section->id)->get();

            foreach ($students as $student) {
                $this->calculateStudentSemesterResult($student, $academicYearId, $semester);
            }
            
            // After calculating averages, calculate Ranks for the SECTION
            $this->calculateSemesterRanks($section->id, $academicYearId, $semester);
        }
        
        Log::info("Completed Semester Result Calculation");
    }

    /**
     * Calculate and persist Final (Yearly) results
     */
    public function calculateFinalResults($academicYearId)
    {
        Log::info("Starting Final Result Calculation: Year {$academicYearId}");

        $sections = \App\Models\Section::all();

        foreach ($sections as $section) {
            $students = Student::where('section_id', $section->id)->get();

            foreach ($students as $student) {
                $this->calculateStudentFinalResult($student, $academicYearId);
            }
            
            // Calculate Final Ranks for the SECTION
            $this->calculateFinalRanks($section->id, $academicYearId);
        }

        Log::info("Completed Final Result Calculation");
    }

    private function calculateStudentSemesterResult($student, $academicYearId, $semester)
    {
        $marks = Mark::where('student_id', $student->id)
            ->where('academic_year_id', $academicYearId)
            ->where('semester', $semester)
            ->with('assessment')
            ->get();

        // Calculate average
        $average = 0;

        if ($marks->isNotEmpty()) {
            $subjectScores = $marks->groupBy('subject_id')->map(function ($subjectMarks) {
                 // Total obtained / Total Max * 100
                 $obtained = $subjectMarks->sum('score');
                 $max = $subjectMarks->sum('max_score');
                 
                 return $max > 0 ? ($obtained / $max) * 100 : 0;
            });
            
            $average = $subjectScores->isNotEmpty() ? $subjectScores->avg() : 0;
        }

        SemesterResult::updateOrCreate(
            [
                'student_id' => $student->id,
                'academic_year_id' => $academicYearId,
                'semester' => $semester,
            ],
            [
                'grade_id' => $student->grade_id,
                'average' => $average,
            ]
        );
    }

    private function calculateSemesterRanks($sectionId, $academicYearId, $semester)
    {
        // Join with students table to filter by section_id
        $results = SemesterResult::join('students', 'semester_results.student_id', '=', 'students.id')
            ->where('students.section_id', $sectionId)
            ->where('semester_results.academic_year_id', $academicYearId)
            ->where('semester_results.semester', $semester)
            ->orderByDesc('semester_results.average')
            ->select('semester_results.*') // Select only result fields
            ->get();
            
        $rank = 1;
        foreach ($results as $result) {
            SemesterResult::where('id', $result->id)->update(['rank' => $rank++]);
        }
    }

    private function calculateStudentFinalResult($student, $academicYearId)
    {
        // Get S1 and S2 results
        $s1 = SemesterResult::where('student_id', $student->id)
            ->where('academic_year_id', $academicYearId)
            ->where('semester', 1)
            ->first();

        $s2 = SemesterResult::where('student_id', $student->id)
            ->where('academic_year_id', $academicYearId)
            ->where('semester', 2)
            ->first();
            
        $avg1 = $s1 ? $s1->average : 0;
        $avg2 = $s2 ? $s2->average : 0;
        
        $combinedAverage = ($avg1 + $avg2) / 2;
        
        $isEligible = $combinedAverage >= 50; 

        Log::info("Saving final result for student {$student->id}: Average={$combinedAverage}, Status=" . ($isEligible ? 'passed' : 'failed'));

        FinalResult::updateOrCreate(
            [
                'student_id' => $student->id,
                'academic_year_id' => $academicYearId,
            ],
            [
                'grade_id' => $student->grade_id,
                'combined_average' => $combinedAverage,
                'promotion_status' => $isEligible ? 'passed' : 'failed',
            ]
        );
    }

    private function calculateFinalRanks($sectionId, $academicYearId)
    {
        // Join with students table to filter by section_id
        $results = FinalResult::join('students', 'final_results.student_id', '=', 'students.id')
            ->where('students.section_id', $sectionId)
            ->where('final_results.academic_year_id', $academicYearId)
            ->orderByDesc('final_results.combined_average')
            ->select('final_results.*')
            ->get();
            
        $rank = 1;
        foreach ($results as $result) {
            FinalResult::where('id', $result->id)->update(['final_rank' => $rank++]);
        }
    }
}
