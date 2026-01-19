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
        // 1. Calculate Overview (Grades)
        $grades = Grade::with(['sections'])->get();
        
        $overview = $grades->map(function ($grade) {
            $students = Student::where('grade_id', $grade->id)->get();
            $marks = Mark::whereIn('student_id', $students->pluck('id'))
                ->whereNotNull('marks_obtained')
                ->get();

            $avgScore = $marks->avg('marks_obtained') ?? 0;
            $passCount = $marks->where('marks_obtained', '>=', 50)->count();
            $passRate = $marks->count() > 0 ? ($passCount / $marks->count()) * 100 : 0;

            // Find top section
            $topSection = $grade->sections->map(function ($section) {
                $sectionMarks = Mark::whereHas('student', function ($q) use ($section) {
                    $q->where('section_id', $section->id);
                })->whereNotNull('marks_obtained')->avg('marks_obtained') ?? 0;

                return [
                    'section' => $section,
                    'avg' => $sectionMarks,
                ];
            })->sortByDesc('avg')->first();

            return [
                'grade' => $grade->name,
                'level' => $grade->level,
                'avgScore' => round($avgScore, 2),
                'passRate' => round($passRate, 2),
                'topSection' => $topSection ? $topSection['section']->name . ' (' . round($topSection['avg'], 1) . '%)' : 'N/A',
                'trend' => 'up', // Mock trend
            ];
        });

        // 2. Calculate Heatmap (Subjects)
        $subjects = Subject::all();
        $allGrades = Grade::orderBy('level')->get();

        $heatMap = $subjects->map(function ($subject) use ($allGrades) {
            $row = ['subject' => $subject->name];

            foreach ($allGrades as $grade) {
                $marks = Mark::where('subject_id', $subject->id)
                    ->whereHas('student', function ($q) use ($grade) {
                        $q->where('grade_id', $grade->id);
                    })
                    ->whereNotNull('marks_obtained')
                    ->avg('marks_obtained');

                $row["grade_{$grade->level}"] = round($marks ?? 0, 1);
            }

            // Calculate school average for this subject
            $schoolAvg = Mark::where('subject_id', $subject->id)
                ->whereNotNull('marks_obtained')
                ->avg('marks_obtained');
            $row['school_avg'] = round($schoolAvg ?? 0, 1);

            return $row;
        });

        return Inertia::render('Director/Academic/Overview', [
            'overviewData' => $overview,
            'heatMapData' => $heatMap,
        ]);
    }

    /**
     * Get grade-specific analytics (JSON API).
     */
    public function getGradeAnalytics($grade)
    {
        $gradeModel = Grade::where('level', $grade)->firstOrFail();
        
        $sections = $gradeModel->sections()->with(['students'])->get();
        
        $analytics = $sections->map(function ($section) {
            $marks = Mark::whereHas('student', function ($q) use ($section) {
                $q->where('section_id', $section->id);
            })->whereNotNull('marks_obtained');

            return [
                'section' => $section->name,
                'students' => $section->students->count(),
                'avgScore' => round($marks->avg('marks_obtained') ?? 0, 2),
                'passRate' => $marks->count() > 0 ? round(($marks->where('marks_obtained', '>=', 50)->count() / $marks->count()) * 100, 2) : 0,
            ];
        });

        return response()->json($analytics);
    }

    /**
     * Helper for heatmap data (Internal or API).
     */
    public function getSubjectHeatMap()
    {
         // Original method kept or could be removed if not used elsewhere
         // For now, I'll keep it returning JSON just in case other things use it, 
         // but the page load logic is now in index.
         
        $subjects = Subject::all();
        $grades = Grade::all();

        $heatMap = $subjects->map(function ($subject) use ($grades) {
            $row = ['subject' => $subject->name];

            foreach ($grades as $grade) {
                $marks = Mark::where('subject_id', $subject->id)
                    ->whereHas('student', function ($q) use ($grade) {
                        $q->where('grade_id', $grade->id);
                    })
                    ->whereNotNull('marks_obtained')
                    ->avg('marks_obtained');

                $row["grade_{$grade->level}"] = round($marks ?? 0, 1);
            }

            $schoolAvg = Mark::where('subject_id', $subject->id)
                ->whereNotNull('marks_obtained')
                ->avg('marks_obtained');
            $row['school_avg'] = round($schoolAvg ?? 0, 1);

            return $row;
        });

        return response()->json($heatMap);
    }

    /**
     * Export analytics as CSV/PDF.
     */
    public function exportAnalytics(Request $request)
    {
        $format = $request->input('format', 'csv');
        
        // Implementation for export functionality
        // This is a placeholder
        return response()->json(['message' => 'Export feature coming soon']);
    }
}
