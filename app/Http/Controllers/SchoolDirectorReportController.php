<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SchoolDirectorReportController extends Controller
{
    public function index(Request $request)
    {
        $query = \App\Models\Student::with(['user', 'grade', 'section']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('student_id', 'like', "%{$search}%");
        }

        $students = $query->paginate(15)->withQueryString();

        return inertia('Director/Reports/Index', [
            'students' => $students,
            'filters' => $request->only('search'),
        ]);
    }

    public function transcript($id)
    {
        $student = \App\Models\Student::with(['user', 'grade', 'section', 'parent', 'attendances', 'marks.subject'])->findOrFail($id);
        
        $academicYear = \App\Models\AcademicYear::where('status', 'active')->first();

        return inertia('Director/Reports/Transcript', [
            'student' => $student,
            'academicYear' => $academicYear,
            'schoolInfo' => [ // Mock school info
                'name' => 'Islamic Private School',
                'address' => '123 Education Lane, Cityville',
                'phone' => '+123 456 7890',
            ]
        ]);
    }
}
