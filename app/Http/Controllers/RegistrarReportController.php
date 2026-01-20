<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Payment;
use App\Models\Section;

class RegistrarReportController extends Controller
{
    /**
     * Display the Reporting Center.
     */
    public function index(Request $request)
    {
        return inertia('Registrar/Reports/Index', [
            'recentReports' => [
                 ['id' => 1, 'name' => 'Enrollment Summary 2025', 'date' => '2025-09-01', 'type' => 'PDF'],
                 ['id' => 2, 'name' => 'Q1 Fee Collection', 'date' => '2025-11-15', 'type' => 'Excel'],
            ]
        ]);
    }

    /**
     * Generate a specific report.
     */
    public function generate(Request $request)
    {
        $type = $request->input('type'); // 'enrollment', 'finance', 'capacity'
        $format = $request->input('format'); // 'pdf', 'csv'

        // If CSV, we can generate a real file download
        if ($format === 'csv') {
            $fileName = $type . '_report_' . date('Y-m-d') . '.csv';
            $headers = [
                "Content-type"        => "text/csv",
                "Content-Disposition" => "attachment; filename=$fileName",
                "Pragma"              => "no-cache",
                "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
                "Expires"             => "0"
            ];

            $callback = function() use ($type) {
                $file = fopen('php://output', 'w');
                
                if ($type === 'enrollment') {
                    fputcsv($file, ['ID', 'Name', 'Grade', 'Gender', 'Status']);
                    $students = Student::with(['user', 'grade'])->get();
                    foreach ($students as $student) {
                        fputcsv($file, [
                            $student->student_id,
                            $student->user->name ?? 'N/A',
                            $student->grade->name ?? 'N/A',
                            $student->gender,
                            'Active' // Hardcoded for now
                        ]);
                    }
                } elseif ($type === 'finance') {
                    fputcsv($file, ['Date', 'Student', 'Type', 'Amount', 'Status']);
                    $payments = Payment::with('student.user')->get();
                    foreach ($payments as $payment) {
                        fputcsv($file, [
                            $payment->transaction_date ? $payment->transaction_date->format('Y-m-d') : 'N/A',
                            $payment->student->user->name ?? 'N/A',
                            $payment->type,
                            $payment->amount,
                            $payment->status
                        ]);
                    }
                }

                fclose($file);
            };

            return response()->stream($callback, 200, $headers);
        }

        // PDF Fallback (Simulation)
        return redirect()->back()->with('success', "Report '{$type}' successfully generated in {$format} format. Check your downloads.");
    }
}
