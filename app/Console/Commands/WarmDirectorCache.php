<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class WarmDirectorCache extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'cache:warm-director';

    /**
     * The console command description.
     */
    protected $description = 'Warm up director dashboard cache to prevent timeouts';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Warming director dashboard cache...');

        try {
            // 1. Warm Academic Overview Cache
            $this->info('Warming academic overview cache...');
            $this->warmAcademicOverview();

            // 2. Warm Subject Heatmap Cache
            $this->info('Warming subject heatmap cache...');
            $this->warmSubjectHeatmap();

            // 3. Warm Grade Analytics Cache
            $this->info('Warming grade analytics cache...');
            $this->warmGradeAnalytics();

            $this->info('✅ Director cache warmed successfully!');
            
        } catch (\Exception $e) {
            $this->error('❌ Error warming director cache: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }

    private function warmAcademicOverview()
    {
        // Warm director dashboard cache
        $dashboardCacheKey = 'director_dashboard_stats';
        cache()->forget($dashboardCacheKey);
        
        $dashboardData = [
            'statistics' => $this->getDirectorStatistics(),
            'earnings' => $this->getEarningsData(),
            'topPerformers' => $this->getTopPerformers(),
            'attendance' => $this->getAttendanceData(),
        ];
        
        cache()->put($dashboardCacheKey, $dashboardData, 900); // 15 minutes
        $this->info("   - Director dashboard cached");
        
        // Warm academic overview cache
        $cacheKey = 'director_academic_overview';
        
        cache()->forget($cacheKey);
        
        // Optimized Overview Calculation
        $overviewData = DB::table('grades')
            ->leftJoin('students', 'grades.id', '=', 'students.grade_id')
            ->leftJoin('marks', 'students.id', '=', 'marks.student_id')
            ->select(
                'grades.id',
                'grades.name',
                'grades.level',
                DB::raw('COUNT(DISTINCT students.id) as total_students'),
                DB::raw('ROUND(AVG(marks.score), 2) as avg_score'),
                DB::raw('COUNT(CASE WHEN marks.score >= 50 THEN 1 END) as pass_count'),
                DB::raw('COUNT(marks.score) as total_marks')
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
                'topSection' => 'Loading...',
                'trend' => 'up',
            ];
        });

        // Optimized Heatmap Calculation
        $heatMapData = DB::table('subjects')
            ->leftJoin('marks', 'subjects.id', '=', 'marks.subject_id')
            ->leftJoin('students', 'marks.student_id', '=', 'students.id')
            ->leftJoin('grades', 'students.grade_id', '=', 'grades.id')
            ->select(
                'subjects.name as subject_name',
                'grades.level',
                DB::raw('ROUND(AVG(marks.score), 1) as avg_score')
            )
            ->whereNotNull('marks.score')
            ->groupBy('subjects.id', 'subjects.name', 'grades.level')
            ->orderBy('subjects.name')
            ->orderBy('grades.level')
            ->get();

        $heatMap = $heatMapData->groupBy('subject_name')->map(function ($subjectData, $subjectName) {
            $row = ['subject' => $subjectName];
            
            foreach ($subjectData as $gradeData) {
                $row["grade_{$gradeData->level}"] = $gradeData->avg_score ?? 0;
            }
            
            $schoolAvg = $subjectData->avg('avg_score');
            $row['school_avg'] = round($schoolAvg ?? 0, 1);
            
            return $row;
        })->values();

        cache()->put($cacheKey, [
            'overviewData' => $overview,
            'heatMapData' => $heatMap,
        ], 1800); // 30 minutes

        $this->info("   - Academic overview cached ({$overview->count()} grades, {$heatMap->count()} subjects)");
    }

    private function getDirectorStatistics()
    {
        $totalStudents = DB::table('students')->count();
        $maleStudents = DB::table('students')->where('gender', 'Male')->count();
        $femaleStudents = DB::table('students')->where('gender', 'Female')->count();
        $totalTeachers = DB::table('teachers')->count();
        $totalParents = DB::table('parent_student')->distinct('parent_id')->count();

        return [
            'students' => [
                'total' => $totalStudents,
                'male' => $maleStudents,
                'female' => $femaleStudents,
                'malePercent' => $totalStudents > 0 ? round(($maleStudents / $totalStudents) * 100, 1) : 0,
                'femalePercent' => $totalStudents > 0 ? round(($femaleStudents / $totalStudents) * 100, 1) : 0,
            ],
            'teachers' => ['total' => $totalTeachers],
            'parents' => ['total' => $totalParents],
        ];
    }

    private function getEarningsData()
    {
        $currentYear = date('Y');
        $totalEarnings = DB::table('payments')
            ->where('status', 'Paid')
            ->whereYear('transaction_date', $currentYear)
            ->sum('amount');

        return [
            'total' => $totalEarnings,
            'trend' => 'up',
        ];
    }

    private function getTopPerformers()
    {
        return DB::table('students')
            ->join('users', 'students.user_id', '=', 'users.id')
            ->join('grades', 'students.grade_id', '=', 'grades.id')
            ->leftJoin('marks', 'students.id', '=', 'marks.student_id')
            ->select(
                'users.name',
                'students.student_id',
                'grades.name as grade_name',
                DB::raw('ROUND(AVG(marks.score), 2) as avg_score')
            )
            ->whereNotNull('marks.score')
            ->groupBy('students.id', 'users.name', 'students.student_id', 'grades.name')
            ->orderBy('avg_score', 'desc')
            ->limit(5)
            ->get()
            ->map(function($student) {
                return [
                    'name' => $student->name,
                    'id' => $student->student_id,
                    'class' => $student->grade_name,
                    'score' => $student->avg_score ?? 0,
                    'trend' => 'up',
                ];
            });
    }

    private function getAttendanceData()
    {
        return [
            'students' => 84,
            'teachers' => 91,
        ];
    }

    private function warmSubjectHeatmap()
    {
        $cacheKey = 'director_subject_heatmap';
        
        cache()->forget($cacheKey);
        
        $heatMap = DB::table('subjects')
            ->leftJoin('marks', 'subjects.id', '=', 'marks.subject_id')
            ->leftJoin('students', 'marks.student_id', '=', 'students.id')
            ->leftJoin('grades', 'students.grade_id', '=', 'grades.id')
            ->select(
                'subjects.name as subject_name',
                'grades.level',
                DB::raw('ROUND(AVG(marks.score), 1) as avg_score')
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
                
                $schoolAvg = $subjectData->avg('avg_score');
                $row['school_avg'] = round($schoolAvg ?? 0, 1);
                
                return $row;
            })
            ->values();

        cache()->put($cacheKey, $heatMap, 1800); // 30 minutes

        $this->info("   - Subject heatmap cached ({$heatMap->count()} subjects)");
    }

    private function warmGradeAnalytics()
    {
        // Get all grade levels
        $gradeLevels = DB::table('grades')->pluck('level');

        foreach ($gradeLevels as $grade) {
            $cacheKey = "director_grade_analytics_{$grade}";
            
            cache()->forget($cacheKey);
            
            $analytics = DB::table('sections')
                ->join('grades', 'sections.grade_id', '=', 'grades.id')
                ->leftJoin('students', 'sections.id', '=', 'students.section_id')
                ->leftJoin('marks', 'students.id', '=', 'marks.student_id')
                ->select(
                    'sections.name as section_name',
                    DB::raw('COUNT(DISTINCT students.id) as student_count'),
                    DB::raw('ROUND(AVG(marks.score), 2) as avg_score'),
                    DB::raw('COUNT(CASE WHEN marks.score >= 50 THEN 1 END) as pass_count'),
                    DB::raw('COUNT(marks.score) as total_marks')
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

            cache()->put($cacheKey, $analytics, 900); // 15 minutes

            $this->info("   - Grade {$grade} analytics cached ({$analytics->count()} sections)");
        }
    }
}