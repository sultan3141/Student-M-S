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
        \Log::debug("CheckSemesterOpen middleware hit: " . $request->fullUrl(), [
            'method' => $request->method(),
            'inputs' => $request->all()
        ]);

        // Allow viewing even if closed
        if ($request->isMethod('GET')) {
            return $next($request);
        }

        $academicYearId = $request->input('academic_year_id') 
            ?? $request->route('academic_year_id')
            ?? \App\Models\AcademicYear::whereRaw('is_current = true')->value('id');
        
        // Try to get semester from multiple sources
        $semester = $request->input('semester') 
            ?? $request->route('semester')
            ?? ($request->has('marks') ? collect($request->input('marks'))->first()['semester'] ?? null : null)
            ?? 1;

        if ($academicYearId && $semester) {
            // Use Grade-specific semester status if grade_id is available
            $gradeId = $request->input('grade_id') ?? $request->route('grade_id');
            
            $isOpen = $gradeId 
                ? \App\Models\SemesterStatus::isOpen($gradeId, $semester, $academicYearId)
                : \App\Models\SemesterPeriod::isSemesterOpen($academicYearId, $semester);

            if (!$isOpen) {
                return back()->withErrors([
                    'error' => "Semester {$semester} is closed. You cannot edit results for closed semesters."
                ]);
            }
        }

        return $next($request);
    }
}
