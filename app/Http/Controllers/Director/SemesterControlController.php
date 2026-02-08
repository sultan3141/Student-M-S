<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Grade;
use App\Models\SemesterStatus;
use App\Models\SemesterPeriod;
use App\Models\Assessment;
use App\Models\Mark;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SemesterControlController extends Controller
{
    public function index()
    {
        $currentYear = AcademicYear::whereRaw('is_current = true')->first();
        
        if (!$currentYear) {
            return Inertia::render('Director/SemesterControl/Index', [
                'error' => 'No active academic year found.',
                'statuses' => [],
            ]);
        }

        $grades = Grade::orderBy('level')->get();
        
        // Fetch existing statuses for this year
        $statuses = SemesterStatus::where('academic_year_id', $currentYear->id)
            ->get()
            ->groupBy('grade_id');

        $matrix = $grades->map(function($grade) use ($statuses, $currentYear) {
            $gradeStatuses = $statuses->get($grade->id, collect());
            
            // Get statistics for each semester
            $stats1 = $this->getSemesterStatistics($currentYear->id, $grade->id, 1);
            $stats2 = $this->getSemesterStatistics($currentYear->id, $grade->id, 2);
            
            return [
                'grade' => $grade,
                'semester_1' => array_merge(
                    $this->getStatus($gradeStatuses, 1),
                    ['stats' => $stats1]
                ),
                'semester_2' => array_merge(
                    $this->getStatus($gradeStatuses, 2),
                    ['stats' => $stats2]
                ),
            ];
        });

        return Inertia::render('Director/SemesterControl/Index', [
            'academicYear' => $currentYear,
            'matrix' => $matrix,
        ]);
    }

    private function getStatus($gradeStatuses, $semester)
    {
        $record = $gradeStatuses->firstWhere('semester', $semester);
        return [
            'status' => $record ? $record->status : 'open', // Default open
            'is_declared' => $record ? $record->is_declared : false,
        ];
    }

    private function getSemesterStatistics($academicYearId, $gradeId, $semester)
    {
        // Count students in this grade
        $studentCount = Student::where('grade_id', $gradeId)->count();
        
        // Count assessments
        $assessmentCount = Assessment::where('academic_year_id', $academicYearId)
            ->where('grade_id', $gradeId)
            ->where('semester', $semester)
            ->count();
        
        // Count marks entered
        $markCount = Mark::where('academic_year_id', $academicYearId)
            ->where('grade_id', $gradeId)
            ->where('semester', $semester)
            ->whereNotNull('score')
            ->count();
        
        $totalPossibleMarks = $studentCount * $assessmentCount;
        
        return [
            'students' => $studentCount,
            'assessments' => $assessmentCount,
            'marks_entered' => $markCount,
            'total_possible' => $totalPossibleMarks,
            'completion_rate' => $totalPossibleMarks > 0 
                ? round(($markCount / $totalPossibleMarks) * 100, 2) 
                : 0,
        ];
    }

    public function update(Request $request)
    {
        $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'semester' => 'required|in:1,2',
            'status' => 'required|in:open,closed',
        ]);

        $currentYear = AcademicYear::whereRaw('is_current = true')->first();

        DB::transaction(function () use ($request, $currentYear) {
            // Update semester status
            SemesterStatus::updateOrCreate(
                [
                    'academic_year_id' => $currentYear->id,
                    'grade_id' => $request->grade_id,
                    'semester' => $request->semester,
                ],
                [
                    'status' => $request->status,
                ]
            );

            // Lock or unlock assessments and marks based on status
            if ($request->status === 'closed') {
                // Lock all assessments for this grade/semester
                Assessment::where('academic_year_id', $currentYear->id)
                    ->where('grade_id', $request->grade_id)
                    ->where('semester', $request->semester)
                    ->update([
                        'is_editable' => false,
                        'locked_at' => now(),
                    ]);

                // Lock all marks for this grade/semester
                Mark::where('academic_year_id', $currentYear->id)
                    ->where('grade_id', $request->grade_id)
                    ->where('semester', $request->semester)
                    ->update([
                        'is_locked' => true,
                        'locked_at' => now(),
                    ]);
            } else {
                // Unlock all assessments for this grade/semester
                Assessment::where('academic_year_id', $currentYear->id)
                    ->where('grade_id', $request->grade_id)
                    ->where('semester', $request->semester)
                    ->update([
                        'is_editable' => true,
                        'locked_at' => null,
                    ]);

                // Unlock all marks for this grade/semester
                Mark::where('academic_year_id', $currentYear->id)
                    ->where('grade_id', $request->grade_id)
                    ->where('semester', $request->semester)
                    ->update([
                        'is_locked' => false,
                        'locked_at' => null,
                    ]);
            }
        });

        $message = $request->status === 'closed' 
            ? 'Semester closed successfully. All assessments and marks are now locked.'
            : 'Semester opened successfully. Teachers can now enter/edit marks.';

        return back()->with('success', $message);
    }
}
