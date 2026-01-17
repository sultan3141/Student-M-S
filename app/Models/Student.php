<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    /** @use HasFactory<\Database\Factories\StudentFactory> */
    protected $fillable = [
        'user_id',
        'student_id',
        'dob',
        'gender',
        'parent_id',
        'grade_id',
        'section_id',
        'stream_id',
        'phone',
        'address',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function parent()
    {
        return $this->belongsTo(ParentModel::class, 'parent_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function marks()
    {
        return $this->hasMany(Mark::class);
    }

    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    // Get all assessments taken by student
    public function assessments()
    {
        return $this->hasManyThrough(Assessment::class, StudentMark::class, 'student_id', 'id', 'id', 'assessment_id');
    }

    public function semesterResults()
    {
        return $this->hasMany(SemesterResult::class);
    }

    public function finalResults()
    {
        return $this->hasMany(FinalResult::class);
    }

    // Get current registration for active academic year
    public function currentRegistration()
    {
        return $this->hasOne(Registration::class)
            ->whereHas('academicYear', function($q) {
                $q->where('status', 'active');
            })
            ->latest();
    }

    // Calculate average for a specific academic year
    public function calculateAverageForYear($academicYearId)
    {
        return $this->marks()
            ->where('academic_year_id', $academicYearId)
            ->avg('score_obtained');
    }

    // Check if eligible for promotion based on final result
    public function isEligibleForPromotion($academicYearId, $gradeId)
    {
        $finalResult = $this->finalResults()
            ->where('academic_year_id', $academicYearId)
            ->where('grade_id', $gradeId)
            ->first();

        return $finalResult && $finalResult->combined_average >= 50;
    }
}
