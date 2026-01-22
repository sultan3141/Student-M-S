<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class ClearStudentCache extends Command
{
    protected $signature = 'cache:clear-student {student_id? : The student ID to clear cache for}';
    protected $description = 'Clear cached data for student dashboards';

    public function handle()
    {
        $studentId = $this->argument('student_id');

        if ($studentId) {
            // Clear cache for specific student
            $patterns = [
                "student_dashboard_{$studentId}",
                "gpa_{$studentId}_*",
                "rank_{$studentId}_*",
                "attendance_{$studentId}_*",
                "semester_list_{$studentId}",
                "semester_detail_{$studentId}_*",
                "academic_year_{$studentId}_*",
            ];

            foreach ($patterns as $pattern) {
                Cache::forget($pattern);
            }

            $this->info("Cache cleared for student ID: {$studentId}");
        } else {
            // Clear all student-related caches
            Cache::flush();
            $this->info('All student caches cleared successfully!');
        }

        return 0;
    }
}
