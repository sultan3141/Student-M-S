<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\PostgresCompatible;

class Schedule extends Model
{
    use PostgresCompatible;

    protected $fillable = [
        'academic_year_id',
        'name',
        'description',
        'day_of_week',
        'start_time',
        'end_time',
        'activity',
        'location',
        'grade_id',
        'section_id',
        'is_active',
    ];

    protected $casts = [
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'is_active' => 'boolean',
    ];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    /**
     * Get schedules for a specific day
     */
    public static function getByDay($day, $academicYearId = null)
    {
        $query = self::where('day_of_week', $day)
            ->whereBoolTrue('is_active')
            ->orderBy('start_time');

        if ($academicYearId) {
            $query->where('academic_year_id', $academicYearId);
        }

        return $query->get();
    }

    /**
     * Get full week schedule
     */
    public static function getWeekSchedule($academicYearId = null)
    {
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        $schedule = [];

        foreach ($days as $day) {
            $schedule[$day] = self::getByDay($day, $academicYearId);
        }

        return $schedule;
    }

    /**
     * Get schedule for a specific grade
     */
    public static function getByGrade($gradeId, $academicYearId = null)
    {
        $query = self::where('grade_id', $gradeId)
            ->whereBoolTrue('is_active')
            ->orderBy('day_of_week')
            ->orderBy('start_time');

        if ($academicYearId) {
            $query->where('academic_year_id', $academicYearId);
        }

        return $query->get();
    }
}
