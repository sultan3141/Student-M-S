<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminSettingsController extends Controller
{
    public function index()
    {
        // Load system configuration from database or config files
        $settings = [
            'academic_year' => '2024/2025',
            'sections_grades_1_8' => 3,
            'sections_grades_9_10' => 3,
            'sections_grades_11_12' => 4,
            'max_section_capacity' => 55,
            'gender_separation_enabled' => true,
            'auto_section_assignment_enabled' => true,
        ];
        
        return Inertia::render('SuperAdmin/SystemConfiguration', [
            'settings' => $settings,
        ]);
    }
    
    public function update(Request $request)
    {
        $validated = $request->validate([
            'academic_year' => 'required|string',
            'sections_grades_1_8' => 'required|integer|min:1',
            'sections_grades_9_10' => 'required|integer|min:1',
            'sections_grades_11_12' => 'required|integer|min:1',
            'max_section_capacity' => 'required|integer|min:1',
            'gender_separation_enabled' => 'boolean',
            'auto_section_assignment_enabled' => 'boolean',
        ]);
        
        // Store settings in database or config file
        // For now, we'll just return success
        
        return back()->with('success', 'Settings updated successfully.');
    }
}
