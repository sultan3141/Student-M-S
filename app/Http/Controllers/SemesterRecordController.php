<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Mark;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SemesterRecordController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $student = $user->student()->select('id', 'student_id', 'grade_id', 'section_id')->first();
        
        if (!$student) {
            return redirect()->route('student.dashboard')->with('error', 'Student profile not found');
        }

        // Get semesters with marks - simple query
        $semesters = \DB::table('marks')
            ->join('academic_years', 'marks.academic_year_id', '=', 'academic_years.id')
            ->where('marks.student_id', $student->id)
            ->select(
                'marks.semester',
                'marks.academic_year_id',
                'academic_years.name as year_name',
                \DB::raw('ROUND(AVG(marks.score), 2) as average')
            )
            ->groupBy('marks.semester', 'marks.academic_year_id', 'academic_years.name')
            ->orderBy('marks.academic_year_id', 'desc')
            ->orderBy('marks.semester', 'desc')
            ->get()
            ->map(function($sem) use ($student) {
                // Get rank separately
                $rank = \DB::table('semester_results')
                    ->where('student_id', $student->id)
                    ->where('academic_year_id', $sem->academic_year_id)
                    ->where('semester', $sem->semester)
                    ->value('rank') ?? 'N/A';
                
                return [
                    'semester' => $sem->semester,
                    'academic_year_id' => $sem->academic_year_id,
                    'academic_year' => ['id' => $sem->academic_year_id, 'name' => $sem->year_name],
                    'average' => $sem->average,
                    'rank' => $rank,
                    'total_students' => cache()->remember("section_{$student->section_id}_count", 3600, function() use ($student) {
                        return \DB::table('students')->where('section_id', $student->section_id)->count();
                    }),
                ];
            });

        // Get grade and section info
        $studentInfo = \DB::table('students')
            ->join('grades', 'students.grade_id', '=', 'grades.id')
            ->join('sections', 'students.section_id', '=', 'sections.id')
            ->where('students.id', $student->id)
            ->select('students.id', 'students.student_id', 'grades.name as grade_name', 'sections.name as section_name')
            ->first();

        return Inertia::render('Student/SemesterRecord/Index', [
            'student' => [
                'id' => $student->id,
                'student_id' => $student->student_id,
                'grade' => ['name' => $studentInfo->grade_name],
                'section' => ['name' => $studentInfo->section_name],
            ],
            'semesters' => $semesters,
        ]);
    }

    public function show($semester, $academicYearId)
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
        
        // Single query to get all marks with subject info
        $marks = \DB::table('marks')
            ->join('subjects', 'marks.subject_id', '=', 'subjects.id')
            ->where('marks.student_id', $student->id)
            ->where('marks.semester', $semester)
            ->where('marks.academic_year_id', $academicYearId)
            ->select('marks.id', 'marks.score', 'marks.assessment_id', 'marks.is_submitted', 'subjects.id as subject_id', 'subjects.name as subject_name', 'subjects.code as subject_code')
            ->get();

        // Get teacher assignments for this section and academic year
        $teacherAssignments = \DB::table('teacher_assignments')
            ->join('teachers', 'teacher_assignments.teacher_id', '=', 'teachers.id')
            ->join('users', 'teachers.user_id', '=', 'users.id')
            ->where('teacher_assignments.section_id', $student->section_id)
            ->where('teacher_assignments.academic_year_id', $academicYearId)
            ->select('teacher_assignments.subject_id', 'users.name as teacher_name')
            ->get()
            ->keyBy('subject_id');

        // Group by subject and calculate averages
        $subjectRecords = $marks->groupBy('subject_id')->map(function ($subjectMarks) use ($teacherAssignments) {
            $firstMark = $subjectMarks->first();
            
            // Transform marks to include assessment details
            $detailedMarks = $subjectMarks->map(function($mark) {
                // Fetch assessment details if available, otherwise fallback
                $assessmentName = 'Unknown Assessment';
                $maxScore = 100;
                $weight = 0;
                $typeName = 'General';
                
                if ($mark->assessment_id) {
                    $assessment = \DB::table('assessments')
                        ->join('assessment_types', 'assessments.assessment_type_id', '=', 'assessment_types.id')
                        ->where('assessments.id', $mark->assessment_id)
                        ->select('assessments.name', 'assessments.max_score', 'assessments.weight_percentage', 'assessment_types.name as type_name')
                        ->first();
                        
                    if ($assessment) {
                        $assessmentName = $assessment->name;
                        $maxScore = $assessment->max_score;
                        $weight = $assessment->weight_percentage;
                        $typeName = $assessment->type_name;
                    }
                }
                
                return [
                    'id' => $mark->id,
                    'score' => $mark->score,
                    'assessment_name' => $assessmentName,
                    'max_score' => $maxScore,
                    'weight' => $weight,
                    'type' => $typeName,
                    'is_submitted' => $mark->is_submitted ?? true, // Assume mostly true for legacy data
                ];
            });

            return [
                'subject' => [
                    'id' => $firstMark->subject_id,
                    'name' => $firstMark->subject_name,
                    'code' => $firstMark->subject_code,
                    'credit_hours' => $firstMark->subject_credit_hours ?? 3, // Default if not selected yet
                    'teacher_name' => $teacherAssignments->get($firstMark->subject_id)->teacher_name ?? 'Not Assigned',
                ],
                'marks' => $detailedMarks,
                'average' => round($subjectMarks->avg('score'), 2),
            ];
        })->values();

        // Get semester average and rank
        $semesterAverage = round($marks->avg('score'), 2);
        
        $rank = \DB::table('semester_results')
            ->where('student_id', $student->id)
            ->where('academic_year_id', $academicYearId)
            ->where('semester', $semester)
            ->value('rank') ?? 'N/A';
        
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

        return Inertia::render('Student/SemesterRecord/Show', [
            'student' => [
                'id' => $student->id,
                'student_id' => $student->student_id,
                'grade' => ['name' => $studentInfo->grade_name],
                'section' => ['name' => $studentInfo->section_name],
            ],
            'semester' => $semester,
            'academic_year' => $academicYear,
            'subject_records' => $subjectRecords,
            'semester_average' => $semesterAverage,
            'rank' => $rank,
            'total_students' => $totalStudents,
        ]);
    }

    /**
     * Calculate class rank for a student in a specific semester - with caching
     */
    private function calculateSemesterRankFast($studentId, $sectionId, $semester, $academicYearId)
    {
        $cacheKey = "semester_rank_{$sectionId}_{$semester}_{$academicYearId}";
        
        return cache()->remember($cacheKey, 300, function () use ($studentId, $sectionId, $semester, $academicYearId) {
            // Get all students in the same section
            $sectionStudents = Student::where('section_id', $sectionId)
                ->pluck('id');

            // Calculate semester averages for all students in the section
            $rankings = Mark::whereIn('student_id', $sectionStudents)
                ->where('semester', $semester)
                ->where('academic_year_id', $academicYearId)
                ->select('student_id', DB::raw('AVG(score) as avg_score'))
                ->groupBy('student_id')
                ->orderByDesc('avg_score')
                ->get();

            // Find this student's rank
            $rank = $rankings->search(function ($item) use ($studentId) {
                return $item->student_id == $studentId;
            });

            return [
                'rank' => $rank !== false ? $rank + 1 : null,
                'total' => $rankings->count(),
            ];
        });
    }
    
    /**
     * Calculate class rank for a student in a specific semester
     */
    private function calculateSemesterRank($student, $semester, $academicYearId)
    {
        return $this->calculateSemesterRankFast($student->id, $student->section_id, $semester, $academicYearId);
    }
}
