<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinalResult extends Model
{
    protected $fillable = [
        'student_id',
        'academic_year_id',
        'grade_id',
        'combined_average',
        'final_rank',
        'promotion_status',
        'teacher_remarks',
    ];

    protected $casts = [
        'combined_average' => 'decimal:2',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    // Check if student is eligible for promotion (>= 50%)
    public function isEligibleForPromotion()
    {
        return $this->combined_average >= 50;
    }
}
