<?php

namespace App\Services;

use App\Models\Mark;
use App\Models\Ranking;
use App\Models\Student;
use Illuminate\Support\Collection;

class RankingService
{
    /**
     * Calculate and update rankings for a given class and semester.
     * This method processes all marks for a subject, calculates averages,
     * determines rank positions, and identifies performance trends compared to previous terms.
     *
     * @param string $subject
     * @param string $semester
     * @param string $academicYear
     * @return Collection
     */
    public function calculateRankings(string $subject, string $semester, string $academicYear): Collection

    {
        // Get all marks for this class and semester
        $marks = Mark::where('subject', $subject)
            ->where('semester', $semester)
            ->where('academic_year', $academicYear)
            ->with('student')
            ->get();

        // Group by student and calculate averages
        $studentAverages = $marks->groupBy('student_id')->map(function ($studentMarks) {
            return [
                'student_id' => $studentMarks->first()->student_id,
                'average_score' => $studentMarks->avg('mark'),
                'total_marks' => $studentMarks->sum('mark'),
                'count' => $studentMarks->count(),
            ];
        })->sortByDesc('average_score')->values();

        // Assign ranks (handling ties with attendance if available)
        $rankings = $studentAverages->map(function ($data, $index) use ($subject, $semester, $academicYear) {
            $student = Student::find($data['student_id']);
            
            // Calculate previous ranking for trend
            $previousRanking = Ranking::where('student_id', $data['student_id'])
                ->where('subject', $subject)
                ->where('semester', $semester !== '1' ? '1' : '2') // previous semester
                ->first();

            $trend = 'stable';
            if ($previousRanking) {
                if ($index + 1 < $previousRanking->rank_position) {
                    $trend = 'up';
                } elseif ($index + 1 > $previousRanking->rank_position) {
                    $trend = 'down';
                }
            }

            return Ranking::updateOrCreate(
                [
                    'student_id' => $data['student_id'],
                    'semester' => $semester,
                    'academic_year' => $academicYear,
                    'subject' => $subject,
                ],
                [
                    'rank_position' => $index + 1,
                    'average_score' => round($data['average_score'], 2),
                    'total_marks' => $data['total_marks'],
                    'attendance_percentage' => $student->attendance_percentage ?? null,
                    'trend' => $trend,
                ]
            );
        });

        return $rankings;
    }

    /**
     * Get top N students for a class
     */
    public function getTopStudents(string $subject, string $semester, string $academicYear, int $limit = 5): Collection
    {
        return Ranking::where('subject', $subject)
            ->where('semester', $semester)
            ->where('academic_year', $academicYear)
            ->with('student.user')
            ->topRankers($limit)
            ->get();
    }

    /**
     * Get class statistics
     */
    public function getClassStatistics(string $subject, string $semester, string $academicYear): array
    {
        $rankings = Ranking::where('subject', $subject)
            ->where('semester', $semester)
            ->where('academic_year', $academicYear)
            ->get();

        if ($rankings->isEmpty()) {
            return [
                'class_average' => 0,
                'highest_score' => 0,
                'lowest_score' => 0,
                'above_80' => 0,
                'below_50' => 0,
                'total_students' => 0,
            ];
        }

        return [
            'class_average' => round($rankings->avg('average_score'), 2),
            'highest_score' => round($rankings->max('average_score'), 2),
            'lowest_score' => round($rankings->min('average_score'), 2),
            'above_80' => $rankings->where('average_score', '>=', 80)->count(),
            'below_50' => $rankings->where('average_score', '<', 50)->count(),
            'total_students' => $rankings->count(),
        ];
    }

    /**
     * Calculate pass rate
     */
    public function calculatePassRate(string $subject, string $semester, string $academicYear): float
    {
        $total = Ranking::where('subject', $subject)
            ->where('semester', $semester)
            ->where('academic_year', $academicYear)
            ->count();

        if ($total === 0) return 0;

        $passed = Ranking::where('subject', $subject)
            ->where('semester', $semester)
            ->where('academic_year', $academicYear)
            ->where('average_score', '>=', 50)
            ->count();

        return round(($passed / $total) * 100, 2);
    }
}
