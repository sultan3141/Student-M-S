<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Payment;
use App\Models\Section;
use App\Models\Grade;
use App\Models\ParentProfile;
use App\Models\AcademicYear;
use App\Models\Mark;
use Carbon\Carbon;

class RegistrarReportController extends Controller
{
    /**
     * Display the Reporting Center.
     */
    public function index(Request $request)
    {
        // Get summary statistics for dashboard
        $stats = $this->getReportingStats();
        
        // Get recent reports (mock data for now)
        $recentReports = [
            ['id' => 1, 'name' => 'Student Enrollment Report', 'date' => Carbon::now()->subDays(2)->format('Y-m-d'), 'type' => 'PDF', 'size' => '2.3 MB'],
            ['id' => 2, 'name' => 'Fee Collection Summary', 'date' => Carbon::now()->subDays(5)->format('Y-m-d'), 'type' => 'Excel', 'size' => '1.8 MB'],
            ['id' => 3, 'name' => 'Grade Distribution Report', 'date' => Carbon::now()->subWeek()->format('Y-m-d'), 'type' => 'PDF', 'size' => '1.2 MB'],
            ['id' => 4, 'name' => 'Parent Contact List', 'date' => Carbon::now()->subWeeks(2)->format('Y-m-d'), 'type' => 'CSV', 'size' => '0.5 MB'],
        ];

        return inertia('Registrar/Reports/Index', [
            'stats' => $stats,
            'recentReports' => $recentReports,
            'grades' => Grade::select('id', 'name')->orderBy('level')->get(),
            'academicYears' => AcademicYear::select('id', 'name')->orderBy('created_at', 'desc')->get(),
        ]);
    }

    /**
     * Get reporting statistics for dashboard
     */
    private function getReportingStats()
    {
        return [
            'total_students' => Student::count(),
            'total_parents' => ParentProfile::count(),
            'total_grades' => Grade::count(),
            'students_with_parents' => Student::whereHas('parents')->count(),
            'students_without_parents' => Student::whereDoesntHave('parents')->count(),
            'total_payments' => Payment::count(),
            'pending_payments' => Payment::where('status', 'Pending')->count(),
            'completed_payments' => Payment::where('status', 'Paid')->count(),
            'total_marks' => Mark::count(),
            'current_academic_year' => AcademicYear::whereRaw('is_current = true')->first()?->name ?? 'Not Set',
        ];
    }

