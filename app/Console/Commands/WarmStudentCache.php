<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Student;
use App\Models\AcademicYear;
use App\Models\Mark;
use Illuminate\Support\Facades\Cache;

class WarmStudentCache extends Command
{
    protected $signature = 'cache:warm-student {student_id? : The student ID to warm cache for}';
    protected $description = 'Pre-warm cache for student dashboards';

    public function handle()
    {
        $studentId = $this->argument('student_id');

        if ($studentId) {
            $this->warmCacheForStudent($studentId);
        } else {
            // Warm cache for all students
            $students = Student::with('user')->get();
            $bar = $this->output->createProgressBar($students->count());
            
            foreach ($students as $student) {
                $this->warmCacheForStudent($student->user_id);
                $bar->advance();
            }
            
            $bar->finish();
            $this->newLine();
        }

        $this->info('Student cache warmed successfully!');
        return 0;
    }

    private function warmCacheForStudent($userId)
    {
        $user = User::find($userId);
        if (!$user || !$user->student) {
            return;
        }

        $student = $user->student;
        $academicYear = \DB::table('academic_years')
            ->whereRaw('is_current = true')
            ->first();

        if (!$academicYear) {
            return;
        }

        // Warm dashboard cache
        $cacheKey = "student_dashboard_{$userId}";
        Cache::forget($cacheKey);
        
        // Pre-calculate stats
        $gpaKey = "gpa_{$student->id}_{$academicYear->id}";
        Cache::forget($gpaKey);
        Cache::remember($gpaKey, 300, function () use ($student, $academicYear) {
            $average = \DB::table('marks')
                ->where('student_id', $student->id)
                ->where('academic_year_id', $academicYear->id)
                ->avg('score');
            return $average ? round($average / 25, 2) : 0;
        });

        // Pre-calculate rank
        $rankKey = "rank_{$student->id}_{$academicYear->id}";
        Cache::forget($rankKey);
        Cache::remember($rankKey, 300, function () use ($student, $academicYear) {
            $rank = \DB::table('semester_results')
                ->where('student_id', $student->id)
                ->where('academic_year_id', $academicYear->id)
                ->where('grade_id', $student->grade_id)
                ->orderBy('created_at', 'desc')
                ->value('rank');
            return $rank;
        });

        // Warm semester list cache
        $semesterKey = "semester_list_{$userId}";
        Cache::forget($semesterKey);
    }
}
