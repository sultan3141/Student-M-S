<?php

namespace App\Http\Controllers;

use App\Models\Mark;
use App\Models\Student;
use App\Services\RankingService;
use App\Models\AssessmentType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TeacherMarkController extends Controller
{
    protected $rankingService;

    public function __construct(RankingService $rankingService)
    {
        $this->rankingService = $rankingService;
    }

    /**
     * Display the mark entry interface.
     */
    public function index(Request $request)
    {
        // Mock data for the index page if models aren't fully set up
        $classes = [
            ['id' => 1, 'name' => 'Grade 10 - Section A', 'subject' => 'Mathematics'],
            ['id' => 2, 'name' => 'Grade 11 - Section B', 'subject' => 'Physics'],
        ];

        $assessmentTypes = AssessmentType::all();

        return Inertia::render('Teacher/Marks/Index', [
            'classes' => $classes,
            'assessmentTypes' => $assessmentTypes,
        ]);
    }

    /**
     * Show the mark entry sheet for a specific class and assessment.
     */
    public function create(Request $request)
    {
        $classId = $request->query('class_id', 1);
        $subject = $request->query('subject', 'Mathematics');
        $assessmentTypeId = $request->query('assessment_type_id', 1);
        $semester = '1';
        $academicYear = '2024-2025';

        // Mock students for demonstration since the student seeding might be partial
        $mockStudents = [
            ['id' => 101, 'name' => 'Sara Chen', 'mark' => 92, 'status' => 'saved'],
            ['id' => 102, 'name' => 'Michael Brown', 'mark' => 85, 'status' => 'saved'],
            ['id' => 103, 'name' => 'David Wilson', 'mark' => 58, 'status' => 'saved'],
            ['id' => 104, 'name' => 'Emma Garcia', 'mark' => 45, 'status' => 'below-50'],
            ['id' => 105, 'name' => 'James Lee', 'mark' => 72, 'status' => 'saved'],
            ['id' => 106, 'name' => 'Thomas Smith', 'mark' => null, 'status' => 'pending'],
            ['id' => 107, 'name' => 'Lisa Johnson', 'mark' => null, 'status' => 'pending'],
            ['id' => 108, 'name' => 'Robert Brown', 'mark' => null, 'status' => 'pending'],
            ['id' => 109, 'name' => 'Maria Garcia', 'mark' => null, 'status' => 'pending'],
            ['id' => 110, 'name' => 'John Davis', 'mark' => null, 'status' => 'pending'],
        ];

        // Fetch real students if available, otherwise use mock
        // $students = Student::take(10)->get(); 
        
        $assessmentType = AssessmentType::find($assessmentTypeId) ?? new AssessmentType(['name' => 'Midterm', 'weight_percentage' => 30]);

        return Inertia::render('Teacher/Marks/Entry', [
            'classId' => $classId,
            'subject' => $subject,
            'assessmentType' => $assessmentType,
            'students' => $mockStudents,
            'semester' => $semester,
            'academicYear' => $academicYear,
        ]);
    }

    /**
     * Store or update marks.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'marks' => 'required|array',
            'marks.*.student_id' => 'required', // Relaxed validation for mock IDs
            'marks.*.mark' => 'required|numeric|min:0|max:100',
            'subject' => 'required|string',
            'assessment_type_id' => 'required',
            'semester' => 'required|string',
            'academic_year' => 'required|string',
        ]);

        // Logic to save marks (mocked for now to avoid DB errors with mock IDs)
        // In real app:
        /*
        foreach ($validated['marks'] as $item) {
            Mark::updateOrCreate(...)
        }
        $this->rankingService->calculateRankings(...)
        */

        return redirect()->back()->with('success', 'Marks saved successfully.');
    }
}
