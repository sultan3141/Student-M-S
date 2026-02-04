<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Grade;
use App\Models\SemesterStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AcademicYearController extends Controller
{
    /**
     * Display all academic years with semester information
     */
    public function index()
    {
        $currentYear = AcademicYear::where('is_current', true)
            ->with('semesterStatuses.grade')
            ->first();

        $pastYears = AcademicYear::where('is_current', false)
            ->orderBy('start_date', 'desc')
            ->with('semesterStatuses')
            ->get()
            ->map(function ($year) {
                // Map semester statuses for this year
                $semesterData = $year->semesterStatuses->map(function ($status) {
                    return [
                        'semester' => $status->semester,
                        'status' => $status->status,
                    ];
                });

                return [
                    'id' => $year->id,
                    'name' => $year->name,
                    'start_date' => $year->start_date->format('M d, Y'),
                    'end_date' => $year->end_date->format('M d, Y'),
                    'status' => $year->getOverallStatus(),
                    'semester_count' => $year->semesterStatuses->count(),
                    'semesterStatuses' => $semesterData, // Pass the mapped data
                ];
            });

        // Get semester details for current year
        $semesterDetails = [];
        if ($currentYear) {
            // Group by semester
            foreach ([1, 2] as $sem) {
                $statuses = $currentYear->semesterStatuses
                    ->where('semester', $sem);

                $openCount = $statuses->where('status', 'open')->count();
                $closedCount = $statuses->where('status', 'closed')->count();
                $totalCount = $statuses->count();

                $overallStatus = $openCount > 0 ? 'open' : 'closed';

                $semesterDetails[$sem] = [
                    'semester' => $sem,
                    'status' => $overallStatus,
                    'open_count' => $openCount,
                    'closed_count' => $closedCount,
                    'total_count' => $totalCount,
                    'can_open' => $currentYear->canOpenSemester($sem),
                ];
            }
        }

        return Inertia::render('Director/AcademicYears/Index', [
            'currentYear' => $currentYear ? [
                'id' => $currentYear->id,
                'name' => $currentYear->name,
                'start_date' => $currentYear->start_date->format('M d, Y'),
                'end_date' => $currentYear->end_date->format('M d, Y'),
                'status' => $currentYear->getOverallStatus(),
                'semesters' => $semesterDetails,
            ] : null,
            'pastYears' => $pastYears,
        ]);
    }

    /**
     * Create a new academic year
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:academic_years,name',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'set_as_current' => 'boolean',
        ]);

        try {
            DB::beginTransaction();

            // If setting as current, unset other current years
            if ($request->set_as_current) {
                AcademicYear::where('is_current', true)
                    ->update(['is_current' => false]);
            }

            // Create the academic year
            $year = AcademicYear::create([
                'name' => $request->name,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'is_current' => $request->set_as_current ?? false,
                'status' => 'upcoming',
            ]);

            // Create semester statuses for all grades (both closed by default)
            $year->createDefaultSemesters();

            DB::commit();

            return redirect()
                ->route('director.academic-years.index')
                ->with('success', "Academic Year '{$year->name}' created successfully with 2 semesters.");

        } catch (\Exception $e) {
            DB::rollBack();
            
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to create academic year: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Set a specific year as the current year
     */
    public function setCurrent($id)
    {
        try {
            DB::beginTransaction();

            // Unset all current years
            AcademicYear::where('is_current', true)
                ->update(['is_current' => false]);

            // Set the specified year as current
            $year = AcademicYear::findOrFail($id);
            $year->update(['is_current' => true]);

            DB::commit();

            return redirect()
                ->route('director.academic-years.index')
                ->with('success', "Academic Year '{$year->name}' is now the current year.");

        } catch (\Exception $e) {
            DB::rollBack();
            
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to set current year: ' . $e->getMessage()]);
        }
    }

    /**
     * Get semester status details for a specific year
     */
    public function getSemesterStatus($yearId)
    {
        $year = AcademicYear::with('semesterStatuses.grade')
            ->findOrFail($yearId);

        $semesterData = [];
        foreach ([1, 2] as $sem) {
            $statuses = $year->semesterStatuses
                ->where('semester', $sem);

            $semesterData[$sem] = [
                'semester' => $sem,
                'grades' => $statuses->map(function ($status) {
                    return [
                        'grade_name' => $status->grade->name,
                        'status' => $status->status,
                    ];
                }),
                'can_open' => $year->canOpenSemester($sem),
            ];
        }

        return response()->json([
            'year' => $year->name,
            'semesters' => $semesterData,
        ]);
    }

    /**
     * Open or close a semester for all grades
     */
    public function toggleSemester(Request $request)
    {
        $request->validate([
            'semester' => 'required|in:1,2',
            'action' => 'required|in:open,close',
            'academic_year_id' => 'nullable|exists:academic_years,id',
        ]);

        $yearId = $request->input('academic_year_id');
        
        if ($yearId) {
            $year = AcademicYear::findOrFail($yearId);
        } else {
            $year = AcademicYear::where('is_current', true)->first();
        }

        if (!$year) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'No academic year found.']);
        }

        // Check if semester can be opened
        if ($request->action === 'open' && !$year->canOpenSemester($request->semester)) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Semester ' . $request->semester . ' cannot be opened yet. Please close Semester 1 first.']);
        }

        try {
            DB::beginTransaction();

            $newStatus = $request->action === 'open' ? 'open' : 'closed';

            // Update all semester statuses for this semester
            SemesterStatus::where('academic_year_id', $year->id)
                ->where('semester', $request->semester)
                ->update(['status' => $newStatus]);

            // If Update action is Close S2, and this is the current year, automatically create next year
            if ($request->action === 'close' && $request->semester == 2 && $year->is_current) {
                $this->createNextAcademicYear($year);
            }

            // Update the year's status
            $year->update([
                'status' => $year->getOverallStatus(),
            ]);

            DB::commit();

            $message = $request->action === 'open' 
                ? "Semester {$request->semester} opened for {$year->name}."
                : "Semester {$request->semester} closed for {$year->name}.";

            if ($request->action === 'close' && $request->semester == 2 && $year->is_current) {
                 $message .= " Next academic year has been created automatically.";
            }

            return redirect()
                ->back()
                ->with('success', $message);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to update semester: ' . $e->getMessage()]);
        }
    }

    /**
     * Automatically create the next academic year based on the current one.
     */
    private function createNextAcademicYear(AcademicYear $currentYear)
    {
        // Parse current name "2025-2026"
        $parts = explode('-', $currentYear->name);
        if (count($parts) === 2) {
            $startYear = (int)$parts[0];
            $endYear = (int)$parts[1];
            
            $nextName = ($startYear + 1) . '-' . ($endYear + 1);
            
            // Check if it already exists
            if (!AcademicYear::where('name', $nextName)->exists()) {
                
                // Calculate new dates (shift by 1 year)
                $newStartDate = $currentYear->start_date->addYear();
                $newEndDate = $currentYear->end_date->addYear();
                
                $nextYear = AcademicYear::create([
                    'name' => $nextName,
                    'start_date' => $newStartDate,
                    'end_date' => $newEndDate,
                    'is_current' => false, // Created as upcoming, Director must manually activate
                    'status' => 'upcoming',
                ]);
                
                $nextYear->createDefaultSemesters();
            }
        }
    }
}