    /**
     * Generate a specific report.
     */
    public function generate(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:enrollment,finance,grades,parents,academic,attendance',
            'format' => 'required|in:pdf,csv,excel',
            'grade_id' => 'nullable|exists:grades,id',
            'academic_year_id' => 'nullable|exists:academic_years,id',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
        ]);

        $type = $validated['type'];
        $format = $validated['format'];

        // Excel format is handled as CSV with BOM for compatibility
        if ($format === 'excel' || $format === 'csv') {
            return $this->generateCSVReport($type, $validated, $format === 'excel');
        }

        // PDF Generation
        if ($format === 'pdf') {
            return $this->generatePDFReport($type, $validated);
        }

        return redirect()->back()->with('error', 'Unsupported format selected.');
    }

    /**
     * Generate PDF Report
     */
    private function generatePDFReport($type, $filters)
    {
        $data = $this->getReportData($type, $filters);
        
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('reports.generic', [
            'title' => $this->getReportName($type),
            'headers' => $data['headers'],
            'rows' => $data['rows'],
            'academicYear' => AcademicYear::whereRaw('is_current = true')->first()?->name ?? 'Current',
        ]);
        
        try {
            $filename = $type . '_report_' . date('Y-m-d_H-i-s') . '.pdf';
            return $pdf->download($filename);
        } catch (\Exception $e) {
            \Log::error('PDF Generation Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to generate PDF report: ' . $e->getMessage());
        }
    }

    /**
     * Generate CSV/Excel Report
     */
    private function generateCSVReport($type, $filters, $isExcel = false)
    {
        $data = $this->getReportData($type, $filters);
        $headers = $data['headers'];
        $rows = $data['rows'];

        $extension = $isExcel ? '.xls' : '.csv'; // Using .xls for Excel format to satisfy user expectation
        $fileName = $type . '_report_' . date('Y-m-d_H-i-s') . $extension;
        
        $contentType = $isExcel ? "application/vnd.ms-excel" : "text/csv";
        
        $httpHeaders = [
            "Content-type" => "$contentType; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function() use ($headers, $rows, $isExcel) {
            $file = fopen('php://output', 'w');
            
            // Add BOM for Excel compatibility
            if ($isExcel) {
                fputs($file, "\xEF\xBB\xBF");
            }
            
            fputcsv($file, $headers);
            
            foreach ($rows as $row) {
                fputcsv($file, $row);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $httpHeaders);
    }

    /**
     * Get Report Data (Headers and Rows)
     */
    private function getReportData($type, $filters)
    {
        switch ($type) {
            case 'enrollment':
                return $this->getEnrollmentData($filters);
            case 'finance':
                return $this->getFinanceData($filters);
            case 'grades':
                return $this->getGradesData($filters);
            case 'parents':
                return $this->getParentsData($filters);
            case 'academic':
                return $this->getAcademicData($filters);
            case 'attendance':
                return $this->getAttendanceData($filters);
            default:
                return ['headers' => [], 'rows' => []];
        }
    }

    private function getEnrollmentData($filters) 
    {
        $headers = ['Student ID', 'Name', 'Grade', 'Section', 'Gender', 'Reg Date'];
        
        $query = Student::with(['user', 'grade', 'section']);
        if (!empty($filters['grade_id'])) $query->where('grade_id', $filters['grade_id']);
        $students = $query->orderBy('student_id')->get();

        $rows = $students->map(function($student) {
            return [
                 $student->student_id,
                 $student->user->name ?? 'N/A',
                 $student->grade->name ?? 'N/A',
                 $student->section->name ?? 'N/A',
                 $student->gender ?? 'N/A',
                 $student->created_at->format('Y-m-d'),
            ];
        });

        return ['headers' => $headers, 'rows' => $rows];
    }

    private function getFinanceData($filters)
    {
        $headers = ['Payment ID', 'Student', 'Type', 'Amount', 'Status', 'Date'];
        
        $query = Payment::with('student.user');
        if (!empty($filters['date_from'])) $query->whereDate('transaction_date', '>=', $filters['date_from']);
        if (!empty($filters['date_to'])) $query->whereDate('transaction_date', '<=', $filters['date_to']);
        $payments = $query->orderBy('transaction_date', 'desc')->get();

        $rows = $payments->map(function($payment) {
            return [
                $payment->id,
                $payment->student->user->name ?? 'N/A',
                $payment->type,
                number_format($payment->amount, 2),
                $payment->status,
                $payment->transaction_date ? $payment->transaction_date->format('Y-m-d') : 'N/A',
            ];
        });

        return ['headers' => $headers, 'rows' => $rows];
    }

    private function getGradesData($filters)
    {
        $headers = ['Grade', 'Total', 'Male', 'Female'];
        
        $grades = Grade::withCount([
            'students',
            'students as male_count' => function($query) { $query->where('gender', 'Male'); },
            'students as female_count' => function($query) { $query->where('gender', 'Female'); }
        ])->orderBy('level')->get();

        $rows = $grades->map(function($grade) {
            return [
                $grade->name,
                $grade->students_count,
                $grade->male_count,
                $grade->female_count,
            ];
        });

        return ['headers' => $headers, 'rows' => $rows];
    }

    private function getParentsData($filters)
    {
        $headers = ['Name', 'Email', 'Phone', 'Children Count'];
        
        $parents = ParentProfile::with(['user', 'students'])->get();

        $rows = $parents->map(function($parent) {
            return [
                $parent->user->name ?? 'N/A',
                $parent->user->email ?? 'N/A',
                $parent->phone ?? 'N/A',
                $parent->students->count(),
            ];
        });

        return ['headers' => $headers, 'rows' => $rows];
    }

    private function getAcademicData($filters)
    {
        $headers = ['Student', 'Grade', 'Total Marks', 'Average'];
        
        $query = Student::with(['user', 'grade', 'marks']);
        if (!empty($filters['grade_id'])) $query->where('grade_id', $filters['grade_id']);
        $students = $query->get();

        $rows = $students->map(function($student) {
            $avg = $student->marks->count() > 0 ? round($student->marks->avg('score'), 2) : 0;
            return [
                $student->user->name ?? 'N/A',
                $student->grade->name ?? 'N/A',
                $student->marks->count(),
                $avg,
            ];
        });

        return ['headers' => $headers, 'rows' => $rows];
    }

    private function getAttendanceData($filters)
    {
        $headers = ['Student', 'Grade', 'Attendance Rate'];
        
        $query = Student::with(['user', 'grade']);
        if (!empty($filters['grade_id'])) $query->where('grade_id', $filters['grade_id']);
        $students = $query->get();

        $rows = $students->map(function($student) {
             // Mock logic
             return [
                 $student->user->name ?? 'N/A',
                 $student->grade->name ?? 'N/A',
                 rand(80, 100) . '%',
             ];
        });

        return ['headers' => $headers, 'rows' => $rows];
    }

    /**
     * Get human-readable report name
     */
    private function getReportName($type)
    {
        $names = [
            'enrollment' => 'Student Enrollment Report',
            'finance' => 'Financial Report',
            'grades' => 'Grade Distribution Report',
            'parents' => 'Parent Contact Report',
            'academic' => 'Academic Performance Report',
            'attendance' => 'Attendance Report',
        ];

        return $names[$type] ?? 'Unknown Report';
    }
}
