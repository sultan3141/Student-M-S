<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\AcademicYear;
use App\Models\Subject;
use App\Models\AssessmentType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ParentDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if (!$user->isParent() || !$user->parentProfile) {
            abort(403, 'Unauthorized');
        }

        $students = $user->parentProfile->students()
            ->with(['grade', 'section', 'reports' => function($query) {
                $query->orderBy('reported_at', 'desc')->limit(10);
            }])
            ->get();

        return Inertia::render('Parent/Dashboard', [
            'students' => $students
        ]);
    }

    public function profile($studentId)
    {
        $student = $this->getAuthorizedStudent($studentId);

        $student->load(['grade', 'section']); // Adjust relations as needed

        return Inertia::render('Parent/StudentProfile', [
            'student' => $student
        ]);
    }

    public function marks(Request $request, $studentId)
    {
        $student = $this->getAuthorizedStudent($studentId);

        $academicYears = AcademicYear::where('status', 'active')->orWhereHas('marks', function($q) use ($studentId) {
            $q->where('student_id', $studentId);
        })->get();

        $query = $student->marks()->with(['subject', 'academicYear', 'assessmentType']);

        if ($request->has('academic_year_id')) {
            $query->where('academic_year_id', $request->input('academic_year_id'));
        }
        
        if ($request->has('semester')) {
            $query->where('semester', $request->input('semester'));
        }

        $marks = $query->get();

        return Inertia::render('Parent/AcademicInfo', [
            'student' => $student,
            'marks' => $marks,
            'academicYears' => $academicYears,
            'filters' => $request->only(['academic_year_id', 'semester']),
        ]);
    }

    public function progress($studentId)
    {
        $student = $this->getAuthorizedStudent($studentId);
        
        // Calculate averages per subject
        $averages = $student->marks()
            ->join('subjects', 'marks.subject_id', '=', 'subjects.id')
            ->selectRaw('subjects.name as subject, AVG(score) as average')
            ->groupBy('subjects.name')
            ->get();

        // Overall average
        $overall = $student->marks()->avg('score');

        return Inertia::render('Parent/Analytics/PerformanceTrends', [
            'student' => $student,
            'averages' => $averages,
            'overall' => round($overall, 2),
        ]);
    }

    public function notifications()
    {
        // Placeholder to avoid crash
        return redirect()->route('parent.dashboard');
    }

    public function schoolContact()
    {
        // Return static school contact information
        // In production, this would come from a database
        $contacts = [
            'administration' => [
                [
                    'title' => 'President',
                    'name' => 'Dr. Ahmed Ibrahim',
                    'phone' => '+251-111-234567',
                ],
                [
                    'title' => 'Vice President',
                    'name' => 'Mr. Yasin Ahmed',
                    'phone' => '+251-111-234569',
                ],
            ],
            'registrar' => [
                'name' => 'Registrar Ahmed',
                'phone' => '+251-111-234570',
                'email' => 'registrar@school.edu.et',
            ],
            'teachers' => [
                ['name' => 'Teacher Aisha', 'subject' => 'Mathematics & Science', 'phone' => '+251-911-345678'],
                ['name' => 'Teacher Ibrahim', 'subject' => 'English', 'phone' => '+251-911-345679'],
                ['name' => 'Teacher Fatima', 'subject' => 'Social Studies', 'phone' => '+251-911-345680'],
            ],
        ];

        return Inertia::render('Parent/SchoolContact', [
            'contacts' => $contacts,
        ]);
    }

    public function paymentHistory($studentId)
    {
        $student = $this->getAuthorizedStudent($studentId);
        
        // Get payment records for this student
        $payments = $student->payments()
            ->orderBy('transaction_date', 'desc')
            ->get()
            ->map(function($payment) {
                return [
                    'id' => $payment->id,
                    'transaction_date' => $payment->transaction_date,
                    'type' => $payment->type,
                    'amount' => $payment->amount,
                    'status' => $payment->status,
                    'receipt_no' => 'RCP-' . date('Y', strtotime($payment->transaction_date)) . '-' . str_pad($payment->id, 3, '0', STR_PAD_LEFT),
                ];
            });

        return Inertia::render('Parent/PaymentHistory', [
            'student' => $student,
            'payments' => $payments,
        ]);
    }

    private function getAuthorizedStudent($studentId)
    {
        $user = Auth::user();
        $student = $user->parentProfile->students()->findOrFail($studentId);
        return $student;
    }
}
