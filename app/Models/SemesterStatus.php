<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SemesterStatus extends Model
{
    use HasFactory;

    protected $table = 'academic_semester_statuses';

    protected $fillable = [
        'academic_year_id',
        'grade_id',
        'semester',
        'status', // 'open', 'closed'
        'is_declared',
    ];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public static function isOpen($gradeId, $semester, $academicYearId = null)
    {
        // If year ID provided, check that specific year
        if ($academicYearId) {
            $status = self::where('academic_year_id', $academicYearId)
                ->where('grade_id', $gradeId)
                ->where('semester', $semester)
                ->first();
            return $status ? $status->status === 'open' : false; // Default closed if not found for specific year
        }

        // Get current academic year
        $year = AcademicYear::whereRaw('is_current = true')->first();
        if (!$year) return true; // Fail safe

        $status = self::where('academic_year_id', $year->id)
            ->where('grade_id', $gradeId)
            ->where('semester', $semester)
            ->first();

        // Default to 'open' if no record exists? 
        // Spec implies control. Usually if not set, it's open.
        return $status ? $status->status === 'open' : true;
    }
}
