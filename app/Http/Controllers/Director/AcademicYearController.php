<?php

namespace App\Http\Controllers\Director;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Grade;
use App\Models\SemesterStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AcademicYearController extends Controller
{
    /**
     * Display all academic years with semester information
     */
    public function index()
    {
        $currentYear = AcademicYear::whereRaw('is_current = true')
            ->with(['semesterStatuses.grade', 'semesterStatuses.academicYear'])
            ->first();

        if ($currentYear) {
            // Auto-initialize missing semester statuses for current year
            $currentYear->createDefaultSemesters();
            
            // Refresh the currentYear after creation to get all statuses
            $currentYear->load('semesterStatuses.grade');
            
            // Sync overall status
            $currentYear->update(['status' => $currentYear->getOverallStatus()]);
        }

        $pastYears = AcademicYear::whereRaw('is_current = false')
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
                'status' => $currentYear->status,
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

            $setAsCurrent = $request->boolean('set_as_current');

            // If setting as current, unset other current years
            if ($setAsCurrent) {
                AcademicYear::whereRaw('is_current = true')
                    ->update(['is_current' => DB::raw('false')]);
            }

            // Create the academic year
            $year = AcademicYear::create([
                'name' => $request->name,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'is_current' => DB::raw($setAsCurrent ? 'true' : 'false'),
                'status' => 'planned',
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
            AcademicYear::whereRaw('is_current = true')
                ->update(['is_current' => DB::raw('false')]);

            // Set the specified year as current
            $year = AcademicYear::findOrFail($id);
            $year->update(['is_current' => DB::raw('true')]);

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
    /**
     * Open or close a semester for all grades
     */
    public function toggleSemester(Request $request, \App\Services\ResultCalculationService $calculationService)
    {
        Log::info("toggleSemester called", $request->all());

        $request->validate([
            'semester' => 'required|in:1,2',
            'action' => 'required|in:open,close',
            'academic_year_id' => 'nullable|exists:academic_years,id',
        ]);

        $yearId = $request->input('academic_year_id');
        
        if ($yearId) {
            $year = AcademicYear::findOrFail($yearId);
        } else {
            $year = AcademicYear::whereRaw('is_current = true')->first();
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
            
            $message = $request->action === 'open' 
                ? "Semester {$request->semester} opened for {$year->name}."
                : "Semester {$request->semester} closed for {$year->name}.";

            // Clear Teacher Dashboard and global semester cache
            \Illuminate\Support\Facades\Cache::forget("current_semester_info_year_{$year->id}");
            \Illuminate\Support\Facades\Cache::forget('current_semester_info_global'); // Legacy key just in case

            // Update all semester statuses for this semester (Per Grade)
            // Use updateOrCreate to ensure missing records are created
            $grades = \App\Models\Grade::all();
            foreach ($grades as $grade) {
                SemesterStatus::updateOrCreate(
                    [
                        'academic_year_id' => $year->id,
                        'grade_id' => $grade->id,
                        'semester' => $request->semester,
                    ],
                    [
                        'status' => $newStatus,
                    ]
                );
            }

            // ALSO Update the Global SemesterPeriod (Used by Student Results)
            \App\Models\SemesterPeriod::updateOrCreate(
                [
                    'academic_year_id' => $year->id,
                    'semester' => $request->semester,
                ],
                [
                    'status' => $newStatus,
                    $newStatus . '_at' => now(),
                    $newStatus . '_by' => auth()->id(),
                ]
            );

            // If Status is updated to CLOSED
            if ($newStatus === 'closed') {
                // TRIGGER RESULT CALCULATION
                $calculationService->calculateSemesterResults($year->id, $request->semester);
                $message .= " Results calculated for Semester {$request->semester}.";

                if ($request->semester == 1) {
                    // AUTO-OPEN SEMESTER 2
                    SemesterStatus::where('academic_year_id', $year->id)
                        ->where('semester', 2)
                        ->update(['status' => 'open']);

                    // Sync Global SemesterPeriod for Sem 2
                    \App\Models\SemesterPeriod::updateOrCreate(
                        ['academic_year_id' => $year->id, 'semester' => 2],
                        ['status' => 'open', 'opened_at' => now(), 'opened_by' => auth()->id()]
                    );
                    
                    $message .= " Semester 2 has been automatically OPENED.";
                } 
                elseif ($request->semester == 2) {
                    // If Semester 2 closes, calculate FINAL results for the year
                    Log::info("S2 Closing - Triggering Final calculations for Year {$year->id}");
                    $calculationService->calculateFinalResults($year->id);
                    $message .= " Final Yearly Results calculated.";

                    Log::info("Year is_current status: " . ($year->is_current ? 'TRUE' : 'FALSE'));
                    if ($year->is_current) {
                        // AUTO-CREATE NEXT YEAR
                        Log::info("Triggering createNextAcademicYear");
                        $nextYear = $this->createNextAcademicYear($year);
                        if ($nextYear) {
                            $message .= " Next academic year '{$nextYear->name}' has been created and set as CURRENT with Semester 1 OPEN.";
                            Log::info("AUTO-PROGRESSED to Year: " . $nextYear->name);
                        } else {
                            Log::warning("createNextAcademicYear returned NULL (maybe next year name already exists?)");
                        }
                    }
                }
            }

            Log::info("Finalizing toggleSemester for year {$year->id}. Status=" . $year->getOverallStatus());

            // Update the year's status
            $year->update([
                'status' => $year->getOverallStatus(),
            ]);

            DB::commit();
            Log::info("Transaction Committed Successfully");

            return redirect()
                ->back()
                ->with('success', $message);

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("EXCEPTION in toggleSemester: " . $e->getMessage());
            Log::error($e->getTraceAsString());
            
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
                $newStartDate = $currentYear->start_date->copy()->addYear();
                $newEndDate = $currentYear->end_date->copy()->addYear();

                // Deactivate the previous academic year
                $currentYear->update(['is_current' => DB::raw('false')]);
                
                $nextYear = AcademicYear::create([
                    'name' => $nextName,
                    'start_date' => $newStartDate,
                    'end_date' => $newEndDate,
                    'is_current' => DB::raw('true'), // Make the new year current
                    'status' => 'active',  // It's starting now
                ]);
                
                // Create semester statuses logic
                // DEFAULT: S1 Open, S2 Closed for the new year
                $grades = Grade::all();
                Log::info("Creating default semesters for new year: " . $nextYear->name . " for " . $grades->count() . " grades");
                foreach ($grades as $grade) {
                    // Semester 1: OPEN
                    SemesterStatus::firstOrCreate([
                        'academic_year_id' => $nextYear->id,
                        'grade_id' => $grade->id,
                        'semester' => 1,
                    ], [
                        'status' => 'open' 
                    ]);
                    
                    // Semester 2: CLOSED
                    SemesterStatus::firstOrCreate([
                        'academic_year_id' => $nextYear->id,
                        'grade_id' => $grade->id,
                        'semester' => 2,
                    ], [
                        'status' => 'closed'
                    ]);
                }

                // --- AUTOMATIC STUDENT PROMOTION LOGIC ---
                Log::info("Starting Student Promotion for new year: " . $nextYear->name);
                
                // Get all students
                $students = \App\Models\Student::with(['grade', 'section'])->get();
                $promotedCount = 0;
                $stayedCount = 0;

                foreach ($students as $student) {
                    // Check performance in the year just closed
                    $finalResult = \App\Models\FinalResult::where('student_id', $student->id)
                        ->where('academic_year_id', $currentYear->id)
                        ->first();

                    $passedThreshold = $finalResult && $finalResult->combined_average >= 50;
                    
                    $oldGrade = $student->grade;
                    $newGradeId = $student->grade_id;
                    $newSectionId = $student->section_id;

                    if ($passedThreshold) {
                        // Find the next grade level
                        $nextGrade = Grade::where('level', $oldGrade->level + 1)->first();
                        
                        if ($nextGrade) {
                            $newGradeId = $nextGrade->id;
                            
                            // Attempt to find a matching section 'A' or 'B' in the new grade
                            $oldSectionName = $student->section?->name;
                            if ($oldSectionName) {
                                $matchingSection = \App\Models\Section::where('grade_id', $newGradeId)
                                    ->where('name', $oldSectionName)
                                    ->first();
                                
                                if ($matchingSection) {
                                    $newSectionId = $matchingSection->id;
                                } else {
                                    // Fallback to first section of new grade
                                    $newSectionId = \App\Models\Section::where('grade_id', $newGradeId)->first()?->id;
                                }
                            }
                            
                            $promotedCount++;
                        } else {
                            // Student completed final grade (e.g. Grade 12)
                            // We keep them in Grade 12 for now or could mark as graduated
                            $stayedCount++;
                        }
                    } else {
                        // Failed or no result - student repeats same grade
                        $stayedCount++;
                    }

                    // Update Student Profile
                    $student->update([
                        'grade_id' => $newGradeId,
                        'section_id' => $newSectionId
                    ]);

                    // Create New Registration Record for the New Academic Year
                    \App\Models\Registration::create([
                        'student_id' => $student->id,
                        'academic_year_id' => $nextYear->id,
                        'grade_id' => $newGradeId,
                        'section_id' => $newSectionId,
                        'registration_date' => now(),
                        'status' => 'active',
                    ]);
                }

                Log::info("Promotion complete: {$promotedCount} promoted, {$stayedCount} stayed/repeating.");

                // ALSO Create Global SemesterPeriod for the New Year
                // S1 Open
                \App\Models\SemesterPeriod::updateOrCreate([
                    'academic_year_id' => $nextYear->id,
                    'semester' => 1,
                ], [
                    'status' => 'open',
                    'opened_at' => now(),
                    'opened_by' => auth()->id()
                ]);

                // S2 Closed (Default)
                \App\Models\SemesterPeriod::updateOrCreate([
                    'academic_year_id' => $nextYear->id,
                    'semester' => 2,
                ], [
                    'status' => 'closed'
                ]);

                return $nextYear;
            }
        }
        return null;
    }
}
