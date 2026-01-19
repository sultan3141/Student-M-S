<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminSystemConfigController extends Controller
{
    public function index()
    {
        // Fetch current system configuration
        $config = [
            'grading' => [
                'scales' => [
                    ['min' => 90, 'max' => 100, 'grade' => 'A+', 'gpa' => 4.0],
                    ['min' => 85, 'max' => 89, 'grade' => 'A', 'gpa' => 3.75],
                    ['min' => 80, 'max' => 84, 'grade' => 'B+', 'gpa' => 3.5],
                    ['min' => 75, 'max' => 79, 'grade' => 'B', 'gpa' => 3.0],
                    ['min' => 70, 'max' => 74, 'grade' => 'C+', 'gpa' => 2.5],
                    ['min' => 60, 'max' => 69, 'grade' => 'C', 'gpa' => 2.0],
                    ['min' => 50, 'max' => 59, 'grade' => 'D', 'gpa' => 1.0],
                    ['min' => 0, 'max' => 49, 'grade' => 'F', 'gpa' => 0.0],
                ],
                'assessmentTypes' => [
                    ['name' => 'Quiz', 'percentage' => 10],
                    ['name' => 'Assignment', 'percentage' => 15],
                    ['name' => 'Mid-term', 'percentage' => 25],
                    ['name' => 'Final Exam', 'percentage' => 50],
                ],
            ],
            'fees' => [
                'structures' => [
                    ['grade' => 'Grade 1-3', 'tuition' => 25000, 'registration' => 5000, 'activities' => 3000],
                    ['grade' => 'Grade 4-6', 'tuition' => 28000, 'registration' => 5000, 'activities' => 3500],
                    ['grade' => 'Grade 7-9', 'tuition' => 32000, 'registration' => 6000, 'activities' => 4000],
                ],
                'paymentDeadlines' => [
                    'registration' => '2024-08-15',
                    'firstSemester' => '2024-09-30',
                    'secondSemester' => '2025-02-28',
                ],
            ],
            'academic' => [
                'currentYear' => '2024-2025',
                'semesters' => [
                    ['name' => 'First Semester', 'start' => '2024-09-01', 'end' => '2025-01-15'],
                    ['name' => 'Second Semester', 'start' => '2025-02-01', 'end' => '2025-06-30'],
                ],
                'gradeLevels' => range(1, 12),
            ],
            'workflows' => [
                'studentAdmission' => 'auto',
                'sectionAssignment' => 'auto',
                'gradePromotion' => 'manual',
                'reportCardGeneration' => 'auto',
            ],
            'rolePermissions' => [
                'teacher' => ['enter_marks', 'view_students', 'generate_reports'],
                'registrar' => ['admit_students', 'manage_payments', 'assign_sections'],
                'parent' => ['view_child_data', 'view_marks'],
                'student' => ['view_own_marks', 'view_profile'],
            ],
        ];

        return Inertia::render('SuperAdmin/SystemConfiguration', [
            'config' => $config,
        ]);
    }

    public function updateGrading(Request $request)
    {
        // TODO: Implement grading scale update logic
        // This would typically update a settings table or config file
        
        return back()->with('success', 'Grading configuration updated successfully.');
    }

    public function updateFees(Request $request)
    {
        // TODO: Implement fee structure update logic
        
        return back()->with('success', 'Fee structure updated successfully.');
    }

    public function updateAcademic(Request $request)
    {
        // TODO: Implement academic settings update logic
        
        return back()->with('success', 'Academic settings updated successfully.');
    }

    public function updateWorkflows(Request $request)
    {
        // TODO: Implement workflow settings update logic
        
        return back()->with('success', 'Workflow settings updated successfully.');
    }
}
