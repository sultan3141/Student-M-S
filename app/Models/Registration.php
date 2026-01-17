<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    protected $fillable = [
        'student_id',
        'academic_year_id',
        'grade_id',
        'section_id',
        'stream_id',
        'registration_date',
        'status',
    ];

    protected $casts = [
        'registration_date' => 'date',
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

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function stream()
    {
        return $this->belongsTo(Stream::class);
    }
}
