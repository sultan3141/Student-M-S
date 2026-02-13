<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeacherAnnouncementController extends Controller
{
    /**
     * Display announcements for the teacher.
     */
    public function index()
    {
        $userId = Auth::id();

        $announcements = Announcement::with('sender')
            ->where(function ($query) use ($userId) {
                $query->where('recipient_type', 'all_teachers')
                    ->orWhere(function ($q) use ($userId) {
                        $q->where('recipient_type', 'specific')
                            ->whereJsonContains('recipient_ids', (string) $userId);
                    });
            })
            ->whereNotNull('sent_at') // Only sent announcements
            ->latest('sent_at')
            ->paginate(10);

        return Inertia::render('Teacher/Announcements/Index', [
            'announcements' => $announcements,
        ]);
    }
}
