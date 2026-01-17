<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mark extends Model
{
    /** @use HasFactory<\Database\Factories\MarkFactory> */
    protected $fillable = [
        'student_id',
        'subject_id',
        'academic_year_id',
        'semester', // Term 1, Term 2
        'assessment_type', // Test, Exam, Assignment
        'score',
        'remarks',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }}
