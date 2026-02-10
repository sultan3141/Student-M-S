<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SemesterStatus;

class StudentController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();

        $student = $user->student()
            ->with(['grade:id,name', 'section:id,name', 'parent:id'])
            ->first();

        // Admin/Director Preview Mode
        if (!$student && ($user->hasRole('admin') || $user->hasRole('school_director'))) {
            $student = \App\Models\Student::with(['grade:id,name', 'section:id,name', 'parent:id'])
                ->whereHas('grade')
                ->whereHas('section')
                ->first();
        }

        if (!$student) {
            return redirect()->route('student.profile.edit')->with('error', 'Student record not found.');
        }

        // Get current academic year
        $academicYear = cache()->remember('current_academic_year', 3600, function () {
            return \App\Models\AcademicYear::whereRaw('is_current = true')->first()
                ?? \App\Models\AcademicYear::orderBy('id', 'desc')->first();
        });

        // Get current semester information - Use Grade Specific Status
        $currentSemester = $this->getCurrentSemesterInfoForStudent($student, $academicYear);

        // Use Fast calculation methods
        $average = $this->calculateGPAFast($student->id, $academicYear->id);
        $rank = $this->getCurrentRankFast($student->id, $student->grade_id, $academicYear->id) ?? 'N/A';
        $attendanceRate = $this->calculateAttendanceRateFast($student->id, $academicYear->id);

        // Get marks for the current academic year
        $recentMarks = \App\Models\Mark::where('student_id', $student->id)
            ->where('academic_year_id', $academicYear->id)
            ->with(['subject:id,name', 'assessment:id,name', 'assessmentType:id,name'])
            ->latest()
            ->take(5)
            ->get();

        $marksStats = [
            'average' => round($average, 1),
            'rank' => $rank,
            'totalStudents' => cache()->remember("section_count_{$student->section_id}", 3600, fn() => \App\Models\Student::where('section_id', $student->section_id)->count()),
            'totalSubjects' => cache()->remember("grade_subjects_count_{$student->grade_id}", 3600, fn() => \App\Models\Subject::where('grade_id', $student->grade_id)->count()),
            'recent' => $recentMarks->map(function ($mark) {
                return [
                    'id' => $mark->id,
                    'subject' => $mark->subject->name ?? 'Unknown',
                    'assessment' => $mark->assessment->name ?? $mark->assessmentType->name ?? 'Grade Entry',
                    'score' => $mark->score,
                    'maxScore' => $mark->max_score ?? 100,
                    'percentage' => $mark->max_score > 0 ? round(($mark->score / $mark->max_score) * 100, 1) . '%' : 'N/A',
                    'percentage_value' => $mark->max_score > 0 ? round(($mark->score / $mark->max_score) * 100, 1) : 0,
                    'date' => $mark->created_at->format('M d'),
                    'is_graded' => true,
                ];
            })->values()
        ];

        // Trend Data for Charts
        $allMarks = \App\Models\Mark::where('student_id', $student->id)
            ->with(['academicYear:id,name', 'assessmentType:id,name'])
            ->get();

        $trendData = $allMarks->groupBy(function ($mark) {
            return $mark->academicYear->name ?? 'Unknown';
        })->map(function ($yearMarks, $yearName) {
            return [
                'year' => $yearName,
                'average' => round($yearMarks->avg('score'), 1),
            ];
        })->values();

        $pendingAssignments = $this->getPendingAssignmentsCount($student, $academicYear);

        $attendanceStats = [
            'rate' => $attendanceRate,
            'recent' => \App\Models\Attendance::where('student_id', $student->id)
                ->where('academic_year_id', $academicYear->id)
                ->latest('date')
                ->take(5)
                ->get()
                ->map(function ($record) {
                    return [
                        'date' => \Carbon\Carbon::parse($record->date)->format('M d, Y'),
                        'status' => $record->status,
                    ];
                })->values()
        ];

        // Assessment Distribution for Donut Chart
        $assessmentCounts = $allMarks->groupBy('assessment_type_id')->map(fn($group) => count($group));
        $totalAssessments = $assessmentCounts->sum();
        $assessmentDistribution = [
            'labels' => collect($allMarks->groupBy('assessment_type_id'))->map(fn($group) => $group->first()->assessmentType->name ?? 'Unknown')->values()->toArray(),
            'values' => $assessmentCounts->values()->toArray(),
            'total' => $totalAssessments,
            'percentages' => $assessmentCounts->map(fn($count) => $totalAssessments > 0 ? round(($count / $totalAssessments) * 100) : 0)->toArray()
        ];

        // Full Weekly Schedule
        $schedule = \App\Models\Schedule::where('grade_id', $student->grade_id)
            ->where(function ($q) use ($student) {
                $q->where('section_id', $student->section_id)
                    ->orWhereNull('section_id');
            })
            ->whereRaw('is_active = true')
            ->orderByRaw("CASE day_of_week 
                WHEN 'Monday' THEN 1 
                WHEN 'Tuesday' THEN 2 
                WHEN 'Wednesday' THEN 3 
                WHEN 'Thursday' THEN 4 
                WHEN 'Friday' THEN 5 
                ELSE 6 END")
            ->orderBy('start_time')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'day_of_week' => $item->day_of_week,
                    'activity' => $item->activity,
                    'start_time' => \Carbon\Carbon::parse($item->start_time)->format('H:i'),
                    'end_time' => \Carbon\Carbon::parse($item->end_time)->format('H:i'),
                    'location' => $item->location,
                    'type' => $item->activity === 'Break' ? 'break' : 'class',
                ];
            })
            ->groupBy('day_of_week');

        // Section & School Statistics for Director-style Graphics
        $graphData = cache()->remember("student_graph_data_{$student->section_id}", 3600, function () use ($student) {
            $sectionStudents = \App\Models\Student::where('section_id', $student->section_id)->get();
            $totalInSection = $sectionStudents->count();
            $male = $sectionStudents->where('gender', 'Male')->count();
            $female = $sectionStudents->where('gender', 'Female')->count();

            // School-wide stats for the Bar Chart
            $totalStudentsGlobal = \App\Models\Student::count();
            $maleGlobal = \App\Models\Student::where('gender', 'Male')->count();
            $femaleGlobal = \App\Models\Student::where('gender', 'Female')->count();
            $totalInstructors = \App\Models\User::role('teacher')->count();

            return [
                'section' => [
                    'total' => $totalInSection,
                    'male' => $male,
                    'female' => $female,
                    'malePercent' => $totalInSection > 0 ? round(($male / $totalInSection) * 100) : 0,
                    'femalePercent' => $totalInSection > 0 ? round(($female / $totalInSection) * 100) : 0,
                ],
                'school' => [
                    'total' => $totalStudentsGlobal,
                    'male' => $maleGlobal,
                    'female' => $femaleGlobal,
                    'totalInstructors' => $totalInstructors,
                ]
            ];
        });

        // Notifications/Announcements
        $notifications = \App\Models\Announcement::where('status', 'sent')
            ->where(function ($q) use ($student) {
                $q->where('recipient_type', 'all_students')
                    ->orWhere('recipient_type', 'grade_' . $student->grade_id)
                    ->orWhere('recipient_type', 'specific')
                    ->whereJsonContains('recipient_ids', (string) $student->user_id);
            })
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->subject,
                    'message' => $item->message,
                    'date' => $item->sent_at ? $item->sent_at->diffForHumans() : $item->created_at->diffForHumans(),
                    'type' => 'announcement'
                ];
            });

        return inertia('Student/Dashboard', [
            'student' => $student->load('user'),
            'academicYear' => $academicYear,
            'attendance' => $attendanceStats,
            'marks' => $marksStats,
            'schedule' => $schedule,
            'notifications' => $notifications,
            'currentSemester' => $currentSemester,
            'trendData' => $trendData,
            'pendingAssignments' => $pendingAssignments,
            'assessmentDistribution' => $assessmentDistribution,
            'sectionStats' => $graphData['section'],
            'schoolStats' => $graphData['school'],
        ]);
    }

    /**
     * Get current semester information for student based on Grade Status
     */
    private function getCurrentSemesterInfoForStudent($student, $academicYear)
    {
        if (!$academicYear)
            return null;

        // Check for any open semester for this specific grade
        $status = \App\Models\SemesterStatus::where('academic_year_id', $academicYear->id)
            ->where('grade_id', $student->grade_id)
            ->where('status', 'open')
            ->orderBy('semester', 'desc')
            ->first();

        if ($status) {
            // Check if student has any marks for this semester (results available)
            $hasMarks = \App\Models\Mark::where('student_id', $student->id)
                ->where('academic_year_id', $academicYear->id)
                ->where('semester', (string) $status->semester)
                ->exists();

            return [
                'semester' => $status->semester,
                'status' => 'active',
                'is_open' => true,
                'can_view_results' => $hasMarks,
                'is_declared' => $hasMarks,
                'message' => $hasMarks
                    ? 'Academic results are available for viewing.'
                    : 'Academic results will be available as teachers enter marks.'
            ];
        }

        // Check for the most recently completed/declared semester
        $lastStatus = \App\Models\SemesterStatus::where('academic_year_id', $academicYear->id)
            ->where('grade_id', $student->grade_id)
            ->where('status', 'closed')
            ->orderBy('semester', 'desc')
            ->first();

        if ($lastStatus) {
            return [
                'semester' => $lastStatus->semester,
                'status' => 'completed',
                'is_open' => false,
                'can_view_results' => true,
                'is_declared' => true,
                'message' => 'Final results have been declared.'
            ];
        }

        return [
            'semester' => 1,
            'status' => 'upcoming',
            'is_open' => false,
            'can_view_results' => false,
            'message' => 'Academic year has not started yet.'
        ];
    }

    private function calculateGPAFast($studentId, $academicYearId)
    {
        if (!$academicYearId)
            return 0;

        $cacheKey = "average_{$studentId}_{$academicYearId}";

        return cache()->remember($cacheKey, 300, function () use ($studentId, $academicYearId) {
            $average = \App\Models\Mark::where('student_id', $studentId)
                ->where('academic_year_id', $academicYearId)
                ->avg('score');

            return $average ? round($average, 2) : 0;
        });
    }

    private function getCurrentRankFast($studentId, $gradeId, $academicYearId)
    {
        if (!$academicYearId || !$gradeId)
            return null;

        $cacheKey = "rank_{$studentId}_{$academicYearId}";

        return cache()->remember($cacheKey, 300, function () use ($studentId, $gradeId, $academicYearId) {
            $semesterResult = \App\Models\SemesterResult::where('student_id', $studentId)
                ->where('academic_year_id', $academicYearId)
                ->where('grade_id', $gradeId)
                ->latest()
                ->value('rank');

            return $semesterResult;
        });
    }

    private function calculateAttendanceRateFast($studentId, $academicYearId)
    {
        if (!$academicYearId)
            return 100;

        $cacheKey = "attendance_{$studentId}_{$academicYearId}";

        return cache()->remember($cacheKey, 300, function () use ($studentId, $academicYearId) {
            $total = \App\Models\Attendance::where('student_id', $studentId)
                ->where('academic_year_id', $academicYearId)
                ->count();

            if ($total === 0)
                return 100;

            $present = \App\Models\Attendance::where('student_id', $studentId)
                ->where('academic_year_id', $academicYearId)
                ->where('status', 'Present')
                ->count();

            return round(($present / $total) * 100, 1);
        });
    }

    // Keep old methods for backward compatibility
    private function calculateGPA($student, $academicYear)
    {
        return $this->calculateGPAFast($student->id, $academicYear?->id);
    }

    private function getCurrentRank($student, $academicYear)
    {
        return $this->getCurrentRankFast($student->id, $student->grade_id, $academicYear?->id);
    }

    private function calculateAttendanceRate($student, $academicYear)
    {
        return $this->calculateAttendanceRateFast($student->id, $academicYear?->id);
    }

    private function getPendingAssignmentsCount($student, $academicYear)
    {
        if (!$academicYear || !$student->grade_id)
            return 0;

        // Get all assessments for subjects in this grade
        // Note: Removed type filter as assessments table doesn't have a 'type' column
        // Assessment types are managed through assessment_type_id relationship
        $assessmentIds = \App\Models\Assessment::where('academic_year_id', $academicYear->id)
            ->whereHas('subject', function ($q) use ($student) {
                $q->where('grade_id', $student->grade_id);
            })
            ->pluck('id');

        if ($assessmentIds->isEmpty())
            return 0;

        // Count how many have NO mark for this student
        $submittedCount = \App\Models\Mark::where('student_id', $student->id)
            ->whereIn('assessment_id', $assessmentIds)
            ->count();

        return $assessmentIds->count() - $submittedCount;
    }

    public function profileEdit()
    {
        $user = auth()->user();
        $student = $user->student()->with(['grade', 'section'])->first();

        return inertia('Student/Profile', [
            'student' => $student,
        ]);
    }

    public function profileUpdate(Request $request)
    {
        $user = auth()->user();
        $student = $user->student;

        $validated = $request->validate([
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'profile_photo' => 'nullable|image|max:2048',
        ]);

        $student->update([
            'phone' => $validated['phone'],
            'address' => $validated['address'],
        ]);

        // Handle photo upload if provided
        if ($request->hasFile('profile_photo')) {
            $path = $request->file('profile_photo')->store('profile-photos', 'public');
            $student->update(['profile_photo' => $path]);
        }

        return redirect()->route('student.profile.edit')->with('success', 'Profile updated successfully.');
    }

    public function passwordUpdate(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = auth()->user();

        if (!\Hash::check($validated['current_password'], $user->password)) {
            return back()->withErrors(['current_password' => 'Current password is incorrect.']);
        }

        $user->update([
            'password' => \Hash::make($validated['password']),
        ]);

        return redirect()->route('student.profile.edit')->with('success', 'Password changed successfully.');
    }

    public function academicRecords()
    {
        $user = auth()->user();

        // Eager load all relationships at once
        $student = $user->student()->with(['grade', 'section'])->first();

        // Use cached academic year
        $academicYear = cache()->remember('current_academic_year', 3600, function () {
            return \App\Models\AcademicYear::whereRaw('is_current = true')
                ->orWhere('status', 'active')
                ->latest()
                ->first();
        });

        // Get all marks with all needed relationships loaded at once
        $marks = \App\Models\Mark::where('student_id', $student->id)
            ->with(['subject:id,name,code', 'academicYear:id,name', 'teacher.user:id,name'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Group marks by subject to calculate subject-wise performance and ranks
        $subjectPerformance = [];
        $subjects = $marks->groupBy('subject_id');

        // Get section students IDs once for all calculations
        $sectionStudentIds = \App\Models\Student::where('section_id', $student->section_id)
            ->pluck('id');

        foreach ($subjects as $subjectId => $subjectMarks) {
            $subject = $subjectMarks->first()->subject;
            $averageScore = $subjectMarks->avg('score');

            // Calculate rank for this subject within section based on TOTAL SCORE
            $subjectTotals = \App\Models\Mark::where('subject_id', $subjectId)
                ->whereIn('student_id', $sectionStudentIds)
                ->selectRaw('student_id, SUM(score) as total_score')
                ->groupBy('student_id')
                ->orderByDesc('total_score')
                ->get();

            $rank = $subjectTotals->search(function ($item) use ($student) {
                return $item->student_id == $student->id;
            });
            $rank = $rank !== false ? $rank + 1 : 'N/A';

            // Get detailed assessment breakdown for this subject
            $assessmentBreakdown = $subjectMarks->map(function ($mark) {
                return [
                    'assessment_type' => $mark->assessmentType->name ?? 'Grade Entry',
                    'semester' => $mark->semester,
                    'score' => $mark->score,
                    'max_score' => $mark->max_score ?? 100,
                    'date' => $mark->created_at->format('Y-m-d'),
                ];
            });

            // Calculate total score for this student
            $totalScore = $subjectMarks->sum('score');
            $maxScorePossible = $subjectMarks->sum('max_score');

            $subjectPerformance[] = [
                'subject' => $subject,
                'total_score' => $totalScore,
                'max_score' => $maxScorePossible,
                'rank' => $rank,
                'total_students' => $subjectTotals->count(),
                'assessments' => $assessmentBreakdown,
            ];
        }

        // Calculate trend data (average score per semester)
        $trendData = $marks->groupBy(function ($mark) {
            return $mark->academicYear->name . ' - ' . $mark->semester;
        })->map(function ($periodMarks, $period) {
            return [
                'period' => $period,
                'average' => round($periodMarks->avg('score'), 2),
            ];
        })->values();

        return inertia('Student/AcademicRecords', [
            'student' => $student,
            'marks' => $marks,
            'subjectPerformance' => $subjectPerformance,
            'trendData' => $trendData,
            'academicYear' => $academicYear,
        ]);
    }

    // FR-02: Admission Application (Disabled due to missing model)
    public function admissionForm()
    {
        return redirect()->route('student.dashboard')->with('error', 'Admission feature is currently unavailable.');
    }

    public function admissionStore(Request $request)
    {
        return redirect()->route('student.dashboard')->with('error', 'Admission feature is currently unavailable.');
    }

    // FR-04, FR-05: Annual Registration
    public function registrationForm()
    {
        $user = auth()->user();
        $student = $user->student;
        $academicYear = \App\Models\AcademicYear::where('status', 'active')->first();

        // Check if already registered for this year
        $existingRegistration = $student->registrations()
            ->where('academic_year_id', $academicYear->id)
            ->first();

        $subjects = collect();
        if ($student->grade_id) {
            $subjects = \App\Models\Subject::where('grade_id', $student->grade_id)->get();
        }

        $streams = \App\Models\Stream::all();
        $nextGrade = \App\Models\Grade::where('level', $student->grade->level + 1)->first();

        return inertia('Student/AnnualRegistration', [
            'student' => $student,
            'academicYear' => $academicYear,
            'existingRegistration' => $existingRegistration,
            'streams' => $streams,
            'nextGrade' => $nextGrade,
        ]);
    }

    public function registrationStore(Request $request)
    {
        $user = auth()->user();
        $student = $user->student;
        $academicYear = \App\Models\AcademicYear::where('status', 'active')->first();

        // Check if already registered
        $existing = $student->registrations()
            ->where('academic_year_id', $academicYear->id)
            ->first();

        if ($existing) {
            return back()->withErrors(['error' => 'You are already registered for this academic year.']);
        }

        $validated = $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'stream_id' => 'nullable|exists:streams,id',
        ]);

        // Create registration
        \App\Models\Registration::create([
            'student_id' => $student->id,
            'academic_year_id' => $academicYear->id,
            'grade_id' => $validated['grade_id'],
            'section_id' => $student->section_id,
            'stream_id' => $validated['stream_id'],
            'registration_date' => now(),
            'status' => 'completed',
        ]);

        return redirect()->route('student.dashboard')->with('success', 'Registration completed successfully!');
    }

    // FR-06: Grade Audit
    public function gradeAudit()
    {
        $user = auth()->user();
        $student = $user->student;

        // Get all registrations with grades and results
        $registrations = $student->registrations()
            ->with(['grade', 'academicYear', 'section'])
            ->orderBy('academic_year_id', 'desc')
            ->get();

        // Get semester and final results for each registration
        $gradeHistory = [];
        foreach ($registrations as $registration) {
            $semesterResults = $student->semesterResults()
                ->where('academic_year_id', $registration->academic_year_id)
                ->where('grade_id', $registration->grade_id)
                ->get();

            $finalResult = $student->finalResults()
                ->where('academic_year_id', $registration->academic_year_id)
                ->where('grade_id', $registration->grade_id)
                ->first();

            $gradeHistory[] = [
                'grade' => $registration->grade,
                'academic_year' => $registration->academicYear,
                'section' => $registration->section,
                'semester_results' => $semesterResults,
                'final_result' => $finalResult,
            ];
        }

        return inertia('Student/GradeAudit', [
            'student' => $student,
            'gradeHistory' => $gradeHistory,
        ]);
    }
    // FR-07: View Schedule
    public function schedule()
    {
        $user = auth()->user();
        $student = $user->student;

        $schedule = \App\Models\Schedule::where('grade_id', $student->grade_id)
            ->where(function ($q) use ($student) {
                $q->where('section_id', $student->section_id)
                    ->orWhereNull('section_id');
            })
            ->whereRaw('is_active = true')
            ->orderByRaw("CASE day_of_week 
                WHEN 'Monday' THEN 1 
                WHEN 'Tuesday' THEN 2 
                WHEN 'Wednesday' THEN 3 
                WHEN 'Thursday' THEN 4 
                WHEN 'Friday' THEN 5 
                ELSE 6 END")
            ->orderBy('start_time')
            ->get()
            ->groupBy('day_of_week');

        return inertia('Student/Schedule', [
            'student' => $student->load('grade', 'section'),
            'schedule' => $schedule,
        ]);
    }

    public function attendance()
    {
        $user = auth()->user();
        $student = $user->student()->with(['grade:id,name', 'section:id,name'])->first();

        if (!$student) {
            return redirect()->route('student.dashboard')->with('error', 'Student record not found.');
        }

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

        return inertia('Student/Attendance/Index', [
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
}
