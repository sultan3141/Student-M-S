<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistrationPeriod extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_year_id',
        'start_date',
        'end_date',
        'status',
        'capacity_limit',
        'auto_close_percentage',
        'grade_specific_limits',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'grade_specific_limits' => 'array',
        'auto_close_percentage' => 'decimal:2',
    ];

    /**
     * Get the academic year.
     */
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    /**
     * Check if registration is currently open.
     */
    public function isOpen()
    {
        return $this->status === 'open' && 
               now()->between($this->start_date, $this->end_date);
    }

    /**
     * Get total enrollment capacity.
     */
    public function getTotalCapacityAttribute()
    {
        if ($this->capacity_limit) {
            return $this->capacity_limit;
        }

        // Calculate from grade-specific limits
        if ($this->grade_specific_limits) {
            return array_sum($this->grade_specific_limits);
        }

        return 0;
    }

    /**
     * Get current registration status for the current academic year.
     */
    public static function getCurrentStatus()
    {
        $currentYear = AcademicYear::whereRaw('is_current = true')->first();
        if (!$currentYear) {
            return [
                'is_open' => false,
                'period' => null,
                'academic_year' => null
            ];
        }

        $period = self::where('academic_year_id', $currentYear->id)->first();

        return [
            'is_open' => $period ? $period->isOpen() : false,
            'period' => $period,
            'academic_year' => $currentYear
        ];
    }
}
