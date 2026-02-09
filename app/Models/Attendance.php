<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'student_id',
        'section_id',
        'subject_id',
        'academic_year_id',
        'date',
        'status',
        'remarks',
        'is_locked',
    ];

    protected $casts = [
        'date' => 'date',
        'is_locked' => 'boolean',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}
