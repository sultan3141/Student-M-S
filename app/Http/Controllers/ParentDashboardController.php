<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\AcademicYear;
use App\Models\Subject;
use App\Models\AssessmentType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

use App\Models\Registration;
use App\Models\Grade;
use App\Models\Stream;

class ParentDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if (!$user->isParent() || !$user->parentProfile) {
            abort(403, 'Unauthorized');
        }

        // Cache students data for 30 minutes (increased from 5)
        $cacheKey = "parent_{$user->id}_students";
        $students = cache()->remember($cacheKey, 1800, function() use ($user) {
            return $user->parentProfile->students()
                ->with(['user:id,name', 'grade:id,name', 'section:id,name', 'currentRegistration', 'reports' => function($query) {
                    $query->orderBy('reported_at', 'desc')->limit(10);
                }])
                ->get();
        });

        // Get selected student ID from request, default to first student
        $selectedStudentId = $request->get('student', $students->first()?->id);

        return Inertia::render('Parent/Dashboard', [
            'students' => $students,
            'selectedStudentId' => $selectedStudentId,
        ])->withViewData([
            'title' => 'Parent Dashboard'
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

    public function semesterIndex($studentId)
    {
        $student = $this->getAuthorizedStudent($studentId);

        // Cache semester data for 1 hour (increased from 10 minutes)
        $cacheKey = "student_{$studentId}_semesters";
        $semesters = cache()->remember($cacheKey, 3600, function() use ($student) {
            // Single optimized query with all data - using WHERE clause for PostgreSQL compatibility
            return \DB::table('marks')
                ->join('academic_years', 'marks.academic_year_id', '=', 'academic_years.id')
                ->leftJoin('semester_results', function($join) use ($student) {
                    $join->on('marks.academic_year_id', '=', 'semester_results.academic_year_id')
                         ->whereRaw('marks.semester::integer = semester_results.semester::integer')
                         ->where('semester_results.student_id', '=', $student->id);
                })
                ->where('marks.student_id', $student->id)
                ->select(
                    'marks.semester',
                    'marks.academic_year_id',
                    'academic_years.name as year_name',
                    \DB::raw('ROUND(AVG(marks.score), 2) as average'),
                    \DB::raw('MAX(semester_results.rank) as rank')
                )
                ->groupBy('marks.semester', 'marks.academic_year_id', 'academic_years.name')
                ->orderBy('marks.academic_year_id', 'desc')
                ->orderBy('marks.semester', 'desc')
                ->get()
                ->map(function($sem) use ($student) {
                    return [
                        'semester' => $sem->semester,
                        'academic_year_id' => $sem->academic_year_id,
                        'academic_year' => ['id' => $sem->academic_year_id, 'name' => $sem->year_name],
                        'average' => $sem->average,
                        'rank' => $sem->rank ?? 'N/A',
                        'total_students' => cache()->remember("section_{$student->section_id}_count", 3600, function() use ($student) {
                            return \DB::table('students')->where('section_id', $student->section_id)->count();
                        }),
                    ];
                });
        });

        // Get student info for header (cached)
        $student->load(['grade', 'section', 'user']);

        return Inertia::render('Parent/SemesterRecord/Index', [
            'student' => $student,
            'semesters' => $semesters,
        ]);
    }

    public function semesterShow($studentId, $semester, $academicYearId)
    {
        $student = $this->getAuthorizedStudent($studentId);

        // Cache the entire semester show data for 1 hour (increased from 10 minutes)
        $cacheKey = "student_{$studentId}_semester_{$semester}_year_{$academicYearId}";
        $data = cache()->remember($cacheKey, 3600, function() use ($student, $semester, $academicYearId) {
            // Get academic year
            $academicYear = \DB::table('academic_years')
                ->where('id', $academicYearId)
                ->select('id', 'name')
                ->first();
            
            // Get teacher assignments (cached separately)
            $teacherAssignments = cache()->remember("section_{$student->section_id}_teachers_year_{$academicYearId}", 3600, function() use ($student, $academicYearId) {
                return \DB::table('teacher_assignments')
                    ->join('teachers', 'teacher_assignments.teacher_id', '=', 'teachers.id')
                    ->join('users', 'teachers.user_id', '=', 'users.id')
                    ->where('teacher_assignments.section_id', $student->section_id)
                    ->where('teacher_assignments.academic_year_id', $academicYearId)
                    ->select('teacher_assignments.subject_id', 'users.name as teacher_name')
                    ->get()
                    ->keyBy('subject_id');
            });

            // Optimized query: Get marks with subjects and assessments in one go
            $marks = \DB::table('marks')
                ->join('subjects', 'marks.subject_id', '=', 'subjects.id')
                ->leftJoin('assessments', 'marks.assessment_id', '=', 'assessments.id')
                ->leftJoin('assessment_types', 'assessments.assessment_type_id', '=', 'assessment_types.id')
                ->where('marks.student_id', $student->id)
                ->where('marks.semester', $semester)
                ->where('marks.academic_year_id', $academicYearId)
                ->select(
                    'marks.id',
                    'marks.score',
                    'marks.assessment_id',
                    'marks.is_submitted',
                    'subjects.id as subject_id',
                    'subjects.name as subject_name',
                    'subjects.code as subject_code',
                    'assessments.name as assessment_name',
                    'assessments.max_score',
                    'assessments.weight_percentage',
                    'assessment_types.name as type_name'
                )
                ->get();

            // Group by subject and calculate averages
            $subjectRecords = $marks->groupBy('subject_id')->map(function ($subjectMarks) use ($teacherAssignments) {
                $firstMark = $subjectMarks->first();
                
                $detailedMarks = $subjectMarks->map(function($mark) {
                    return [
                        'id' => $mark->id,
                        'score' => $mark->score,
                        'assessment_name' => $mark->assessment_name ?? 'Unknown Assessment',
                        'max_score' => $mark->max_score ?? 100,
                        'weight' => $mark->weight_percentage ?? 0,
                        'type' => $mark->type_name ?? 'General',
                        'is_submitted' => $mark->is_submitted ?? true,
                    ];
                });

                return [
                    'subject' => [
                        'id' => $firstMark->subject_id,
                        'name' => $firstMark->subject_name,
                        'code' => $firstMark->subject_code,
                        'teacher_name' => $teacherAssignments->get($firstMark->subject_id)->teacher_name ?? 'Not Assigned',
                    ],
                    'marks' => $detailedMarks,
                    'average' => round($subjectMarks->avg('score'), 2),
                ];
            })->values();

            $semesterAverage = round($marks->avg('score'), 2);
            
            $rank = \DB::table('semester_results')
                ->where('student_id', $student->id)
                ->where('academic_year_id', $academicYearId)
                ->where('semester', $semester)
                ->value('rank') ?? 'N/A';
            
            $totalStudents = cache()->remember("section_{$student->section_id}_count", 3600, function() use ($student) {
                return \DB::table('students')->where('section_id', $student->section_id)->count();
            });

            return [
                'academic_year' => $academicYear,
                'subject_records' => $subjectRecords,
                'semester_average' => $semesterAverage,
                'rank' => $rank,
                'total_students' => $totalStudents,
            ];
        });

        $student->load(['grade', 'section', 'user']);

        return Inertia::render('Parent/SemesterRecord/Show', [
            'student' => $student,
            'semester' => $semester,
            'academic_year' => $data['academic_year'],
            'subject_records' => $data['subject_records'],
            'semester_average' => $data['semester_average'],
            'rank' => $data['rank'],
            'total_students' => $data['total_students'],
        ]);
    }

    public function academicYearCurrent($studentId)
    {
        $year = \DB::table('academic_years')
            ->whereRaw('is_current = TRUE')
            ->orWhere('status', 'active')
            ->orderBy('created_at', 'desc')
            ->first();
        
        if ($year) {
            return redirect()->route('parent.academic.year.show', ['studentId' => $studentId, 'academicYear' => $year->id]);
        }
        
        return redirect()->route('parent.dashboard')->with('error', 'No active academic year found.');
    }

    public function academicYearShow($studentId, $academicYearId)
    {
        $student = $this->getAuthorizedStudent($studentId);

        // Cache academic year data for 1 hour (increased from 10 minutes)
        $cacheKey = "student_{$studentId}_academic_year_{$academicYearId}";
        $data = cache()->remember($cacheKey, 3600, function() use ($student, $academicYearId) {
            $academicYear = \DB::table('academic_years')
                ->where('id', $academicYearId)
                ->select('id', 'name')
                ->first();
            
            // Optimized single query for semester averages and subjects
            $subjects = \DB::table('marks')
                ->join('subjects', 'marks.subject_id', '=', 'subjects.id')
                ->where('marks.student_id', $student->id)
                ->where('marks.academic_year_id', $academicYearId)
                ->select(
                    'subjects.id',
                    'subjects.name',
                    'subjects.code',
                    'subjects.credit_hours',
                    'marks.semester',
                    \DB::raw('ROUND(AVG(marks.score), 2) as avg_score')
                )
                ->groupBy('subjects.id', 'subjects.name', 'subjects.code', 'subjects.credit_hours', 'marks.semester')
                ->get();

            // Calculate semester averages
            $semester1Average = $subjects->where('semester', '1')->avg('avg_score');
            $semester2Average = $subjects->where('semester', '2')->avg('avg_score');
            
            $semester1Average = $semester1Average ? round($semester1Average, 2) : null;
            $semester2Average = $semester2Average ? round($semester2Average, 2) : null;
            
            $finalAverage = null;
            if ($semester1Average && $semester2Average) {
                $finalAverage = round(($semester1Average + $semester2Average) / 2, 2);
            }

            // Group subjects by ID and calculate final averages
            $subjectsList = $subjects->groupBy('id')->map(function ($marks) {
                $subject = $marks->first();
                $sem1Avg = $marks->where('semester', '1')->first()?->avg_score;
                $sem2Avg = $marks->where('semester', '2')->first()?->avg_score;
                
                $finalAvg = null;
                if ($sem1Avg !== null && $sem2Avg !== null) {
                    $finalAvg = round(($sem1Avg + $sem2Avg) / 2, 2);
                } elseif ($sem1Avg !== null) {
                    $finalAvg = $sem1Avg;
                } elseif ($sem2Avg !== null) {
                    $finalAvg = $sem2Avg;
                }

                return [
                    'id' => $subject->id,
                    'name' => $subject->name,
                    'code' => $subject->code,
                    'credit_hours' => $subject->credit_hours ?? 3,
                    'semester1_average' => $sem1Avg,
                    'semester2_average' => $sem2Avg,
                    'final_average' => $finalAvg,
                ];
            })->values();

            $finalRank = \DB::table('final_results')
                ->where('student_id', $student->id)
                ->where('academic_year_id', $academicYearId)
                ->value('final_rank') ?? 'N/A';
            
            $totalStudents = cache()->remember("section_{$student->section_id}_count", 3600, function() use ($student) {
                return \DB::table('students')->where('section_id', $student->section_id)->count();
            });

            return [
                'academic_year' => $academicYear,
                'semester1_average' => $semester1Average,
                'semester2_average' => $semester2Average,
                'final_average' => $finalAverage,
                'subjects' => $subjectsList,
                'final_rank' => $finalRank,
                'total_students' => $totalStudents,
                'is_complete' => $semester1Average && $semester2Average,
            ];
        });

        $student->load(['grade', 'section', 'user']);

        return Inertia::render('Parent/AcademicYearRecord/Show', [
            'student' => $student,
            'academic_year' => $data['academic_year'],
            'semester1_average' => $data['semester1_average'],
            'semester2_average' => $data['semester2_average'],
            'final_average' => $data['final_average'],
            'subjects' => $data['subjects'],
            'final_rank' => $data['final_rank'],
            'total_students' => $data['total_students'],
            'is_complete' => $data['is_complete'],
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

    public function registrationCreate($studentId)
    {
        $student = $this->getAuthorizedStudent($studentId);
        
        $academicYear = AcademicYear::where('status', 'active')->first() 
                        ?? AcademicYear::latest('start_date')->first();

        // Get existing registration for THIS academic year
        $existingRegistration = null;
        if ($academicYear) {
            $existingRegistration = Registration::where('student_id', $student->id)
                ->where('academic_year_id', $academicYear->id)
                ->with(['grade', 'section', 'stream'])
                ->first();
        }

        // Determine next grade
        $currentGrade = $student->grade;
        $nextGrade = null;
        if ($currentGrade) {
            $nextGrade = Grade::where('level', $currentGrade->level + 1)->first();
        }
        
        $streams = Stream::all();

        return Inertia::render('Parent/Registration/Index', [
            'student' => $student->load('grade', 'section', 'user'),
            'academicYear' => $academicYear,
            'existingRegistration' => $existingRegistration,
            'nextGrade' => $nextGrade,
            'streams' => $streams,
        ]);
    }

    public function registrationStore(Request $request, $studentId)
    {
        $student = $this->getAuthorizedStudent($studentId);

        $validated = $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'stream_id' => 'nullable|exists:streams,id',
        ]);

        $academicYear = AcademicYear::where('status', 'active')->first() 
                        ?? AcademicYear::latest('start_date')->first();

        if (!$academicYear) {
            return back()->with('error', 'No active academic year found.');
        }

        $exists = Registration::where('student_id', $student->id)
            ->where('academic_year_id', $academicYear->id)
            ->exists();

        if ($exists) {
            return back()->with('error', 'Student is already registered for this academic year.');
        }

        Registration::create([
            'student_id' => $student->id,
            'academic_year_id' => $academicYear->id,
            'grade_id' => $validated['grade_id'],
            'stream_id' => $validated['stream_id'] ?? null,
            'registration_date' => now(),
            'status' => 'Pending', 
        ]);

        return redirect()->route('parent.dashboard')->with('success', 'Registration submitted successfully.');
    }

    private function getAuthorizedStudent($studentId)
    {
        $user = Auth::user();
        $student = $user->parentProfile->students()->findOrFail($studentId);
        return $student;
    }
}
