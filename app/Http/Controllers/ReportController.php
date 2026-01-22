<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Mark;
use App\Models\Student;
use App\Models\Grade;
use App\Models\Subject;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function studentPerformance(Student $student)
    {
        $student->load(['grade', 'section', 'user']);
        
        $marks = Mark::with(['assessment.subject'])
            ->where('student_id', $student->id)
            ->get();

        $performanceBySubject = $marks->groupBy('assessment.subject.name')
            ->map(function ($subjectMarks) {
                $totalScore = $subjectMarks->sum('score');
                $totalMaxScore = $subjectMarks->sum(function ($mark) {
                    return $mark->assessment->max_score;
                });
                $average = $totalMaxScore > 0 ? ($totalScore / $totalMaxScore) * 100 : 0;
                
                return [
                    'total_assessments' => $subjectMarks->count(),
                    'total_score' => $totalScore,
                    'total_max_score' => $totalMaxScore,
                    'average_percentage' => round($average, 2),
                    'marks' => $subjectMarks
                ];
            });

        $overallAverage = $marks->isEmpty() ? 0 : $marks->avg(function ($mark) {
            return ($mark->score / $mark->assessment->max_score) * 100;
        });

        return inertia('Reports/StudentPerformance', [
            'student' => $student,
            'performanceBySubject' => $performanceBySubject,
            'overallAverage' => round($overallAverage, 2),
            'totalAssessments' => $marks->count()
        ]);
    }

    public function classPerformance(Grade $grade)
    {
        $students = Student::with(['user', 'marks.assessment.subject'])
            ->where('grade_id', $grade->id)
            ->get();

        $classStats = $students->map(function ($student) {
            $marks = $student->marks;
            $average = $marks->isEmpty() ? 0 : $marks->avg(function ($mark) {
                return ($mark->score / $mark->assessment->max_score) * 100;
            });
            
            return [
                'student' => $student,
                'average' => round($average, 2),
                'total_assessments' => $marks->count()
            ];
        })->sortByDesc('average');

        $subjectPerformance = Subject::where('grade_id', $grade->id)
            ->with(['assessments.marks.student.user'])
            ->get()
            ->map(function ($subject) {
                $allMarks = $subject->assessments->flatMap->marks;
                $average = $allMarks->isEmpty() ? 0 : $allMarks->avg(function ($mark) {
                    return ($mark->score / $mark->assessment->max_score) * 100;
                });
                
                return [
                    'subject' => $subject,
                    'average' => round($average, 2),
                    'total_students' => $allMarks->unique('student_id')->count(),
                    'total_assessments' => $subject->assessments->count()
                ];
            });

        return inertia('Reports/ClassPerformance', [
            'grade' => $grade,
            'classStats' => $classStats,
            'subjectPerformance' => $subjectPerformance,
            'classAverage' => round($classStats->avg('average'), 2)
        ]);
    }

    public function teacherAssessments()
    {
        $assessments = Assessment::with(['subject', 'grade', 'marks.student.user'])
            ->where('created_by', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        $assessmentStats = $assessments->map(function ($assessment) {
            $marks = $assessment->marks;
            $average = $marks->isEmpty() ? 0 : $marks->avg(function ($mark) {
                return ($mark->score / $assessment->max_score) * 100;
            });
            
            $gradeDistribution = $marks->groupBy(function ($mark) {
                $percentage = ($mark->score / $assessment->max_score) * 100;
                if ($percentage >= 90) return 'A';
                if ($percentage >= 80) return 'B';
                if ($percentage >= 70) return 'C';
                if ($percentage >= 60) return 'D';
                return 'F';
            })->map->count();

            return [
                'assessment' => $assessment,
                'average' => round($average, 2),
                'total_submissions' => $marks->count(),
                'grade_distribution' => $gradeDistribution
            ];
        });

        return inertia('Reports/TeacherAssessments', [
            'assessmentStats' => $assessmentStats
        ]);
    }
}