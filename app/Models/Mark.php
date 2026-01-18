<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mark extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'subject_id',
        'teacher_id',
        'grade_id',
        'section_id',
        'academic_year_id',
        'semester',
        'assessment_id', // New: Links to specific assessment
        'assessment_type_id', // For backward compatibility
        'marks_obtained', // Changed from 'score' for clarity
        'is_submitted',
        'submitted_at',
        'is_locked',
    ];

    protected $casts = [
        'marks_obtained' => 'decimal:2',
        'is_submitted' => 'boolean',
        'is_locked' => 'boolean',
        'submitted_at' => 'datetime',
    ];

    // Relationships
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
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

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }

    public function assessmentType()
    {
        return $this->belongsTo(AssessmentType::class);
    }

    public function changeLogs()
    {
        return $this->hasMany(MarkChangeLog::class);
    }

    // Scopes
    public function scopeSubmitted($query)
    {
        return $query->where('is_submitted', true);
    }

    public function scopeUnsubmitted($query)
    {
        return $query->where('is_submitted', false);
    }

    public function scopeForTeacher($query, $teacherId)
    {
        return $query->where('teacher_id', $teacherId);
    }

    public function scopeBySubject($query, $subjectId)
    {
        return $query->where('subject_id', $subjectId);
    }

    public function scopeBySemester($query, $semester)
    {
        return $query->where('semester', $semester);
    }

    public function scopeByAssessment($query, $type)
    {
        return $query->where('assessment_type', $type);
    }

    // Methods
    public function submit()
    {
        $this->update([
            'is_submitted' => true,
            'submitted_at' => now(),
            'is_locked' => true,
        ]);
    }
}
