<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminController extends Controller
{
    public function dashboard()
    {
        // Calculate dashboard statistics
        $totalStudents = Student::count();
        $maleStudents = Student::where('gender', 'male')->count();
        $femaleStudents = Student::where('gender', 'female')->count();
        
        // Payment status (placeholder - adjust based on your payment model)
        $paidStudents = 525; // Replace with actual query
        $partialStudents = 214;
        $unpaidStudents = 110;
        
        // Total revenue (placeholder)
        $totalRevenue = 16350000; // in Birr
        
        // Grade distribution
        $gradeDistribution = [
            ['grade' => 'Grade 1', 'enrolled' => 68, 'capacity' => 165, 'male' => 35, 'female' => 33, 'available' => 97],
            ['grade' => 'Grade 2', 'enrolled' => 72, 'capacity' => 165, 'male' => 38, 'female' => 34, 'available' => 93],
            ['grade' => 'Grade 3', 'enrolled' => 75, 'capacity' => 165, 'male' => 40, 'female' => 35, 'available' => 90],
            ['grade' => 'Grade 4', 'enrolled' => 71, 'capacity' => 165, 'male' => 36, 'female' => 35, 'available' => 94],
            ['grade' => 'Grade 5', 'enrolled' => 69, 'capacity' => 165, 'male' => 34, 'female' => 35, 'available' => 96],
            ['grade' => 'Grade 6', 'enrolled' => 74, 'capacity' => 165, 'male' => 38, 'female' => 36, 'available' => 91],
            ['grade' => 'Grade 7', 'enrolled' => 73, 'capacity' => 165, 'male' => 37, 'female' => 36, 'available' => 92],
        ];
        
        return Inertia::render('SuperAdmin/Dashboard', [
            'stats' => [
                'totalStudents' => $totalStudents,
                'maleStudents' => $maleStudents,
                'femaleStudents' => $femaleStudents,
                'paidStudents' => $paidStudents,
                'partialStudents' => $partialStudents,
                'unpaidStudents' => $unpaidStudents,
                'totalRevenue' => $totalRevenue,
            ],
            'gradeDistribution' => $gradeDistribution,
        ]);
    }
}
