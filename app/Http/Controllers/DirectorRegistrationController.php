<?php

namespace App\Http\Controllers;

use App\Models\RegistrationPeriod;
use App\Models\AcademicYear;
use App\Models\Student;
use App\Models\Grade;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DirectorRegistrationController extends Controller
{
    /**
     * Get current registration status.
     */
    public function getStatus()
    {
        $currentYear = AcademicYear::whereRaw('is_current::boolean = TRUE')->first();
        $period = RegistrationPeriod::where('academic_year_id', $currentYear->id ?? 1)->first();

        $totalCapacity = 1500; // Mock - should be from settings or calculation
        $currentEnrollment = Student::count();
        $enrollmentPercentage = ($currentEnrollment / $totalCapacity) * 100;

        // Get enrollment by grade
        $gradeEnrollment = Grade::with(['students'])->get()->map(function ($grade) {
            $capacity = 350; // Mock - should be per-grade setting
            $enrolled = $grade->students->count();
            $percentage = $capacity > 0 ? ($enrolled / $capacity) * 100 : 0;

            return [
                'grade' => $grade->name,
                'enrolled' => $enrolled,
                'capacity' => $capacity,
                'percentage' => round($percentage, 2),
            ];
        });

        return Inertia::render('Director/Registration/Status', [
            'isOpen' => $period ? $period->isOpen() : false,
            'totalCapacity' => $totalCapacity,
            'currentEnrollment' => $currentEnrollment,
            'enrollmentPercentage' => round($enrollmentPercentage, 2),
            'pendingApplications' => 0, // Mock - integrate with actual applications
            'waitlist' => 0, // Mock - integrate with actual waitlist
            'gradeEnrollment' => $gradeEnrollment,
        ]);
    }

    /**
     * Toggle registration (open/close).
     */
    /**
     * Toggle registration (open/close).
     */
    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'status' => 'required|in:open,closed',
        ]);

        $currentYear = AcademicYear::whereRaw('is_current::boolean = TRUE')->firstOrFail();
        
        // Prevent closing if pending applications exist
        if ($validated['status'] === 'closed') {
            // Check for pending applications
            // Assuming AdmissionApplication model exists, otherwise placeholder
            $pendingCount = \App\Models\AdmissionApplication::where('status', 'pending')
                ->where('academic_year_id', $currentYear->id)
                ->count();
                
            if ($pendingCount > 0) {
                return back()->withErrors(['status' => "Cannot close registration. There are {$pendingCount} pending applications that must be processed first."]);
            }
        }

        $period = RegistrationPeriod::firstOrCreate(
            ['academic_year_id' => $currentYear->id],
            [
                'start_date' => now(),
                'end_date' => now()->addMonths(3),
                'status' => 'closed',
            ]
        );

        $period->update(['status' => $validated['status']]);

        // Audit Log
        \App\Services\AuditLogger::log(
            'REGISTRATION_STATUS_CHANGE',
            'ADMISSION',
            "Changed registration status to {$validated['status']} for Academic Year {$currentYear->name}",
            ['year_id' => $currentYear->id, 'new_status' => $validated['status']]
        );

        return redirect()->back()->with('success', 'Registration ' . ($validated['status'] === 'open' ? 'opened' : 'closed') . ' successfully');
    }

    /**
     * Get enrollment statistics.
     */
    public function getEnrollmentStats()
    {
        $stats = [
            'total' => Student::count(),
            'byGrade' => Grade::with(['students'])->get()->map(function ($grade) {
                return [
                    'grade' => $grade->name,
                    'count' => $grade->students->count(),
                ];
            }),
            'growth' => 5.8, // Mock - calculate actual year-over-year growth
        ];

        return response()->json($stats);
    }

    /**
     * Process pending applications (batch).
     */
    public function processApplications(Request $request)
    {
        // Implementation for batch approval/rejection
        // This is a placeholder
        return response()->json(['message' => 'Batch processing feature coming soon']);
    }
}
