<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        
        // Single query to get student with minimal data
        $student = $user->student()
            ->select('id', 'user_id', 'student_id', 'grade_id', 'section_id')
            ->first();

        if (!$student) {
            return redirect()->route('student.profile.edit')->with('error', 'Student record not found.');
        }

        // Get academic year - cached globally with proper boolean handling
        $academicYear = cache()->remember('current_academic_year', 3600, function () {
            return \DB::table('academic_years')
                ->select('id', 'name')
                ->whereRaw('is_current = TRUE')
                ->first();
        });
        
        // Fallback if no current academic year
        if (!$academicYear) {
            $academicYear = \DB::table('academic_years')
                ->select('id', 'name')
                ->orderBy('id', 'desc')
                ->first();
        }
        
        // Get subjects - cached per grade
        $subjects = cache()->remember("subjects_grade_{$student->grade_id}", 3600, function () use ($student) {
            return \DB::table('subjects')
                ->select('id', 'name', 'code', 'credit_hours')
                ->where('grade_id', $student->grade_id)
                ->get();
        });

        // Get stats in ONE query using subqueries
        $stats = \DB::table('marks')
            ->where('student_id', $student->id)
            ->where('academic_year_id', $academicYear->id)
            ->selectRaw('ROUND(AVG(score), 2) as gpa')
            ->selectRaw('COUNT(*) as total_marks')
            ->first();

        // Get rank from semester_results
        $rank = \DB::table('semester_results')
            ->where('student_id', $student->id)
            ->where('academic_year_id', $academicYear->id)
            ->orderBy('semester', 'desc')
            ->value('rank') ?? 'N/A';

        // Get attendance count
        $attendanceStats = \DB::table('attendances')
            ->where('student_id', $student->id)
            ->where('academic_year_id', $academicYear->id)
            ->selectRaw("COUNT(*) as total")
            ->selectRaw("SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present")
            ->first();
        
        $attendanceRate = $attendanceStats && $attendanceStats->total > 0 
            ? round(($attendanceStats->present / $attendanceStats->total) * 100, 1) 
            : 100;

        // Get registration status
        $hasRegistration = \DB::table('registrations')
            ->where('student_id', $student->id)
            ->where('academic_year_id', $academicYear->id)
            ->exists();

        // Get grade and section names in one query
        $gradeSection = \DB::table('students')
            ->join('grades', 'students.grade_id', '=', 'grades.id')
            ->join('sections', 'students.section_id', '=', 'sections.id')
            ->where('students.id', $student->id)
            ->select('grades.name as grade_name', 'sections.name as section_name')
            ->first();

        // Get school-wide statistics for the new dashboard layout
        $statistics = cache()->remember('school_wide_statistics_v2', 600, function () {
            $totalStudents = \App\Models\Student::count();
            $maleStudents = \App\Models\Student::where('gender', 'Male')->count();
            $femaleStudents = \App\Models\Student::where('gender', 'Female')->count();
            $totalInstructors = \App\Models\Teacher::count();

            // Grade breakdown for 9-12
            $gradeBreakdown = \DB::table('grades')
                ->leftJoin('students', 'grades.id', '=', 'students.grade_id')
                ->whereIn('grades.level', [9, 10, 11, 12])
                ->select('grades.name', 'grades.level', \DB::raw('count(students.id) as count'))
                ->groupBy('grades.id', 'grades.name', 'grades.level')
                ->orderBy('grades.level')
                ->get()
                ->map(function($grade) use ($totalStudents) {
                    return [
                        'name' => $grade->name,
                        'level' => $grade->level,
                        'count' => $grade->count,
                        'percent' => $totalStudents > 0 ? round(($grade->count / $totalStudents) * 100, 1) : 0
                    ];
                });

            return [
                'students' => [
                    'male' => $maleStudents,
                    'female' => $femaleStudents,
                    'total' => $totalStudents,
                    'malePercent' => $totalStudents > 0 ? round(($maleStudents / $totalStudents) * 100, 1) : 0,
                    'femalePercent' => $totalStudents > 0 ? round(($femaleStudents / $totalStudents) * 100, 1) : 0,
                ],
                'instructors' => $totalInstructors,
                'gradeBreakdown' => $gradeBreakdown,
            ];
        });

        // Get historical performance from final_results
        $pastPerformance = \DB::table('final_results')
            ->join('academic_years', 'final_results.academic_year_id', '=', 'academic_years.id')
            ->where('student_id', $student->id)
            ->orderBy('academic_years.start_date', 'asc')
            ->select('academic_years.name as year', 'combined_average as average')
            ->get();

        return inertia('Student/Dashboard', [
            'student' => [
                'id' => $student->id,
                'student_id' => $student->student_id,
                'user' => ['name' => $user->name],
                'grade' => ['name' => $gradeSection ? $gradeSection->grade_name : 'N/A'],
                'section' => ['name' => $gradeSection ? $gradeSection->section_name : 'N/A'],
                'current_registration' => $hasRegistration ? ['exists' => true] : null,
            ],
            'academicYear' => $academicYear,
            'subjects' => $subjects,
            'promotionStatus' => 'Eligible',
            'stats' => [
                'gpa' => $stats && $stats->gpa ? round($stats->gpa / 25, 2) : 0,
                'attendance' => $attendanceRate,
                'rank' => $rank,
                'pass_percentage' => 85,
            ],
            'statistics' => $statistics,
            'pastPerformance' => $pastPerformance,
        ]);
    }

    private function calculateGPAFast($studentId, $academicYearId)
    {
        if (!$academicYearId) return 0;
        
        $cacheKey = "gpa_{$studentId}_{$academicYearId}";
        
        return cache()->remember($cacheKey, 300, function () use ($studentId, $academicYearId) {
            $average = \App\Models\Mark::where('student_id', $studentId)
                ->where('academic_year_id', $academicYearId)
                ->avg('score');
            
            return $average ? round($average / 25, 2) : 0;
        });
    }

    private function getCurrentRankFast($studentId, $gradeId, $academicYearId)
    {
        if (!$academicYearId || !$gradeId) return null;
        
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
        if (!$academicYearId) return 100;
        
        $cacheKey = "attendance_{$studentId}_{$academicYearId}";
        
        return cache()->remember($cacheKey, 300, function () use ($studentId, $academicYearId) {
            $total = \App\Models\Attendance::where('student_id', $studentId)
                ->where('academic_year_id', $academicYearId)
                ->count();
            
            if ($total === 0) return 100;
            
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
        if (!$academicYear || !$student->grade_id) return 0;
        
        // Get all assessments for subjects in this grade
        $assessmentIds = \App\Models\Assessment::where('academic_year_id', $academicYear->id)
            ->whereHas('subject', function($q) use ($student) {
                $q->where('grade_id', $student->grade_id);
            })
            ->where('type', 'assignment')
            ->pluck('id');
        
        if ($assessmentIds->isEmpty()) return 0;

        // Count how many have NO mark for this student
        $submittedCount = \App\Models\StudentMark::where('student_id', $student->id)
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
            return \App\Models\AcademicYear::where('is_current', true)
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
            
            // Calculate rank for this subject within section - optimized query
            $subjectAverages = \App\Models\Mark::where('subject_id', $subjectId)
                ->whereIn('student_id', $sectionStudentIds)
                ->selectRaw('student_id, AVG(score) as avg_score')
                ->groupBy('student_id')
                ->orderByDesc('avg_score')
                ->get();
            
            $rank = $subjectAverages->search(function($item) use ($student) {
                return $item->student_id == $student->id;
            }) + 1;
            
            // Get detailed assessment breakdown for this subject
            $assessmentBreakdown = $subjectMarks->map(function($mark) {
                return [
                    'assessment_type' => $mark->assessment_type,
                    'semester' => $mark->semester,
                    'score' => $mark->score,
                    'max_score' => $mark->max_score ?? 100,
                    'date' => $mark->created_at->format('Y-m-d'),
                ];
            });
            
            $subjectPerformance[] = [
                'subject' => $subject,
                'average_score' => round($averageScore, 2),
                'rank' => $rank,
                'total_students' => $subjectAverages->count(),
                'assessments' => $assessmentBreakdown,
                'grade' => $this->calculateLetterGrade($averageScore),
            ];
        }
        
        // Calculate trend data (average score per semester)
        $trendData = $marks->groupBy(function($mark) {
            return $mark->academicYear->name . ' - ' . $mark->semester;
        })->map(function($periodMarks, $period) {
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
    
    private function calculateLetterGrade($score)
    {
        if ($score >= 90) return 'A';
        if ($score >= 80) return 'B';
        if ($score >= 70) return 'C';
        if ($score >= 60) return 'D';
        return 'F';
    }

    // FR-02: Admission Application
    public function admissionForm()
    {
        $grades = \App\Models\Grade::all();
        return inertia('Student/AdmissionApplication', [
            'grades' => $grades,
        ]);
    }

    public function admissionStore(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'dob' => 'required|date',
            'gender' => 'required|in:male,female',
            'grade_applying' => 'required|exists:grades,id',
            'previous_school' => 'nullable|string|max:255',
            'parent_name' => 'required|string|max:255',
            'parent_phone' => 'required|string|max:20',
            'parent_email' => 'nullable|email',
            'address' => 'required|string',
        ]);

        // Create admission record
        \App\Models\Admission::create([
            'full_name' => $validated['full_name'],
            'dob' => $validated['dob'],
            'gender' => $validated['gender'],
            'grade_applying' => $validated['grade_applying'],
            'previous_school' => $validated['previous_school'],
            'parent_name' => $validated['parent_name'],
            'parent_phone' => $validated['parent_phone'],
            'parent_email' => $validated['parent_email'],
            'address' => $validated['address'],
            'status' => 'submitted',
        ]);

        return redirect()->route('student.dashboard')->with('success', 'Application submitted successfully!');
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
}
