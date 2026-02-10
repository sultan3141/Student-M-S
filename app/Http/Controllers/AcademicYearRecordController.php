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
        // Get current academic year using Eloquent (respects model casts)
        $year = \App\Models\AcademicYear::whereRaw('is_current = true')
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
        $student = $user->student()->with(['user'])->first();

        if (!$student) {
            return redirect()->route('student.dashboard')->with('error', 'Student profile not found');
        }

        $academicYear = \App\Models\AcademicYear::findOrFail($academicYearId);

        // Find the registration for THIS specific year to get the correct grade/section history
        $registration = \App\Models\Registration::where('student_id', $student->id)
            ->where('academic_year_id', $academicYearId)
            ->first();

        // Fallback to current if no registration found (unlikely but possible in edge cases)
        $gradeId = $registration ? $registration->grade_id : $student->grade_id;
        $sectionId = $registration ? $registration->section_id : $student->section_id;
        $streamId = $registration ? $registration->stream_id : $student->stream_id;

        // Get all subjects for the grade the student was in DURING THAT YEAR
        $subjectsQuery = \App\Models\Subject::where('grade_id', $gradeId);
        if ($streamId) {
            $subjectsQuery->where(function ($q) use ($streamId) {
                $q->where('stream_id', $streamId)
                    ->orWhereNull('stream_id');
            });
        }
        $assignedSubjects = $subjectsQuery->get();

        // Get marks only for PUBLISHED assessments
        $marks = \App\Models\Mark::where('student_id', $student->id)
            ->where('academic_year_id', $academicYearId)
            ->get();

        // Calculate semester averages based on SUBJECT percentages
        $calculateSemAvg = function ($m) {
            if ($m->isEmpty())
                return 0;
            $subjectStats = $m->groupBy('subject_id')->map(function ($sm) {
                $score = $sm->sum('score');
                $max = $sm->sum('max_score') ?: ($sm->count() * 100);
                return $max > 0 ? ($score / $max) * 100 : 0;
            });
            return round($subjectStats->avg(), 2);
        };

        $semester1Average = $calculateSemAvg($marks->where('semester', '1'));
        $semester2Average = $calculateSemAvg($marks->where('semester', '2'));

        $finalAverage = 0;
        if ($semester1Average > 0 && $semester2Average > 0) {
            $finalAverage = round(($semester1Average + $semester2Average) / 2, 2);
        } else {
            $finalAverage = max($semester1Average, $semester2Average);
        }

        // Map subjects for display
        $subjectPerformance = $assignedSubjects->map(function ($subject) use ($marks) {
            $subjectMarks = $marks->where('subject_id', $subject->id);

            $getSemAvg = function ($m) {
                if ($m->isEmpty())
                    return null;
                $score = $m->sum('score');
                $max = $m->sum('max_score') ?: ($m->count() * 100);
                return $max > 0 ? ($score / $max) * 100 : 0;
            };

            $sem1Avg = $getSemAvg($subjectMarks->where('semester', '1'));
            $sem2Avg = $getSemAvg($subjectMarks->where('semester', '2'));

            $finalAvg = null;
            if ($sem1Avg !== null && $sem2Avg !== null) {
                $finalAvg = round(($sem1Avg + $sem2Avg) / 2, 2);
            } else {
                $finalAvg = $sem1Avg ?? $sem2Avg;
            }

            return [
                'id' => $subject->id,
                'name' => $subject->name,
                'code' => $subject->code,
                'credit_hours' => $subject->credit_hours ?? 3,
                'semester1_average' => $sem1Avg ? round($sem1Avg, 2) : null,
                'semester2_average' => $sem2Avg ? round($sem2Avg, 2) : null,
                'final_average' => $finalAvg ? round($finalAvg, 2) : null,
            ];
        });

        // Use the historical section_id for rank calculation
        $rankData = $this->calculateYearRankFast($student->id, $sectionId, $academicYearId);

        return Inertia::render('Student/AcademicYearRecord/Show', [
            'student' => $student->load(['grade', 'section']), // Show current grade in header
            'academic_year' => $academicYear,
            'semester1_average' => $semester1Average,
            'semester2_average' => $semester2Average,
            'final_average' => $finalAverage,
            'subjects' => $subjectPerformance,
            'final_rank' => $rankData['final_rank'] ?? '-',
            'rank_s1' => $rankData['rank_s1'] ?? '-',
            'rank_s2' => $rankData['rank_s2'] ?? '-',
            'total_students' => $rankData['total'] ?? 0,
            'is_complete' => $semester1Average > 0 && $semester2Average > 0,
            'grade_at_time' => \App\Models\Grade::find($gradeId)?->name, // Bonus: show historical grade name
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
                ->get();

            // Calculate averages for ALL students in the section
            $studentAverages = $sectionMarks->groupBy('student_id')->map(function ($studentMarks) {
                $calculateAvg = function ($marks) {
                    if ($marks->isEmpty())
                        return 0;
                    $subjectStats = $marks->groupBy('subject_id')->map(function ($sm) {
                        $score = $sm->sum('score');
                        $max = $sm->sum('max_score') ?: ($sm->count() * 100);
                        return $max > 0 ? ($score / $max) * 100 : 0;
                    });
                    return $subjectStats->avg();
                };

                $s1 = $calculateAvg($studentMarks->where('semester', '1'));
                $s2 = $calculateAvg($studentMarks->where('semester', '2'));

                $final = 0;
                if ($s1 > 0 && $s2 > 0) {
                    $final = ($s1 + $s2) / 2;
                } else {
                    $final = max($s1, $s2);
                }

                return [
                    's1' => $s1,
                    's2' => $s2,
                    'final' => $final
                ];
            });

            // Function to get rank from a collection of values
            $getRank = function ($collection, $value, $key) {
                if ($value <= 0)
                    return '-';
                // Sort by the specific key (s1, s2, or final)
                $sorted = $collection->sortByDesc($key)->values();
                // Find position
                $position = $sorted->search(function ($item) use ($value, $key) {
                    return $item[$key] == $value;
                });
                return $position !== false ? $position + 1 : '-';
            };

            // Get this student's averages
            $myAvgs = $studentAverages->get($studentId);

            if (!$myAvgs) {
                return ['rank_s1' => '-', 'rank_s2' => '-', 'final_rank' => '-', 'total' => $studentAverages->count()];
            }

            return [
                'rank_s1' => $getRank($studentAverages, $myAvgs['s1'], 's1'),
                'rank_s2' => $getRank($studentAverages, $myAvgs['s2'], 's2'),
                'final_rank' => $getRank($studentAverages, $myAvgs['final'], 'final'),
                'total' => $studentAverages->count(),
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
