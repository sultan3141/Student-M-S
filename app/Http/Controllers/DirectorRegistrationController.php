<?php

namespace App\Http\Controllers;

use App\Models\RegistrationPeriod;
use App\Models\AcademicYear;
use App\Models\Student;
use App\Models\Grade;
use App\Exports\RegistrationExport;
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

        // Get registration report data
        $registrations = \App\Models\Registration::with(['student.user', 'student.grade', 'academicYear'])
            ->where('academic_year_id', $currentYear->id ?? 1)
            ->get();

        $reportData = [
            'totalRegistrations' => $registrations->count(),
            'completedRegistrations' => $registrations->where('status', 'completed')->count(),
            'pendingRegistrations' => $registrations->where('status', 'pending')->count(),
            'rejectedRegistrations' => $registrations->where('status', 'rejected')->count(),
            'registrationsByGrade' => $registrations->groupBy('student.grade.name')->map(function ($group) {
                return $group->count();
            })->toArray(),
            'recentRegistrations' => $registrations->sortByDesc('created_at')->take(10)->map(function ($reg) {
                return [
                    'id' => $reg->id,
                    'studentName' => $reg->student->user->name ?? 'N/A',
                    'studentId' => $reg->student->student_id,
                    'grade' => $reg->student->grade->name ?? 'N/A',
                    'status' => $reg->status,
                    'createdAt' => $reg->created_at->format('M d, Y'),
                ];
            })->values(),
        ];

        return Inertia::render('Director/Registration/Status', [
            'isOpen' => $period ? $period->isOpen() : false,
            'totalCapacity' => $totalCapacity,
            'currentEnrollment' => $currentEnrollment,
            'enrollmentPercentage' => round($enrollmentPercentage, 2),
            'pendingApplications' => 0, // Mock - integrate with actual applications
            'waitlist' => 0, // Mock - integrate with actual waitlist
            'gradeEnrollment' => $gradeEnrollment,
            'reportData' => $reportData,
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

    /**
     * Export registration report to Excel.
     */
    public function exportExcel()
    {
        try {
            $currentYear = AcademicYear::whereRaw('is_current::boolean = TRUE')->first();
            
            $registrations = \App\Models\Registration::with(['student.user', 'student.grade', 'academicYear'])
                ->where('academic_year_id', $currentYear->id ?? 1)
                ->get();

            $fileName = 'Registration_Report_' . now()->format('Y-m-d_H-i-s') . '.xlsx';
            
            // Use Excel facade if available
            if (class_exists('Maatwebsite\Excel\Facades\Excel')) {
                return \Maatwebsite\Excel\Facades\Excel::download(
                    new RegistrationExport($registrations),
                    $fileName
                );
            } else {
                // Fallback: Generate CSV instead
                return $this->exportCsv($registrations, $fileName);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Export failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Export registration report to PDF.
     */
    public function exportPdf()
    {
        try {
            $currentYear = AcademicYear::whereRaw('is_current::boolean = TRUE')->first();
            
            $registrations = \App\Models\Registration::with(['student.user', 'student.grade', 'academicYear'])
                ->where('academic_year_id', $currentYear->id ?? 1)
                ->get();

            $stats = [
                'totalRegistrations' => $registrations->count(),
                'completedRegistrations' => $registrations->where('status', 'completed')->count(),
                'pendingRegistrations' => $registrations->where('status', 'pending')->count(),
                'rejectedRegistrations' => $registrations->where('status', 'rejected')->count(),
            ];

            // Use PDF facade if available
            if (class_exists('Barryvdh\DomPDF\Facade\Pdf')) {
                $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('reports.registration', [
                    'registrations' => $registrations,
                    'stats' => $stats,
                    'academicYear' => $currentYear,
                ]);

                return $pdf->download('Registration_Report_' . now()->format('Y-m-d_H-i-s') . '.pdf');
            } else {
                // Fallback: Return HTML view
                return view('reports.registration', [
                    'registrations' => $registrations,
                    'stats' => $stats,
                    'academicYear' => $currentYear,
                ]);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Export failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Fallback CSV export method.
     */
    private function exportCsv($registrations, $fileName)
    {
        $csvFileName = str_replace('.xlsx', '.csv', $fileName);
        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => "attachment; filename=\"$csvFileName\"",
        ];

        $callback = function () use ($registrations) {
            $file = fopen('php://output', 'w');
            
            // Write header
            fputcsv($file, ['Student Name', 'Student ID', 'Grade', 'Status', 'Registration Date', 'Academic Year']);
            
            // Write data
            foreach ($registrations as $registration) {
                fputcsv($file, [
                    $registration->student->user->name ?? 'N/A',
                    $registration->student->student_id,
                    $registration->student->grade->name ?? 'N/A',
                    ucfirst($registration->status),
                    $registration->created_at->format('M d, Y'),
                    $registration->academicYear->name ?? 'N/A',
                ]);
            }
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
