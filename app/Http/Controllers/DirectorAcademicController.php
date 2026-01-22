<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\Subject;
use App\Models\Section;
use App\Models\Mark;
use App\Models\Student;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DirectorAcademicController extends Controller
{
    /**
     * Get school-wide performance overview.
     */
    public function getPerformanceOverview()
    {
        // Cache the entire overview for 30 minutes to prevent timeouts
        $cacheKey = 'director_academic_overview';
        
        $cachedData = cache()->remember($cacheKey, 1800, function() {
            // 1. Optimized Overview Calculation (Single Query)
            $overviewData = \DB::table('grades')
                ->leftJoin('students', 'grades.id', '=', 'students.grade_id')
                ->leftJoin('marks', 'students.id', '=', 'marks.student_id')
                ->select(
                    'grades.id',
                    'grades.name',
                    'grades.level',
                    \DB::raw('COUNT(DISTINCT students.id) as total_students'),
                    \DB::raw('ROUND(AVG(marks.score), 2) as avg_score'),
                    \DB::raw('COUNT(CASE WHEN marks.score >= 50 THEN 1 END) as pass_count'),
                    \DB::raw('COUNT(marks.score) as total_marks')
                )
                ->whereNotNull('marks.score')
                ->groupBy('grades.id', 'grades.name', 'grades.level')
                ->orderBy('grades.level')
                ->get();

            $overview = $overviewData->map(function ($grade) {
                $passRate = $grade->total_marks > 0 ? ($grade->pass_count / $grade->total_marks) * 100 : 0;
                
                return [
                    'grade' => $grade->name,
                    'level' => $grade->level,
                    'avgScore' => $grade->avg_score ?? 0,
                    'passRate' => round($passRate, 2),
                    'topSection' => 'Loading...', // Will be loaded separately if needed
                    'trend' => 'up', // Mock trend
                ];
            });

            // 2. Optimized Heatmap Calculation (Single Query)
            $heatMapData = \DB::table('subjects')
                ->leftJoin('marks', 'subjects.id', '=', 'marks.subject_id')
                ->leftJoin('students', 'marks.student_id', '=', 'students.id')
                ->leftJoin('grades', 'students.grade_id', '=', 'grades.id')
                ->select(
                    'subjects.name as subject_name',
                    'grades.level',
                    \DB::raw('ROUND(AVG(marks.score), 1) as avg_score')
                )
                ->whereNotNull('marks.score')
                ->groupBy('subjects.id', 'subjects.name', 'grades.level')
                ->orderBy('subjects.name')
                ->orderBy('grades.level')
                ->get();

            // Transform heatmap data into the expected format
            $heatMap = $heatMapData->groupBy('subject_name')->map(function ($subjectData, $subjectName) {
                $row = ['subject' => $subjectName];
                
                foreach ($subjectData as $gradeData) {
                    $row["grade_{$gradeData->level}"] = $gradeData->avg_score ?? 0;
                }
                
                // Calculate school average
                $schoolAvg = $subjectData->avg('avg_score');
                $row['school_avg'] = round($schoolAvg ?? 0, 1);
                
                return $row;
            })->values();

            return [
                'overviewData' => $overview,
                'heatMapData' => $heatMap,
            ];
        });
        
        return Inertia::render('Director/Academic/Overview', [
            'overviewData' => $cachedData['overviewData'],
            'heatMapData' => $cachedData['heatMapData'],
            // Calculate at risk count dynamically or cache it too
            'atRiskCount' => \App\Models\Mark::select('student_id')
                ->groupBy('student_id')
                ->havingRaw('AVG(score) < 50')
                ->get()
                ->count(),
        ]);
    }

    /**
     * Get grade-specific analytics (JSON API).
     */
    public function getGradeAnalytics($grade)
    {
        // Cache grade analytics for 15 minutes
        $cacheKey = "director_grade_analytics_{$grade}";
        
        $analytics = cache()->remember($cacheKey, 900, function() use ($grade) {
            return \DB::table('sections')
                ->join('grades', 'sections.grade_id', '=', 'grades.id')
                ->leftJoin('students', 'sections.id', '=', 'students.section_id')
                ->leftJoin('marks', 'students.id', '=', 'marks.student_id')
                ->select(
                    'sections.name as section_name',
                    \DB::raw('COUNT(DISTINCT students.id) as student_count'),
                    \DB::raw('ROUND(AVG(marks.score), 2) as avg_score'),
                    \DB::raw('COUNT(CASE WHEN marks.score >= 50 THEN 1 END) as pass_count'),
                    \DB::raw('COUNT(marks.score) as total_marks')
                )
                ->where('grades.level', $grade)
                ->whereNotNull('marks.score')
                ->groupBy('sections.id', 'sections.name')
                ->get()
                ->map(function ($section) {
                    $passRate = $section->total_marks > 0 ? ($section->pass_count / $section->total_marks) * 100 : 0;
                    
                    return [
                        'section' => $section->section_name,
                        'students' => $section->student_count,
                        'avgScore' => $section->avg_score ?? 0,
                        'passRate' => round($passRate, 2),
                    ];
                });
        });

        return response()->json($analytics);
    }

    /**
     * Helper for heatmap data (Internal or API).
     */
    public function getSubjectHeatMap()
    {
        // Cache heatmap for 30 minutes
        $cacheKey = 'director_subject_heatmap';
        
        $heatMap = cache()->remember($cacheKey, 1800, function() {
            return \DB::table('subjects')
                ->leftJoin('marks', 'subjects.id', '=', 'marks.subject_id')
                ->leftJoin('students', 'marks.student_id', '=', 'students.id')
                ->leftJoin('grades', 'students.grade_id', '=', 'grades.id')
                ->select(
                    'subjects.name as subject_name',
                    'grades.level',
                    \DB::raw('ROUND(AVG(marks.score), 1) as avg_score')
                )
                ->whereNotNull('marks.score')
                ->groupBy('subjects.id', 'subjects.name', 'grades.level')
                ->orderBy('subjects.name')
                ->orderBy('grades.level')
                ->get()
                ->groupBy('subject_name')
                ->map(function ($subjectData, $subjectName) {
                    $row = ['subject' => $subjectName];
                    
                    foreach ($subjectData as $gradeData) {
                        $row["grade_{$gradeData->level}"] = $gradeData->avg_score ?? 0;
                    }
                    
                    // Calculate school average
                    $schoolAvg = $subjectData->avg('avg_score');
                    $row['school_avg'] = round($schoolAvg ?? 0, 1);
                    
                    return $row;
                })
                ->values();
        });

        return response()->json($heatMap);
    }

    /**
     * Get list of "At Risk" students (Average Score < 50%).
     */
    public function getAtRiskStudents(Request $request)
    {
        $gradeId = $request->input('grade_id');
        
        $query = \DB::table('students')
            ->join('users', 'students.user_id', '=', 'users.id')
            ->join('grades', 'students.grade_id', '=', 'grades.id')
            ->join('sections', 'students.section_id', '=', 'sections.id')
            ->leftJoin('marks', 'students.id', '=', 'marks.student_id')
            ->select(
                'students.id',
                'users.name as student_name',
                'students.student_id',
                'grades.name as grade_name',
                'sections.name as section_name',
                \DB::raw('ROUND(AVG(marks.score), 2) as avg_score'),
                \DB::raw('COUNT(CASE WHEN marks.score < 50 THEN 1 END) as failed_subjects_count')
            )
            ->whereNotNull('marks.score')
            ->groupBy('students.id', 'users.name', 'students.student_id', 'grades.name', 'sections.name')
            ->havingRaw('AVG(marks.score) < 50');

        if ($gradeId) {
            $query->where('grades.id', $gradeId);
        }

        $atRiskStudents = $query->limit(50)->get();

        return response()->json($atRiskStudents);
    }

    /**
     * Export analytics as CSV/PDF.
     */
    public function exportAnalytics(Request $request)
    {
        $format = $request->input('format', 'csv');
        $type = $request->input('type', 'performance'); // performance, at_risk, etc.
        
        // Mock Implementation for export
        return response()->json(['message' => "Exporting {$type} in {$format} format... (Download started)"]);
    }
}
