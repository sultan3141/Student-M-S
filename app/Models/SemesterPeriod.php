<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SemesterPeriod extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_year_id',
        'semester',
        'status',
        'opened_at',
        'closed_at',
        'opened_by',
        'closed_by',
    ];

    protected $casts = [
        'opened_at' => 'datetime',
        'closed_at' => 'datetime',
    ];

    // Relationships
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function openedByUser()
    {
        return $this->belongsTo(User::class, 'opened_by');
    }

    public function closedByUser()
    {
        return $this->belongsTo(User::class, 'closed_by');
    }

    // Scopes
    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    public function scopeClosed($query)
    {
        return $query->where('status', 'closed');
    }

    public function scopeForAcademicYear($query, $academicYearId)
    {
        return $query->where('academic_year_id', $academicYearId);
    }

    public function scopeForSemester($query, $semester)
    {
        return $query->where('semester', $semester);
    }

    // Helper Methods
    public function isOpen()
    {
        return $this->status === 'open';
    }

    public function isClosed()
    {
        return $this->status === 'closed';
    }

    // Static helper to check if a semester is open
    public static function isSemesterOpen($academicYearId, $semester)
    {
        return self::where('academic_year_id', $academicYearId)
            ->where('semester', $semester)
            ->where('status', 'open')
            ->exists();
    }

    // Static helper to get current open semester
    public static function getCurrentOpenSemester($academicYearId)
    {
        return self::where('academic_year_id', $academicYearId)
            ->where('status', 'open')
            ->first();
    }

    /**
     * Lock all assessments and marks for this semester
     */
    public function lockAssessmentsAndMarks()
    {
        // Lock all assessments for this semester
        Assessment::where('academic_year_id', $this->academic_year_id)
            ->bySemester($this->semester)
            ->update([
                'is_editable' => false,
                'locked_at' => now(),
            ]);

        // Lock all marks for this semester
        Mark::where('academic_year_id', $this->academic_year_id)
            ->bySemester($this->semester)
            ->update([
                'is_locked' => true,
                'locked_at' => now(),
            ]);
    }

    /**
     * Unlock all assessments and marks for this semester
     */
    public function unlockAssessmentsAndMarks()
    {
        // Unlock all assessments for this semester
        Assessment::where('academic_year_id', $this->academic_year_id)
            ->bySemester($this->semester)
            ->update([
                'is_editable' => true,
                'locked_at' => null,
            ]);

        // Unlock all marks for this semester
        Mark::where('academic_year_id', $this->academic_year_id)
            ->bySemester($this->semester)
            ->update([
                'is_locked' => false,
                'locked_at' => null,
            ]);
    }

    /**
     * Get statistics for this semester
     */
    public function getStatistics()
    {
        $assessmentCount = Assessment::where('academic_year_id', $this->academic_year_id)
            ->bySemester($this->semester)
            ->count();

        $markCount = Mark::where('academic_year_id', $this->academic_year_id)
            ->bySemester($this->semester)
            ->whereNotNull('score')
            ->count();

        $totalMarks = Mark::where('academic_year_id', $this->academic_year_id)
            ->bySemester($this->semester)
            ->count();

        return [
            'assessments' => $assessmentCount,
            'marks_entered' => $markCount,
            'total_marks' => $totalMarks,
            'completion_rate' => $totalMarks > 0 ? round(($markCount / $totalMarks) * 100, 2) : 0,
        ];
    }
}
