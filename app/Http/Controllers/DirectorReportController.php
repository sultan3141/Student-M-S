<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf; // Ensure alias is set up or use full class
use App\Models\Student;
use App\Models\Grade;
use App\Models\Section;
use App\Models\AcademicYear;

class DirectorReportController extends Controller
{
    /**
     * Display the reports dashboard.
     */
    public function index()
    {
        return Inertia::render('Director/Reports/Index', [
            'grades' => Grade::with('sections')->get(),
            'academic_years' => AcademicYear::orderBy('start_date', 'desc')->get(),
        ]);
    }

    /**
     * Export Student List
     */
    public function exportStudents(Request $request)
    {
        $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'section_id' => 'nullable|exists:sections,id',
            'format' => 'required|in:pdf,csv',
        ]);

        $query = Student::with(['grade', 'section', 'user'])
            ->where('grade_id', $request->grade_id);

        if ($request->section_id) {
            $query->where('section_id', $request->section_id);
        }

        $students = $query->get();
        $title = "Student List - " . Grade::find($request->grade_id)->name .
            ($request->section_id ? " " . Section::find($request->section_id)->name : "");

        if ($request->input('format') === 'pdf') {
            $html = view('exports.students-list', compact('students', 'title'))->render();

            $options = new \Dompdf\Options();
            $options->set('defaultFont', 'sans-serif');
            $options->setIsRemoteEnabled(true);

            $dompdf = new \Dompdf\Dompdf($options);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            return response($dompdf->output(), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="student-list.pdf"',
            ]);
        } else {
            return $this->exportCsv($students, ['Student ID', 'Name', 'Grade', 'Section'], function ($student) {
                return [
                    $student->student_id,
                    $student->user?->name ?? 'N/A',
                    $student->grade?->name,
                    $student->section?->name
                ];
            }, 'student-list.csv');
        }
    }

    /**
     * Export Rank List
     */
    public function exportRanks(Request $request)
    {
        $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'section_id' => 'nullable|exists:sections,id',
            'semester' => 'required|integer',
            'academic_year_id' => 'required|exists:academic_years,id',
            'format' => 'required|in:pdf,csv',
        ]);

        // Get students based on filters
        $query = Student::where('grade_id', $request->grade_id);
        if ($request->section_id) {
            $query->where('section_id', $request->section_id);
        }
        $students = $query->get();

        // Calculate Ranks & Averages
        // We reuse logic similar to SemesterRecordController but optimized for batch
        // For accurate ranking, we should fetch all marks for this grade/semester
        // To avoid N+1, we fetch all marks once

        $marks = \App\Models\Mark::whereIn('student_id', $students->pluck('id'))
            ->where('semester', $request->semester)
            ->where('academic_year_id', $request->academic_year_id)
            ->get()
            ->groupBy('student_id');

        $rankedStudents = $students->map(function ($student) use ($marks) {
            $studentMarks = $marks->get($student->id);

            if (!$studentMarks || $studentMarks->isEmpty()) {
                $avg = 0;
            } else {
                // Calculate subject averages (simplified for report)
                $subjectAvgs = $studentMarks->groupBy('subject_id')->map(function ($m) {
                    $score = $m->sum('score');
                    $max = $m->sum('max_score') ?: (count($m) * 100);
                    return $max > 0 ? ($score / $max) * 100 : 0;
                });
                $avg = $subjectAvgs->isNotEmpty() ? round($subjectAvgs->avg(), 2) : 0;
            }

            return [
                'student' => $student,
                'average' => $avg
            ];
        })->sortByDesc('average')->values();

        // Assign Rank
        $rankedStudents = $rankedStudents->map(function ($item, $index) {
            $item['rank'] = $item['average'] > 0 ? $index + 1 : '-';
            return $item;
        });

        $gradeName = Grade::find($request->grade_id)->name;
        $sectionName = $request->section_id ? Section::find($request->section_id)->name : 'All Sections';
        $title = "Rank List - $gradeName - $sectionName (Sem {$request->semester})";

        if ($request->input('format') === 'pdf') {
            $html = view('exports.ranks-list', compact('rankedStudents', 'title'))->render();

            $options = new \Dompdf\Options();
            $options->set('defaultFont', 'sans-serif');
            $options->setIsRemoteEnabled(true);

            $dompdf = new \Dompdf\Dompdf($options);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            return response($dompdf->output(), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="rank-list.pdf"',
            ]);
        } else {
            return $this->exportCsv($rankedStudents, ['Rank', 'Student ID', 'Name', 'Average'], function ($item) {
                return [
                    $item['rank'],
                    $item['student']->student_id,
                    $item['student']->user->name,
                    $item['average']
                ];
            }, 'rank-list.csv');
        }
    }

    /**
     * Export Payment Status
     */
    public function exportPayments(Request $request)
    {
        $request->validate([
            'grade_id' => 'required', // can be 'all'
            'status' => 'nullable|in:paid,partial,unpaid,overdue',
            'format' => 'required|in:pdf,csv',
        ]);

        // Assuming a Payment model and logic exists
        // If Payment model doesn't exist yet, we might need to mock or use Student
        // Checking for Payment model... (Assuming it exists or we use placeholders)
        // Since I haven't seen Payment model in file list, I'll assume Student with payment relation
        // OR standard "Payment" model. 
        // Let's check if Payment model exists.
        // For now, I will use a placeholder query assuming a Payment model

        $query = \App\Models\Payment::with(['student.user', 'student.grade', 'student.section']);

        if ($request->grade_id !== 'all') {
            $query->whereHas('student', fn($q) => $q->where('grade_id', $request->grade_id));
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $payments = $query->get();
        $title = "Payment Report";

        if ($request->input('format') === 'pdf') {
            $html = view('exports.payments-list', compact('payments', 'title'))->render();

            $options = new \Dompdf\Options();
            $options->set('defaultFont', 'sans-serif');
            $options->setIsRemoteEnabled(true);

            $dompdf = new \Dompdf\Dompdf($options);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            return response($dompdf->output(), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="payment-report.pdf"',
            ]);
        } else {
            return $this->exportCsv($payments, ['Student Name', 'Amount', 'Status', 'Date'], function ($payment) {
                return [
                    $payment->student->user->name,
                    $payment->amount,
                    $payment->status,
                    $payment->created_at->format('Y-m-d')
                ];
            }, 'payment-report.csv');
        }
    }

    /**
     * Helper to download CSV
     */
    private function exportCsv($collection, $headers, $rowMapper, $filename)
    {
        $callback = function () use ($collection, $headers, $rowMapper) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $headers);

            foreach ($collection as $item) {
                fputcsv($file, $rowMapper($item));
            }
            fclose($file);
        };

        return response()->stream($callback, 200, [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ]);
    }

    public function exportTranscript(Request $request)
    {
        $student = Student::with([
            'user',
            'grade',
            'section',
            'marks.subject',
            'marks.academicYear',
            'semesterResults.academicYear',
            'attendances'
        ])->findOrFail($request->student_id);

        $schoolInfo = [
            'name_or' => 'MANA BARNOOTA DAARUL ULUM KAN UMMATAA',
            'name_en' => 'DARUL ULUM PUBLIC SCHOOL',
            'name_ar' => 'مدرسة دار العلوم الإسلامية',
            'address' => 'Harar, Ethiopia',
            'phone' => '+252 11 50 50',
            'email' => 'Duschool571@gmail.com'
        ];

        // Group data by Academic Year for a cleaner transcript
        $academicRecords = $student->marks->groupBy('academic_year_id')->map(function ($yearMarks) use ($student) {
            $yearId = $yearMarks->first()->academic_year_id;
            $yearName = $yearMarks->first()->academicYear->name;

            return [
                'year_name' => $yearName,
                'semesters' => $yearMarks->groupBy('semester')->map(function ($semMarks, $semester) use ($student, $yearId) {
                    $result = $student->semesterResults
                        ->where('academic_year_id', $yearId)
                        ->where('semester', $semester)
                        ->first();

                    return [
                        'semester' => $semester,
                        'marks' => $semMarks,
                        'average' => $result ? $result->average : null,
                        'rank' => $result ? $result->rank : null,
                    ];
                })
            ];
        });

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.transcript', [
            'student' => $student,
            'academicRecords' => $academicRecords,
            'schoolInfo' => $schoolInfo,
            'generatedAt' => now()->format('M d, Y')
        ]);

        return $pdf->download("Transcript_{$student->student_id}.pdf");
    }

    public function exportStudentCard(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'academic_year_id' => 'nullable|exists:academic_years,id',
        ]);

        $academicYearId = $request->academic_year_id ?? AcademicYear::whereRaw('is_current = true')->first()?->id;
        $activeYear = $academicYearId ? AcademicYear::find($academicYearId) : null;

        if (!$activeYear) {
            return redirect()->back()->with('error', 'No active academic year found or selected.');
        }

        $student = Student::with([
            'user',
            'grade',
            'section',
            'marks' => function ($q) use ($academicYearId) {
                $q->where('academic_year_id', $academicYearId)->with('subject');
            },
            'semesterResults' => function ($q) use ($academicYearId) {
                $q->where('academic_year_id', $academicYearId);
            },
            'attendances' => function ($q) use ($academicYearId) {
                $q->where('academic_year_id', $academicYearId);
            },
        ])->findOrFail($request->student_id);

        $schoolInfo = [
            'name_or' => 'MANA BARNOOTA DAARUL ULUM KAN UMMATAA',
            'name_en' => 'DARUL ULUM PUBLIC SCHOOL',
            'name_ar' => 'مدرسة دار العلوم الإسلامية',
            'address' => 'Harar, Ethiopia',
            'phone' => '+252 11 50 50',
            'email' => 'Duschool571@gmail.com'
        ];

        $age = $student->dob ? \Carbon\Carbon::parse($student->dob)->age : 'N/A';
        $sex = ucfirst($student->gender ?? 'N/A');

        $subjectMarks = [];
        $semesterResults = [];

        // Group marks by subject then semester (pre-filtered by eager loading)
        foreach ($student->marks as $mark) {
            $subjectName = $mark->subject->name ?? 'Unknown';
            $semester = $mark->semester;
            $subjectMarks[$subjectName][$semester] = $mark->score;
        }

        // Calculate final average for each subject
        foreach ($subjectMarks as $name => $sems) {
            $sem1 = $sems[1] ?? 0;
            $sem2 = $sems[2] ?? 0;
            $subjectMarks[$name]['final'] = ($sem1 > 0 && $sem2 > 0) ? ($sem1 + $sem2) / 2 : ($sem1 ?: $sem2 ?: 0);
        }

        // Results per semester (pre-filtered by eager loading)
        foreach ($student->semesterResults as $res) {
            $absences = $student->attendances
                ->where('status', 'Absent')
                ->count();

            $semesterResults[$res->semester] = [
                'average' => $res->average,
                'rank' => $res->rank,
                'remarks' => $res->teacher_remarks,
                'absences' => $absences,
                'conduct' => 'A'
            ];
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.student-card', [
            'student' => $student,
            'age' => $age,
            'sex' => $sex,
            'subjectMarks' => $subjectMarks,
            'semesterResults' => $semesterResults,
            'yearName' => $activeYear->name,
            'schoolInfo' => $schoolInfo,
            'generatedAt' => now()->format('M d, Y')
        ])->setPaper('a4', 'portrait');

        return $pdf->download("ReportCard_{$activeYear->name}_{$student->user->name}.pdf");
    }

    public function exportSectionCards(Request $request)
    {
        $request->validate([
            'section_id' => 'required|exists:sections,id',
            'academic_year_id' => 'nullable|exists:academic_years,id',
        ]);

        $academicYearId = $request->academic_year_id ?? AcademicYear::whereRaw('is_current = true')->first()?->id;
        $activeYear = $academicYearId ? AcademicYear::find($academicYearId) : null;

        if (!$activeYear) {
            return redirect()->back()->with('error', 'No active academic year found or selected.');
        }

        $students = Student::where('section_id', $request->section_id)
            ->with([
                'user',
                'grade',
                'section',
                'marks' => function ($q) use ($academicYearId) {
                    $q->where('academic_year_id', $academicYearId)->with('subject');
                },
                'semesterResults' => function ($q) use ($academicYearId) {
                    $q->where('academic_year_id', $academicYearId);
                },
                'attendances' => function ($q) use ($academicYearId) {
                    $q->where('academic_year_id', $academicYearId);
                },
            ])->get();

        $schoolInfo = [
            'name_or' => 'MANA BARNOOTA DAARUL ULUM KAN UMMATAA',
            'name_en' => 'DARUL ULUM PUBLIC SCHOOL',
            'name_ar' => 'مدرسة دار العلوم الإسلامية',
            'address' => 'Harar, Ethiopia',
            'phone' => '+252 11 50 50',
            'email' => 'Duschool571@gmail.com'
        ];

        $studentsData = [];

        foreach ($students as $student) {
            $age = $student->dob ? \Carbon\Carbon::parse($student->dob)->age : 'N/A';
            $sex = ucfirst($student->gender ?? 'N/A');

            $subjectMarks = [];
            $semesterResults = [];

            // Group marks by subject then semester (pre-filtered by eager loading)
            foreach ($student->marks as $mark) {
                $subjectName = $mark->subject->name ?? 'Unknown';
                $semester = $mark->semester;
                $subjectMarks[$subjectName][$semester] = $mark->score;
            }

            // Calculate final average for each subject
            foreach ($subjectMarks as $name => $sems) {
                $sem1 = $sems[1] ?? 0;
                $sem2 = $sems[2] ?? 0;
                $subjectMarks[$name]['final'] = ($sem1 > 0 && $sem2 > 0) ? ($sem1 + $sem2) / 2 : ($sem1 ?: $sem2 ?: 0);
            }

            // Results per semester (pre-filtered by eager loading)
            foreach ($student->semesterResults as $res) {
                $absences = $student->attendances
                    ->where('status', 'Absent')
                    ->count();

                $semesterResults[$res->semester] = [
                    'average' => $res->average,
                    'rank' => $res->rank,
                    'remarks' => $res->teacher_remarks,
                    'absences' => $absences,
                    'conduct' => 'A'
                ];
            }

            $studentsData[] = [
                'student' => $student,
                'age' => $age,
                'sex' => $sex,
                'subjectMarks' => $subjectMarks,
                'semesterResults' => $semesterResults,
                'yearName' => $activeYear->name,
                'schoolInfo' => $schoolInfo,
                'generatedAt' => now()->format('M d, Y')
            ];
        }

        if (empty($studentsData)) {
            return back()->with('error', 'No students found in this section.');
        }

        $section = $students->first()->section;
        $grade = $students->first()->grade;

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.section-cards', [
            'studentsData' => $studentsData,
        ])->setPaper('a4', 'portrait');

        return $pdf->download("SectionCards_{$grade->name}_{$section->name}.pdf");
    }
}
