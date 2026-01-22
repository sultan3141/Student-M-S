<?php

namespace App\Http\Controllers;

use App\Models\Mark;
use App\Models\Student;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function getStudentNotifications()
    {
        $user = auth()->user();
        $student = $user->student;

        if (!$student) {
            return response()->json(['notifications' => []]);
        }

        // Get recent marks (within last 7 days) as notifications
        $recentMarks = Mark::with(['assessment.subject'])
            ->where('student_id', $student->id)
            ->where('created_at', '>=', now()->subDays(7))
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $notifications = $recentMarks->map(function ($mark) {
            $percentage = ($mark->score / $mark->assessment->max_score) * 100;
            
            return [
                'id' => $mark->id,
                'type' => 'new_mark',
                'title' => 'New Mark Available',
                'message' => "Your mark for '{$mark->assessment->title}' in {$mark->assessment->subject->name} is now available.",
                'data' => [
                    'assessment_title' => $mark->assessment->title,
                    'subject_name' => $mark->assessment->subject->name,
                    'score' => $mark->score,
                    'max_score' => $mark->assessment->max_score,
                    'percentage' => round($percentage, 1)
                ],
                'created_at' => $mark->created_at,
                'is_read' => false // You can implement a read status system later
            ];
        });

        return response()->json(['notifications' => $notifications]);
    }

    public function markAsRead(Request $request)
    {
        // Implementation for marking notifications as read
        // This would require a notifications table in a full implementation
        return response()->json(['success' => true]);
    }
}