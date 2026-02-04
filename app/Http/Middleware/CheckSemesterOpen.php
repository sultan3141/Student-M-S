<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\SemesterPeriod;
use App\Models\AcademicYear;
use Symfony\Component\HttpFoundation\Response;

class CheckSemesterOpen
{
    /**
     * Handle an incoming request - ensures semester is open for teachers to edit results
     */
    public function handle(Request $request, Closure $next): Response
    {
        $academicYearId = $request->input('academic_year_id') 
            ?? $request->route('academic_year_id')
            ?? AcademicYear::where('is_current', true)->value('id');
        
        $semester = $request->input('semester') 
            ?? $request->route('semester')
            ?? 1;

        if ($academicYearId && $semester) {
            $semesterPeriod = SemesterPeriod::where('academic_year_id', $academicYearId)
                ->where('semester', $semester)
                ->first();

            if (!$semesterPeriod || $semesterPeriod->status !== 'open') {
                return back()->withErrors([
                    'error' => "Semester {$semester} is closed. You cannot edit results for closed semesters."
                ]);
            }
        }

        return $next($request);
    }
}
