<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SemesterResult extends Model
{
    protected $fillable = [
        'student_id',
        'academic_year_id',
        'grade_id',
        'semester',
        'average',
        'rank',
        'teacher_remarks',
    ];

    protected $casts = [
        'average' => 'decimal:2',
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
}
