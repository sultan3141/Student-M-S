<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Student;
use App\Models\User;
use App\Models\Subject;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function global(Request $request)
    {
        $query = $request->get('q', '');
        $type = $request->get('type', 'all');
        
        if (empty($query)) {
            return response()->json([
                'assessments' => [],
                'students' => [],
                'teachers' => [],
                'subjects' => []
            ]);
        }

        $results = [];

        // Search Assessments
        if ($type === 'all' || $type === 'assessments') {
            $assessments = Assessment::with(['subject', 'grade', 'creator'])
                ->where('title', 'LIKE', "%{$query}%")
                ->orWhere('description', 'LIKE', "%{$query}%")
                ->limit(10)
                ->get();
            
            $results['assessments'] = $assessments;
        }

        // Search Students (only for authorized users)
        if (($type === 'all' || $type === 'students') && auth()->user()->hasAnyRole(['school_director', 'registrar', 'teacher'])) {
            $students = Student::with(['user', 'grade', 'section'])
                ->whereHas('user', function($q) use ($query) {
                    $q->where('name', 'LIKE', "%{$query}%");
                })
                ->orWhere('student_id', 'LIKE', "%{$query}%")
                ->limit(10)
                ->get();
            
            $results['students'] = $students;
        }

        // Search Teachers
        if (($type === 'all' || $type === 'teachers') && auth()->user()->hasAnyRole(['school_director', 'registrar'])) {
            $teachers = User::role('teacher')
                ->where('name', 'LIKE', "%{$query}%")
                ->orWhere('email', 'LIKE', "%{$query}%")
                ->limit(10)
                ->get();
            
            $results['teachers'] = $teachers;
        }

        // Search Subjects
        if ($type === 'all' || $type === 'subjects') {
            $subjects = Subject::with('grade')
                ->where('name', 'LIKE', "%{$query}%")
                ->orWhere('code', 'LIKE', "%{$query}%")
                ->limit(10)
                ->get();
            
            $results['subjects'] = $subjects;
        }

        return response()->json($results);
    }

    public function assessments(Request $request)
    {
        $query = $request->get('q', '');
        $gradeId = $request->get('grade_id');
        $subjectId = $request->get('subject_id');
        $status = $request->get('status');
        $type = $request->get('assessment_type');

        $assessments = Assessment::with(['subject', 'grade', 'creator'])
            ->when($query, function($q) use ($query) {
                $q->where('title', 'LIKE', "%{$query}%")
                  ->orWhere('description', 'LIKE', "%{$query}%");
            })
            ->when($gradeId, function($q) use ($gradeId) {
                $q->where('grade_id', $gradeId);
            })
            ->when($subjectId, function($q) use ($subjectId) {
                $q->where('subject_id', $subjectId);
            })
            ->when($status, function($q) use ($status) {
                $q->where('status', $status);
            })
            ->when($type, function($q) use ($type) {
                $q->where('assessment_type', $type);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($assessments);
    }
}