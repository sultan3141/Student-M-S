<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Grade;
use App\Models\Registration;
use App\Models\RegistrationPeriod;
use App\Models\Section;
use App\Models\Student;
use App\Models\FinalResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RegistrarPromotionController extends Controller
{
    /**
     * Display a listing of students eligible for promotion.
     */
    public function index()
    {
        $status = RegistrationPeriod::getCurrentStatus();
        $currentYearId = AcademicYear::whereRaw('is_current = true')->value('id');

        $grades = Grade::with(['sections.students' => function($query) use ($currentYearId) {
            $query->with(['user', 'finalResults' => function($q) use ($currentYearId) {
                $q->where('academic_year_id', $currentYearId);
            }, 'registrations' => function($q) use ($currentYearId) {
                $q->where('academic_year_id', $currentYearId);
            }]);
        }])->orderBy('level')->get();

        // Format data for the frontend
        $formattedGrades = $grades->map(function ($grade) {
            return [
                'id' => $grade->id,
                'name' => $grade->name,
                'level' => $grade->level,
                'sections' => $grade->sections->map(function ($section) {
                    return [
                        'id' => $section->id,
                        'name' => $section->name,
                        'students' => $section->students->map(function ($student) {
                            $finalResult = $student->finalResults->first();
                            $average = $finalResult ? $finalResult->combined_average : 0;
                            
                            // A student is considered promoted if they have a registration record 
                            // for the current target year specifying their NEW grade.
                            // But usually, the simple fact of having a registration record is enough.
                            $isAlreadyPromoted = $student->registrations->isNotEmpty();
                            
                            return [
                                'id' => $student->id,
                                'name' => $student->user->name,
                                'student_id' => $student->student_id,
                                'average' => (float)$average,
                                'is_eligible' => $average >= 50,
                                'is_promoted' => $isAlreadyPromoted,
                            ];
                        })
                    ];
                })
            ];
        });

        return Inertia::render('Registrar/Promotion/Index', [
            'grades' => $formattedGrades,
            'registrationStatus' => $status,
        ]);
    }

    /**
     * Check current registration status.
     */
    public function checkStatus()
    {
        return response()->json(RegistrationPeriod::getCurrentStatus());
    }

    /**
     * Promote a single student.
     */
    public function promote(Request $request, Student $student)
    {
        $status = RegistrationPeriod::getCurrentStatus();
        
        if (!$status['is_open']) {
            return back()->with('error', 'Registration is currently closed by the Director.');
        }

        // Eligibility check
        $currentYearId = $status['academic_year']?->id;
        $finalResult = FinalResult::where('student_id', $student->id)
            ->where('academic_year_id', $currentYearId)
            ->first();

        if (!$finalResult || $finalResult->combined_average < 50) {
            return back()->with('error', 'Student is not eligible for promotion due to failing or missing grades.');
        }

        // Find next grade
        $nextGrade = Grade::where('level', $student->grade->level + 1)->first();
        if (!$nextGrade) {
            return back()->with('error', 'No next grade level found. Student might be in the final grade.');
        }

        // Find section with same name in next grade
        $currentSectionName = $student->section->name;
        $nextSection = Section::where('grade_id', $nextGrade->id)
            ->where('name', $currentSectionName)
            ->first();

        // Start transaction
        try {
            DB::beginTransaction();

            // Update student placement
            $student->update([
                'grade_id' => $nextGrade->id,
                'section_id' => $nextSection ? $nextSection->id : null,
            ]);

            // Create registration record for next year (or current 'open' year)
            // Note: Registration status refers to the ability to register for the UPCOMING period usually.
            // But here the Director toggles "Registration is OPEN".
            Registration::create([
                'student_id' => $student->id,
                'academic_year_id' => $currentYearId, // Or should it be the NEXT year? 
                // Usually promotion happens at the end of a year FOR the next year.
                // Assuming getCurrentStatus returns the year for which registration is open.
                'grade_id' => $nextGrade->id,
                'section_id' => $nextSection ? $nextSection->id : null,
                'registration_date' => now(),
                'status' => 'completed',
            ]);

            DB::commit();
            return back()->with('success', "Student {$student->user->name} promoted to {$nextGrade->name} successfully.");

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Promotion failed: ' . $e->getMessage());
        }
    }
}
