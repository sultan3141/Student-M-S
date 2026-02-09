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

        $selectedStudentId = session('selected_student_id');
        
        $student = null;
        $attendanceData = null;
        
        if ($selectedStudentId) {
            $student = $user->parentProfile->students()
                ->with(['user:id,name', 'grade:id,name', 'section:id,name', 'currentRegistration', 'reports' => function($query) {
                    $query->orderBy('reported_at', 'desc')->limit(5);
                }])
                ->where('students.id', $selectedStudentId)
                ->first();
                
            if ($student) {
                $academicYear = \App\Models\AcademicYear::whereRaw("is_current = true")->first() 
                    ?? \App\Models\AcademicYear::orderBy('id', 'desc')->first();
                if ($academicYear) {
                    $attendanceData = $this->calculateAttendanceStats($student->id, $academicYear->id);
                }
            }
        }

        return Inertia::render('Parent/Dashboard', [
            'parentName' => $user->name,
            'selectedStudent' => $student,
            'attendance' => $attendanceData,
        ])->withViewData([
            'title' => 'Parent Dashboard'
        ]);
    }

    public function children(Request $request)
    {
        $user = Auth::user();
        $students = $user->parentProfile->students()
            ->with(['user:id,name', 'grade:id,name', 'section:id,name', 'currentRegistration'])
            ->get();

        return Inertia::render('Parent/Children', [
            'students' => $students,
            'selectedStudentId' => session('selected_student_id'),
        ]);
    }

    public function selectChild(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id'
        ]);

        $user = Auth::user();
        // Verify ownership
        $exists = $user->parentProfile->students()->where('students.id', $request->student_id)->exists();
        
        if (!$exists) {
            abort(403, 'Unauthorized access to student record.');
        }

        session(['selected_student_id' => $request->student_id]);

        return redirect()->route('parent.dashboard')->with('success', 'Student selected successfully.');
    }
    
    private function calculateAttendanceStats($studentId, $academicYearId)
    {
        $cacheKey = "parent_attendance_{$studentId}_{$academicYearId}";
        
        return cache()->remember($cacheKey, 300, function () use ($studentId, $academicYearId) {
            $total = \App\Models\Attendance::where('student_id', $studentId)
                ->where('academic_year_id', $academicYearId)
                ->count();

            if ($total === 0) {
                return [
                    'rate' => 100,
                    'present' => 0,
                    'absent' => 0,
                    'late' => 0,
                    'excused' => 0,
                    'total' => 0,
                ];
            }

            $present = \App\Models\Attendance::where('student_id', $studentId)
                ->where('academic_year_id', $academicYearId)
                ->where('status', 'Present')
                ->count();
                
            $absent = \App\Models\Attendance::where('student_id', $studentId)
                ->where('academic_year_id', $academicYearId)
                ->where('status', 'Absent')
                ->count();
                
            $late = \App\Models\Attendance::where('student_id', $studentId)
                ->where('academic_year_id', $academicYearId)
                ->where('status', 'Late')
                ->count();
                
            $excused = \App\Models\Attendance::where('student_id', $studentId)
                ->where('academic_year_id', $academicYearId)
                ->where('status', 'Excused')
                ->count();

            $rate = round(($present / $total) * 100, 1);

            return [
                'rate' => $rate,
                'present' => $present,
                'absent' => $absent,
                'late' => $late,
                'excused' => $excused,
                'total' => $total,
            ];
        });
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
        $student->load(['grade', 'section', 'user']);

        // Get all official registrations (history of grades/years)
        $registrations = \App\Models\Registration::where('student_id', $student->id)
            ->with(['grade', 'academicYear', 'section'])
            ->orderBy('academic_year_id', 'desc')
            ->get();

        $academicYearIds = $registrations->pluck('academic_year_id')->unique();
        
        // Pre-fetch all semester results for this student
        $allSemesterResults = \App\Models\SemesterResult::where('student_id', $student->id)
            ->whereIn('academic_year_id', $academicYearIds)
            ->get()
            ->groupBy(fn($r) => "{$r->academic_year_id}_{$r->semester}");

        // Pre-fetch all semester periods for these years
        $allSemesterPeriods = \App\Models\SemesterPeriod::whereIn('academic_year_id', $academicYearIds)
            ->get()
            ->groupBy(fn($p) => "{$p->academic_year_id}_{$p->semester}")
            ->map(fn($group) => $group->first());

        $history = $registrations->map(function($reg) use ($student, $allSemesterResults, $allSemesterPeriods) {
            $semestersData = collect([1, 2])->map(function($semesterNum) use ($reg, $student, $allSemesterResults, $allSemesterPeriods) {
                
                $key = "{$reg->academic_year_id}_{$semesterNum}";
                $result = $allSemesterResults->get($key)?->first();
                $period = $allSemesterPeriods->get($key);

                // If no result record, check if marks exist (for active/unprocessed semesters)
                if (!$result) {
                    $hasMarks = \App\Models\Mark::where('student_id', $student->id)
                        ->where('academic_year_id', $reg->academic_year_id)
                        ->where('grade_id', $reg->grade_id)
                        ->where('semester', (string)$semesterNum)
                        ->exists();

                    if (!$hasMarks) return null;
                    
                    // Basic data if results haven't been calculated/persisted yet
                    return [
                        'semester' => $semesterNum,
                        'academic_year_id' => $reg->academic_year_id,
                        'academic_year' => $reg->academicYear,
                        'average' => 0,
                        'rank' => '-',
                        'total_students' => \App\Models\Student::where('section_id', $reg->section_id)->count(),
                        'status' => $period ? $period->status : 'closed',
                        'is_complete' => false,
                    ];
                }

                return [
                    'semester' => $semesterNum,
                    'academic_year_id' => $reg->academic_year_id,
                    'academic_year' => $reg->academicYear,
                    'average' => round($result->average, 2),
                    'rank' => $result->rank ?? '-',
                    'total_students' => \App\Models\Student::where('section_id', $reg->section_id)->count(),
                    'status' => $period ? $period->status : 'closed',
                    'is_complete' => true,
                ];
            })->filter()->values();

            return [
                'id' => $reg->id,
                'grade' => $reg->grade,
                'academic_year' => $reg->academicYear,
                'section' => $reg->section,
                'semesters' => $semestersData
            ];
        })->filter(function($item) {
            return count($item['semesters']) > 0;
        })->values();

        return Inertia::render('Parent/SemesterRecord/Index', [
            'student' => $student,
            'history' => $history,
        ]);
    }

    /**
     * Helper to calculate rank for historical records
     */
    private function calculateSemesterRankFast($studentId, $sectionId, $semester, $academicYearId)
    {
        $cacheKey = "section_rankings_{$sectionId}_{$semester}_{$academicYearId}";
        
        $rankings = cache()->remember($cacheKey, 300, function () use ($sectionId, $semester, $academicYearId) {
            $sectionStudents = \App\Models\Student::where('section_id', $sectionId)->pluck('id');

            return \App\Models\Mark::whereIn('student_id', $sectionStudents)
                ->where('semester', (string)$semester)
                ->where('academic_year_id', $academicYearId)
                ->get()
                ->groupBy('student_id')
                ->map(function ($marks, $sid) {
                    $subjectAvg = $marks->groupBy('subject_id')->map(function($m) {
                        $score = $m->sum('score');
                        $max = $m->sum('max_score') ?: (count($m) * 100);
                        return $max > 0 ? ($score / $max) * 100 : 0;
                    });
                    return [
                        'student_id' => $sid,
                        'avg' => $subjectAvg->count() > 0 ? round($subjectAvg->avg(), 2) : 0
                    ];
                })
                ->filter(fn($item) => $item['avg'] > 0)
                ->sortByDesc('avg')
                ->values();
        });

        $rankIndex = $rankings->search(fn($item) => $item['student_id'] == $studentId);
        $totalStudents = $rankings->count();
        if ($totalStudents === 0) {
            $totalStudents = \App\Models\Student::where('section_id', $sectionId)->count();
        }

        return [
            'rank' => $rankIndex !== false ? $rankIndex + 1 : '-',
            'total' => $totalStudents,
        ];
    }

    public function semesterShow($studentId, $semester, $academicYearId)
    {
        $student = $this->getAuthorizedStudent($studentId);

        // Cache the entire semester show data for 1 hour (increased from 10 minutes)
        $cacheKey = "student_{$studentId}_semester_{$semester}_year_{$academicYearId}";
        $data = cache()->remember($cacheKey, 3600, function() use ($student, $semester, $academicYearId) {
            $academicYear = \App\Models\AcademicYear::find($academicYearId);
            
            $teacherAssignments = \App\Models\TeacherAssignment::with('teacher.user')
                ->where('section_id', $student->section_id)
                ->where('academic_year_id', $academicYearId)
                ->get()
                ->keyBy('subject_id');

            $allMarks = \App\Models\Mark::where('student_id', $student->id)
                ->where('semester', (string)$semester)
                ->where('academic_year_id', $academicYearId)
                ->with(['subject', 'assessment.assessmentType'])
                ->get();

            $subjectRecords = $allMarks->groupBy('subject_id')->map(function ($subjectMarks) use ($teacherAssignments) {
                $subject = $subjectMarks->first()->subject;
                
                $detailedMarks = $subjectMarks->map(function($mark) {
                    return [
                        'id' => $mark->id,
                        'score' => $mark->score,
                        'assessment_name' => $mark->assessment?->name ?? $mark->assessment_type ?? 'Grade Entry',
                        'max_score' => $mark->max_score ?? 100,
                        'weight' => $mark->assessment?->weight_percentage ?? 0,
                        'type' => $mark->assessment?->assessmentType->name ?? 'General',
                        'is_submitted' => $mark->is_submitted ?? true,
                    ];
                });

                $totalScore = $subjectMarks->sum('score');
                $totalMax = $subjectMarks->sum('max_score') ?: ($subjectMarks->count() * 100);

                return [
                    'subject' => [
                        'id' => $subject->id,
                        'name' => $subject->name,
                        'code' => $subject->code,
                        'teacher_name' => $teacherAssignments->get($subject->id)?->teacher?->user?->name ?? 'Not Assigned',
                    ],
                    'marks' => $detailedMarks->values(),
                    'average' => $totalMax > 0 ? round(($totalScore / $totalMax) * 100, 2) : 0,
                ];
            })->values();

            $semesterAverage = $subjectRecords->isNotEmpty() ? round($subjectRecords->avg('average'), 2) : 0;
            
            $rank = \DB::table('semester_results')
                ->where('student_id', $student->id)
                ->where('academic_year_id', $academicYearId)
                ->where('semester', (string)$semester)
                ->value('rank') ?? 'N/A';
            
            return [
                'academic_year' => $academicYear,
                'subject_records' => $subjectRecords,
                'semester_average' => $semesterAverage,
                'rank' => $rank,
                'total_students' => \App\Models\Student::where('section_id', $student->section_id)->count(),
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
        $year = \App\Models\AcademicYear::whereRaw('is_current = true')
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
            $academicYear = \App\Models\AcademicYear::where('id', $academicYearId)
                ->select('id', 'name')
                ->first();
            
            // Optimized single query for subjects
            $allMarks = \App\Models\Mark::where('student_id', $student->id)
                ->where('academic_year_id', $academicYearId)
                ->with('subject')
                ->get();

            // Calculate semester averages from SUBJECT averages
            $subjectsBySemester = $allMarks->groupBy('semester');
            
            $calculateSemAvg = function($marks) {
                if ($marks->isEmpty()) return null;
                $subjectStats = $marks->groupBy('subject_id')->map(function($sm) {
                    $score = $sm->sum('score');
                    $max = $sm->sum('max_score') ?: ($sm->count() * 100);
                    return $max > 0 ? ($score / $max) * 100 : 0;
                });
                return round($subjectStats->avg(), 2);
            };

            $semester1Average = $calculateSemAvg($subjectsBySemester->get('1', collect()));
            $semester2Average = $calculateSemAvg($subjectsBySemester->get('2', collect()));
            
            $semester1Average = $semester1Average ? round($semester1Average, 2) : null;
            $semester2Average = $semester2Average ? round($semester2Average, 2) : null;
            
            $finalAverage = null;
            if ($semester1Average && $semester2Average) {
                $finalAverage = round(($semester1Average + $semester2Average) / 2, 2);
            }

            // Group subjects by ID and calculate final averages
            $subjectsList = $allMarks->groupBy('subject_id')->map(function ($marks) {
                $subject = $marks->first()->subject;
                
                $getSemAvg = function($m) {
                    if ($m->isEmpty()) return null;
                    $score = $m->sum('score');
                    $max = $m->sum('max_score') ?: ($m->count() * 100);
                    return $max > 0 ? ($score / $max) * 100 : 0;
                };

                $sem1Avg = $getSemAvg($marks->where('semester', '1'));
                $sem2Avg = $getSemAvg($marks->where('semester', '2'));
                
                $finalAvg = null;
                if ($sem1Avg !== null && $sem2Avg !== null) {
                    $finalAvg = round(($sem1Avg + $sem2Avg) / 2, 2);
                } else {
                    $finalAvg = $sem1Avg ?? $sem2Avg;
                }

                return [
                    'id' => $subject->id,
                    'name' => $subject->name,
                    'code' => $subject->code,
                    'credit_hours' => $subject->credit_hours ?? 3,
                    'semester1_average' => $sem1Avg ? round($sem1Avg, 2) : null,
                    'semester2_average' => $sem2Avg ? round($sem2Avg, 2) : null,
                    'final_average' => $finalAvg ? round($finalAvg, 2) : null,
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
        
        // Calculate averages per subject as percentages
        $averages = $student->marks()
            ->with('subject')
            ->get()
            ->groupBy('subject_id')
            ->map(function($marks) {
                $score = $marks->sum('score');
                $max = $marks->sum('max_score') ?: ($marks->count() * 100);
                return [
                    'subject' => $marks->first()->subject->name ?? 'Unknown',
                    'average' => $max > 0 ? round(($score / $max) * 100, 2) : 0,
                ];
            })->values();

        // Overall average (average of subject percentages)
        $overall = $averages->isNotEmpty() ? $averages->avg('average') : 0;

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

    public function attendance($studentId)
    {
        $student = $this->getAuthorizedStudent($studentId);
        $student->load(['grade:id,name', 'section:id,name', 'user']);

        // Get current academic year
        $academicYear = \App\Models\AcademicYear::whereRaw('is_current = true')->first() 
            ?? \App\Models\AcademicYear::orderBy('id', 'desc')->first();

        // Get all attendance records for the student
        $attendanceRecords = \App\Models\Attendance::where('student_id', $student->id)
            ->where('academic_year_id', $academicYear->id)
            ->with(['subject:id,name'])
            ->orderBy('date', 'desc')
            ->get();

        // Calculate statistics
        $totalRecords = $attendanceRecords->count();
        $presentCount = $attendanceRecords->where('status', 'Present')->count();
        $absentCount = $attendanceRecords->where('status', 'Absent')->count();
        $lateCount = $attendanceRecords->where('status', 'Late')->count();
        $excusedCount = $attendanceRecords->where('status', 'Excused')->count();
        
        $attendanceRate = $totalRecords > 0 ? round(($presentCount / $totalRecords) * 100, 1) : 100;

        // Group by month for better visualization
        $recordsByMonth = $attendanceRecords->groupBy(function ($record) {
            return \Carbon\Carbon::parse($record->date)->format('F Y');
        })->map(function ($monthRecords, $month) {
            return [
                'month' => $month,
                'total' => $monthRecords->count(),
                'present' => $monthRecords->where('status', 'Present')->count(),
                'absent' => $monthRecords->where('status', 'Absent')->count(),
                'late' => $monthRecords->where('status', 'Late')->count(),
                'excused' => $monthRecords->where('status', 'Excused')->count(),
                'rate' => $monthRecords->count() > 0 
                    ? round(($monthRecords->where('status', 'Present')->count() / $monthRecords->count()) * 100, 1) 
                    : 100,
            ];
        })->values();

        // Format records for display
        $formattedRecords = $attendanceRecords->map(function ($record) {
            return [
                'id' => $record->id,
                'date' => \Carbon\Carbon::parse($record->date)->format('M d, Y'),
                'day' => \Carbon\Carbon::parse($record->date)->format('l'),
                'subject' => $record->subject->name ?? 'General',
                'status' => $record->status,
                'remarks' => $record->remarks,
            ];
        });

        return Inertia::render('Parent/Attendance/Index', [
            'student' => $student,
            'academicYear' => $academicYear,
            'statistics' => [
                'total' => $totalRecords,
                'present' => $presentCount,
                'absent' => $absentCount,
                'late' => $lateCount,
                'excused' => $excusedCount,
                'rate' => $attendanceRate,
            ],
            'recordsByMonth' => $recordsByMonth,
            'records' => $formattedRecords,
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
