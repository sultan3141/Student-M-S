<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DirectorCommunicationController extends Controller
{
    /**
     * Display announcement history.
     */
    public function index()
    {
        $announcements = Announcement::with(['sender'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Director/Communication/Index', [
            'announcements' => $announcements,
        ]);
    }

    /**
     * Show compose form.
     */
    public function compose()
    {
        return Inertia::render('Director/Communication/Compose');
    }

    /**
     * Send announcement.
     */
    public function send(Request $request)
    {
        $validated = $request->validate([
            'recipient_type' => 'required|string',
            'recipient_ids' => 'nullable|array',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'attachments' => 'nullable|array',
            'schedule_type' => 'required|in:now,scheduled',
            'scheduled_at' => 'required_if:schedule_type,scheduled|nullable|date',
        ]);

        // Calculate recipients
        $totalRecipients = $this->calculateRecipients($validated['recipient_type'], $validated['recipient_ids'] ?? []);

        $announcement = Announcement::create([
            'sender_id' => auth()->id(),
            'recipient_type' => $validated['recipient_type'],
            'recipient_ids' => $validated['recipient_ids'] ?? null,
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'attachments' => $validated['attachments'] ?? null,
            'scheduled_at' => $validated['schedule_type'] === 'scheduled' ? $validated['scheduled_at'] : null,
            'sent_at' => $validated['schedule_type'] === 'now' ? now() : null,
            'status' => $validated['schedule_type'] === 'now' ? 'sent' : 'scheduled',
            'total_recipients' => $totalRecipients,
        ]);

        // If sending now, trigger actual sending
        if ($validated['schedule_type'] === 'now') {
            $this->sendEmail($announcement);
        }

        // Audit Log
        \App\Services\AuditLogger::log(
            'ANNOUNCEMENT_SENT',
            'COMMUNICATION',
            "Sent announcement '{$validated['subject']}' to {$validated['recipient_type']}",
            ['recipient_count' => $totalRecipients, 'schedule' => $validated['schedule_type']]
        );

        return redirect()->route('director.announcements.index')
            ->with('success', 'Announcement ' . ($validated['schedule_type'] === 'now' ? 'sent' : 'scheduled') . ' successfully');
    }

    /**
     * Get campaign analytics.
     */
    public function getAnalytics($id)
    {
        $announcement = Announcement::findOrFail($id);

        return response()->json([
            'subject' => $announcement->subject,
            'sent_at' => $announcement->sent_at,
            'total_recipients' => $announcement->total_recipients,
            'opened_count' => $announcement->opened_count,
            'clicked_count' => $announcement->clicked_count,
            'open_rate' => $announcement->open_rate,
            'click_rate' => $announcement->click_rate,
        ]);
    }

    /**
     * Calculate number of recipients.
     */
    private function calculateRecipients($type, $ids = [])
    {
        switch ($type) {
            case 'all_parents':
                return User::role('parent')->count();
            case 'all_teachers':
                return User::role('teacher')->count();
            case 'specific':
                return count($ids);
            default:
                // Handle Grade specific: 'grade_9', etc.
                if (str_starts_with($type, 'grade_')) {
                    $gradeId = str_replace('grade_', '', $type);
                    return User::whereHas('student', function($q) use ($gradeId) {
                        $q->where('grade_id', $gradeId);
                    })->count();
                }
                return 0;
        }
    }

    /**
     * Send actual email (placeholder).
     */
    private function sendEmail($announcement)
    {
        // Implementation for actual email sending
        // Use Laravel Mail or queue for background processing
        // This is a placeholder
    }
}
