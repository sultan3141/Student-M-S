<?php

namespace App\Http\Controllers;

use App\Models\SemesterPeriod;
use App\Models\AcademicYear;
use App\Models\Assessment;
use App\Models\Mark;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DirectorSemesterController extends Controller
{
    public function index()
    {
        $currentAcademicYear = AcademicYear::where('is_current', true)->first();
        
        if (!$currentAcademicYear) {
            return redirect()->route('director.dashboard')
                ->with('error', 'No active academic year found.');
        }

        // Get or create semester periods for current academic year
        $semesters = [];
        for ($i = 1; $i <= 2; $i++) {
            $semester = SemesterPeriod::firstOrCreate(
                [
                    'academic_year_id' => $currentAcademicYear->id,
                    'semester' => $i
                ],
                [
                    'status' => 'closed'
                ]
            );
            
            $semesters[] = [
                'id' => $semester->id,
                'semester' => $semester->semester,
                'status' => $semester->status,
                'opened_at' => $semester->opened_at,
                'closed_at' => $semester->closed_at,
                'opened_by' => $semester->openedByUser?->name,
                'closed_by' => $semester->closedByUser?->name,
            ];
        }

        return Inertia::render('Director/Semester/Index', [
            'academicYear' => $currentAcademicYear,
            'semesters' => $semesters,
        ]);
    }

    public function open(Request $request)
    {
        $request->validate([
            'semester_period_id' => 'required|exists:semester_periods,id',
        ]);

        DB::beginTransaction();
        try {
            $semesterPeriod = SemesterPeriod::findOrFail($request->semester_period_id);
            
            // Check if another semester is already open for this academic year
            $openSemester = SemesterPeriod::where('academic_year_id', $semesterPeriod->academic_year_id)
                ->where('status', 'open')
                ->where('id', '!=', $semesterPeriod->id)
                ->first();
            
            if ($openSemester) {
                return back()->withErrors([
                    'error' => "Semester {$openSemester->semester} is already open. Please close it first."
                ]);
            }

            // Check if trying to open Semester 2 while Semester 1 is not closed
            if ($semesterPeriod->semester == 2) {
                $semester1 = SemesterPeriod::where('academic_year_id', $semesterPeriod->academic_year_id)
                    ->where('semester', 1)
                    ->first();
                
                if ($semester1 && $semester1->status !== 'closed') {
                    return back()->withErrors([
                        'error' => 'Semester 1 must be closed before opening Semester 2.'
                    ]);
                }
            }

            // Open the semester
            $semesterPeriod->update([
                'status' => 'open',
                'opened_at' => now(),
                'opened_by' => auth()->id(),
            ]);

            // Unlock all assessments and marks for this semester
            Assessment::where('academic_year_id', $semesterPeriod->academic_year_id)
                ->where('semester', $semesterPeriod->semester)
                ->update([
                    'is_editable' => true,
                    'locked_at' => null,
                ]);

            Mark::where('academic_year_id', $semesterPeriod->academic_year_id)
                ->where('semester', $semesterPeriod->semester)
                ->update([
                    'is_locked' => false,
                    'locked_at' => null,
                ]);

            DB::commit();

            return redirect()->route('director.semesters.index')
                ->with('success', "Semester {$semesterPeriod->semester} has been opened for result entry.");

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to open semester: ' . $e->getMessage()]);
        }
    }

    public function close(Request $request)
    {
        $request->validate([
            'semester_period_id' => 'required|exists:semester_periods,id',
        ]);

        DB::beginTransaction();
        try {
            $semesterPeriod = SemesterPeriod::findOrFail($request->semester_period_id);
            
            // Check if there are any results entered
            $marksCount = Mark::where('academic_year_id', $semesterPeriod->academic_year_id)
                ->where('semester', $semesterPeriod->semester)
                ->count();
            
            if ($marksCount === 0) {
                return back()->withErrors([
                    'error' => 'Cannot close semester with no results entered.'
                ]);
            }

            // Close the semester
            $semesterPeriod->update([
                'status' => 'closed',
                'closed_at' => now(),
                'closed_by' => auth()->id(),
            ]);

            // Lock all assessments and marks for this semester
            Assessment::where('academic_year_id', $semesterPeriod->academic_year_id)
                ->where('semester', $semesterPeriod->semester)
                ->update([
                    'is_editable' => false,
                    'locked_at' => now(),
                ]);

            Mark::where('academic_year_id', $semesterPeriod->academic_year_id)
                ->where('semester', $semesterPeriod->semester)
                ->update([
                    'is_locked' => true,
                    'locked_at' => now(),
                ]);

            // If this is Semester 2, mark academic year as completed and create next year
            if ($semesterPeriod->semester == 2) {
                $currentYear = AcademicYear::find($semesterPeriod->academic_year_id);
                
                // Mark current year as completed
                $currentYear->update([
                    'is_current' => false,
                    'status' => 'completed',
                ]);

                // Automatically create next academic year
                $this->createNextAcademicYear($currentYear);
            }

            DB::commit();

            $message = "Semester {$semesterPeriod->semester} has been closed. Results are now visible to students.";
            
            if ($semesterPeriod->semester == 2) {
                $message .= " Academic year completed. Next year has been automatically created.";
            }

            return redirect()->route('director.semesters.index')
                ->with('success', $message);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to close semester: ' . $e->getMessage()]);
        }
    }

    /**
     * Automatically create next academic year when S2 closes
     */
    private function createNextAcademicYear($currentYear)
    {
        // Parse current year name (e.g., "2024-2025")
        $years = explode('-', $currentYear->name);
        $nextStartYear = (int)$years[1];
        $nextEndYear = $nextStartYear + 1;
        $nextYearName = "{$nextStartYear}-{$nextEndYear}";

        // Calculate dates (start from July 1st of next year)
        $startDate = \Carbon\Carbon::create($nextStartYear, 7, 1);
        $endDate = \Carbon\Carbon::create($nextEndYear, 6, 30);

        // Create new academic year
        $newYear = AcademicYear::create([
            'name' => $nextYearName,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'is_current' => true,
            'status' => 'active',
        ]);

        // Automatically create 2 semesters for the new year
        // Semester 1: OPEN (ready for immediate use)
        SemesterPeriod::create([
            'academic_year_id' => $newYear->id,
            'semester' => 1,
            'status' => 'open',
            'opened_at' => now(),
            'opened_by' => auth()->id(),
        ]);

        // Semester 2: CLOSED (waiting for S1 to complete)
        SemesterPeriod::create([
            'academic_year_id' => $newYear->id,
            'semester' => 2,
            'status' => 'closed',
        ]);

        return $newYear;
    }

    public function reopen(Request $request)
    {
        $request->validate([
            'semester_period_id' => 'required|exists:semester_periods,id',
        ]);

        DB::beginTransaction();
        try {
            $semesterPeriod = SemesterPeriod::findOrFail($request->semester_period_id);
            
            // Check if another semester is already open
            $openSemester = SemesterPeriod::where('academic_year_id', $semesterPeriod->academic_year_id)
                ->where('status', 'open')
                ->where('id', '!=', $semesterPeriod->id)
                ->first();
            
            if ($openSemester) {
                return back()->withErrors([
                    'error' => "Semester {$openSemester->semester} is already open. Please close it first."
                ]);
            }

            // Reopen the semester
            $semesterPeriod->update([
                'status' => 'open',
                'opened_at' => now(),
                'opened_by' => auth()->id(),
                'closed_at' => null,
                'closed_by' => null,
            ]);

            // Unlock all assessments and marks for this semester
            Assessment::where('academic_year_id', $semesterPeriod->academic_year_id)
                ->where('semester', $semesterPeriod->semester)
                ->update([
                    'is_editable' => true,
                    'locked_at' => null,
                ]);

            Mark::where('academic_year_id', $semesterPeriod->academic_year_id)
                ->where('semester', $semesterPeriod->semester)
                ->update([
                    'is_locked' => false,
                    'locked_at' => null,
                ]);

            DB::commit();

            return redirect()->route('director.semesters.index')
                ->with('success', "Semester {$semesterPeriod->semester} has been reopened for editing.");

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to reopen semester: ' . $e->getMessage()]);
        }
    }

    public function status()
    {
        $currentAcademicYear = AcademicYear::where('is_current', true)->first();
        
        if (!$currentAcademicYear) {
            return response()->json(['error' => 'No active academic year'], 404);
        }

        $semesters = SemesterPeriod::where('academic_year_id', $currentAcademicYear->id)
            ->get()
            ->map(function ($semester) {
                return [
                    'semester' => $semester->semester,
                    'status' => $semester->status,
                    'is_open' => $semester->isOpen(),
                    'is_closed' => $semester->isClosed(),
                ];
            });

        return response()->json([
            'academic_year' => $currentAcademicYear->name,
            'semesters' => $semesters,
        ]);
    }
}
