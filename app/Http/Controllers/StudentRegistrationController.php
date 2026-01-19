<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Grade;
use App\Models\Registration;
use App\Models\Stream;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentRegistrationController extends Controller
{
    public function create()
    {
        $student = Auth::user()->student;
        
        if (!$student) {
            abort(403, 'Student profile not found.');
        }

        $academicYear = AcademicYear::where('status', 'active')->first() 
                        ?? AcademicYear::latest('start_date')->first();

        $existingRegistration = null;
        if ($academicYear) {
            $existingRegistration = Registration::where('student_id', $student->id)
                ->where('academic_year_id', $academicYear->id)
                ->with(['grade', 'section', 'stream'])
                ->first();
        }

        $currentGrade = $student->grade;
        $nextGrade = null;
        if ($currentGrade) {
            $nextGrade = Grade::where('level', $currentGrade->level + 1)->first();
        }
        
        $streams = Stream::all();

        return Inertia::render('Student/AnnualRegistration', [
            'student' => $student->load('grade', 'section'),
            'academicYear' => $academicYear,
            'existingRegistration' => $existingRegistration,
            'nextGrade' => $nextGrade,
            'streams' => $streams,
        ]);
    }

    public function store(Request $request)
    {
        $student = Auth::user()->student;
        
        if (!$student) {
            abort(403, 'Student profile not found.');
        }

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
            return back()->with('error', 'You are already registered for this academic year.');
        }

        Registration::create([
            'student_id' => $student->id,
            'academic_year_id' => $academicYear->id,
            'grade_id' => $validated['grade_id'],
            'stream_id' => $validated['stream_id'] ?? null,
            'registration_date' => now(),
            'status' => 'Pending', 
        ]);

        return redirect()->route('student.dashboard')->with('success', 'Registration submitted successfully.');
    }
}
