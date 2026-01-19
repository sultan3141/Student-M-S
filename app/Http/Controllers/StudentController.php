<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        $student = $user->student()->with([
            'grade', 
            'section.classTeacher.user', 
            'currentRegistration.academicYear',
            'currentRegistration.grade',
            'currentRegistration.section'
        ])->first();

        if (!$student) {
             return redirect()->route('student.profile.edit')->with('error', 'Student record not found.');
        }

        // 1. Academic Year
        $academicYear = $student->currentRegistration 
            ? $student->currentRegistration->academicYear 
            : \App\Models\AcademicYear::where('status', 'active')->first();
            
        if (!$academicYear) {
             $academicYear = \App\Models\AcademicYear::latest()->first();
        }

        // 2. Subjects
        $subjects = collect();
        if ($student->currentRegistration) {
             $subjects = \App\Models\Subject::where('grade_id', $student->currentRegistration->grade_id)->get();
        } elseif ($student->grade_id) {
             $subjects = \App\Models\Subject::where('grade_id', $student->grade_id)->get();
        }

        // 3. Promotion Status (Simplified)
        $promotionStatus = 'Eligible';
        
        // 4. Stats
        $stats = [
            'gpa' => $this->calculateGPA($student, $academicYear),
            'attendance' => $this->calculateAttendanceRate($student, $academicYear),
            'rank' => $this->getCurrentRank($student, $academicYear) ?? 'N/A',
            'pass_percentage' => 85,
        ];

        // 5. Charts
        $charts = [
            'gender' => [
                'Male' => \App\Models\Student::where('gender', 'male')->count(),
                'Female' => \App\Models\Student::where('gender', 'female')->count(),
            ]
        ];

        return inertia('Student/Dashboard', [
            'student' => $student,
            'academicYear' => $academicYear,
            'subjects' => $subjects,
            'promotionStatus' => $promotionStatus,
            'stats' => $stats,
            'charts' => $charts
        ]);
    }

    private function calculateGPA($student, $academicYear)
    {
        if (!$academicYear) return 0;
        
        $average = $student->marks()
            ->where('academic_year_id', $academicYear->id)
            ->avg('score_obtained');
        
        return $average ? round($average / 25, 2) : 0; // Convert to 4.0 scale
    }

    private function getCurrentRank($student, $academicYear)
    {
        if (!$academicYear || !$student->grade_id) return null;
        
        $semesterResult = $student->semesterResults()
            ->where('academic_year_id', $academicYear->id)
            ->where('grade_id', $student->grade_id)
            ->latest()
            ->first();
        
        return $semesterResult ? $semesterResult->rank : null;
    }

    private function calculateAttendanceRate($student, $academicYear)
    {
        if (!$academicYear) return 100;
        
        $total = $student->attendances()
            ->where('academic_year_id', $academicYear->id)
            ->count();
        
        if ($total === 0) return 100;
        
        $present = $student->attendances()
            ->where('academic_year_id', $academicYear->id)
            ->where('status', 'present')
            ->count();
        
        return round(($present / $total) * 100, 1);
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
        $student = $user->student()->with(['grade', 'section'])->first();
        $academicYear = \App\Models\AcademicYear::where('status', 'active')->first();

        // Get all marks for this student with subject and academic year info
        $marks = \App\Models\Mark::where('student_id', $student->id)
            ->with(['subject', 'academicYear'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Group marks by subject to calculate subject-wise performance and ranks
        $subjectPerformance = [];
        $subjects = $marks->groupBy('subject_id');
        
        foreach ($subjects as $subjectId => $subjectMarks) {
            $subject = $subjectMarks->first()->subject;
            $averageScore = $subjectMarks->avg('score');
            
            // Get all students in the same section
            $sectionStudents = \App\Models\Student::where('section_id', $student->section_id)
                ->pluck('id');
            
            // Calculate rank for this subject within section
            $subjectAverages = \App\Models\Mark::where('subject_id', $subjectId)
                ->whereIn('student_id', $sectionStudents)
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
