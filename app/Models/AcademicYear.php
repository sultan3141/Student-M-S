<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    /** @use HasFactory<\Database\Factories\AcademicYearFactory> */
    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'is_current',
        'status', // active, completed, upcoming
    ];

    protected $casts = [
        'is_current' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Get the current active academic year
     */
    public static function current()
    {
        return static::where('is_current', true)->first();
    }

    /**
     * Get semester statuses for this academic year
     */
    public function semesterStatuses()
    {
        return $this->hasMany(SemesterStatus::class);
    }

    /**
     * Get current open semester (1, 2, or null if none open)
     */
    public function getCurrentSemester()
    {
        $openSemester = $this->semesterStatuses()
            ->where('status', 'open')
            ->first();

        return $openSemester?->semester;
    }

    /**
     * Check if a specific semester can be opened
     */
    public function canOpenSemester($semesterNumber, $gradeId = null)
    {
        // Semester 1 can always be opened
        if ($semesterNumber == 1) {
            return true;
        }

        // Semester 2 can only be opened if Semester 1 is closed
        if ($semesterNumber == 2) {
            $query = $this->semesterStatuses()
                ->where('semester', 1);
            
            if ($gradeId) {
                $query->where('grade_id', $gradeId);
            }
            
            $s1Statuses = $query->get();
            
            // All S1 instances must be closed
            return $s1Statuses->every(function ($status) {
                return $status->status === 'closed';
            });
        }

        return false;
    }

    /**
     * Create default semester statuses for all grades
     */
    public function createDefaultSemesters()
    {
        $grades = \App\Models\Grade::all();

        foreach ($grades as $grade) {
            foreach ([1, 2] as $semester) {
                SemesterStatus::firstOrCreate(
                    [
                        'academic_year_id' => $this->id,
                        'grade_id' => $grade->id,
                        'semester' => $semester,
                    ],
                    [
                        'status' => 'closed',
                    ]
                );
            }
        }
    }

    /**
     * Get overall year status based on semester statuses
     */
    public function getOverallStatus()
    {
        $semesterStatuses = $this->semesterStatuses;

        if ($semesterStatuses->isEmpty()) {
            return 'upcoming';
        }

        $allClosed = $semesterStatuses->every(function ($status) {
            return $status->status === 'closed';
        });

        $anyOpen = $semesterStatuses->contains(function ($status) {
            return $status->status === 'open';
        });

        if ($anyOpen) {
            return 'active';
        }

        if ($allClosed) {
            return 'completed';
        }

        return 'upcoming';
    }

    // Relationships
    public function students()
    {
        // Logic to get students enrolled in this year (e.g. via marks or assignments)
    }

    public function marks()
    {
        return $this->hasMany(Mark::class);
    }

    public function assessments()
    {
        return $this->hasMany(Assessment::class);
    }
}
