<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Mark;
use App\Models\Ranking;

class TeacherStudentController extends Controller
{
    /**
     * Display a listing of students in the teacher's classes.
     */
    public function index()
    {
        // Mock data for student list
        $students = [
            [
                'id' => 1,
                'name' => 'John Doe',
                'class' => '10A',
                'average_score' => 85.5,
                'attendance' => 92,
                'status' => 'Excellent',
                'trend' => 'up',
            ],
            [
                'id' => 2,
                'name' => 'Jane Smith',
                'class' => '10A',
                'average_score' => 72.0,
                'attendance' => 88,
                'status' => 'Good',
                'trend' => 'stable',
            ],
            [
                'id' => 3,
                'name' => 'Alice Johnson',
                'class' => '10B',
                'average_score' => 45.0,
                'attendance' => 75,
                'status' => 'Critical',
                'trend' => 'down',
            ],
            // Add more mock students...
        ];

        return Inertia::render('Teacher/Students/Index', [
            'students' => $students
        ]);
    }

    /**
     * Display detailed performance analytics for a specific student.
     */
    public function show($studentId)
    {
        // Mock data for individual student details
        $student = [
            'id' => $studentId,
            'name' => 'John Doe',
            'class' => '10A',
            'email' => 'john.doe@student.school.com',
            'parent_email' => 'parent.doe@gmail.com',
            'photo_url' => null,
        ];

        // Mock performance history
        $performanceHistory = [
            ['assessment' => 'Midterm 1', 'score' => 82, 'average' => 75, 'date' => '2025-09-15'],
            ['assessment' => 'Quiz 1', 'score' => 88, 'average' => 78, 'date' => '2025-10-01'],
            ['assessment' => 'Midterm 2', 'score' => 79, 'average' => 76, 'date' => '2025-10-20'],
            ['assessment' => 'Final', 'score' => 90, 'average' => 80, 'date' => '2025-12-10'],
        ];

        // Mock subject breakdown
        $subjectPerformance = [
            ['subject' => 'Mathematics', 'score' => 88, 'letter' => 'A'],
            ['subject' => 'Physics', 'score' => 76, 'letter' => 'B'],
            ['subject' => 'Chemistry', 'score' => 92, 'letter' => 'A+'],
            ['subject' => 'English', 'score' => 81, 'letter' => 'A-'],
        ];

        return Inertia::render('Teacher/Students/Show', [
            'student' => $student,
            'history' => $performanceHistory,
            'subjects' => $subjectPerformance,
        ]);
    }
}
