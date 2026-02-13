<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentAnnouncementController extends Controller
{
    /**
     * Display announcements for the student.
     */
    public function index()
    {
        $user = Auth::user();
        $student = $user->student;
        $gradeId = $student ? $student->grade_id : null;

        $announcements = Announcement::with('sender')
            ->where(function ($query) use ($user, $gradeId) {
                // Announcements for everyone/students (if implemented)
                // $query->where('recipient_type', 'all_students'); 
    
                // Grade specific
                if ($gradeId) {
                    $query->orWhere('recipient_type', 'grade_' . $gradeId);
                }

                // Specific user
                $query->orWhere(function ($q) use ($user) {
                    $q->where('recipient_type', 'specific')
                        ->whereJsonContains('recipient_ids', (string) $user->id);
                });
            })
            ->whereNotNull('sent_at')
            ->latest('sent_at')
            ->paginate(10);

        return Inertia::render('Student/Announcements/Index', [
            'announcements' => $announcements,
        ]);
    }
}
