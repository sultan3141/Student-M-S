<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;

class RegistrarCompletionController extends Controller
{
    /**
     * Display completion monitor.
     */
    public function index(Request $request)
    {
        // Fetch students with relations needed for checking completion
        $query = Student::with(['user', 'parents', 'grade']);

        // Filter by completion status if requested
        if ($request->has('status')) {
            // This would require more complex DB logic or filtering collection
            // For MVP, we'll fetch all paginated and calculate readiness on the fly
            // Or add a 'completion_percentage' column to student table updated via observer
        }

        $students = $query->latest()->paginate(15);

        // Transform collection to add completion stats
        $students->getCollection()->transform(function ($student) {
            return [
                'id' => $student->id,
                'student_id' => $student->student_id,
                'name' => $student->user->name,
                'grade' => $student->grade->name,
                'joined_at' => $student->created_at->toFormattedDateString(),
                'days_pending' => $student->created_at->diffInDays(now()),
                'completion' => $this->calculateCompletion($student),
            ];
        });

        // Overall Stats
        $total = Student::count();
        $complete = 0; // would need optimized query in production
        
        return inertia('Registrar/Completion/Index', [
            'students' => $students,
            'stats' => [
                'total' => $total,
                'avg_completion' => 65, // Placeholder/Calculated
                'missing_docs' => 15,
            ]
        ]);
    }

    private function calculateCompletion($student)
    {
        $points = 0;
        $total = 4; // Total criteria

        // 1. Personal Info (Always true if created, but check detailing)
        if ($student->gender && $student->dob) $points++;

        // 2. Guardian Linked
        if ($student->parents->count() > 0) $points++;

        // 3. Contact Info
        if ($student->phone || $student->address) $points++;

        // 4. Documents (Placeholder for now)
        // if ($student->documents->count() >= 3) $points++;
        
        // For demo, add partial points
        return ceil(($points / $total) * 100);
    }
}
