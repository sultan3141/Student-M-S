<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ParentProfile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class WarmParentCache extends Command
{
    protected $signature = 'cache:warm-parent';
    protected $description = 'Warm up cache for all parent portal data';

    public function handle()
    {
        $this->info('Warming parent portal cache...');
        
        $parents = ParentProfile::with('students')->get();
        $bar = $this->output->createProgressBar($parents->count());
        
        foreach ($parents as $parent) {
            // Cache parent students
            $cacheKey = "parent_{$parent->user_id}_students";
            Cache::remember($cacheKey, 1800, function() use ($parent) {
                return $parent->students()
                    ->with(['user:id,name', 'grade:id,name', 'section:id,name'])
                    ->get();
            });
            
            // Cache each student's data
            foreach ($parent->students as $student) {
                // Cache semester index
                $cacheKey = "student_{$student->id}_semesters";
                Cache::remember($cacheKey, 3600, function() use ($student) {
                    return DB::table('marks')
                        ->join('academic_years', 'marks.academic_year_id', '=', 'academic_years.id')
                        ->leftJoin('semester_results', function($join) use ($student) {
                            $join->on('marks.academic_year_id', '=', 'semester_results.academic_year_id')
                                 ->on(DB::raw('CAST(marks.semester AS INTEGER)'), '=', DB::raw('CAST(semester_results.semester AS INTEGER)'))
                                 ->where('semester_results.student_id', '=', $student->id);
                        })
                        ->where('marks.student_id', $student->id)
                        ->select(
                            'marks.semester',
                            'marks.academic_year_id',
                            'academic_years.name as year_name',
                            DB::raw('ROUND(AVG(marks.score), 2) as average'),
                            DB::raw('MAX(semester_results.rank) as rank')
                        )
                        ->groupBy('marks.semester', 'marks.academic_year_id', 'academic_years.name')
                        ->get();
                });
                
                // Cache section count
                Cache::remember("section_{$student->section_id}_count", 3600, function() use ($student) {
                    return DB::table('students')->where('section_id', $student->section_id)->count();
                });
            }
            
            $bar->advance();
        }
        
        $bar->finish();
        $this->newLine();
        $this->info('✓ Parent portal cache warmed successfully!');
        
        return 0;
    }
}
