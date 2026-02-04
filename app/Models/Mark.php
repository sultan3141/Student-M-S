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
        'assessment_id',
        'assessment_type_id',
        'score',
        'score_obtained',
        'max_score',
        'marks_obtained',
        'component_scores', // JSON field for component-wise scores
        'is_submitted',
        'submitted_at',
        'is_locked',
        'locked_at',
        'comment',
        'weight_percentage',
    ];

    protected $casts = [
        'marks_obtained' => 'decimal:2',
        'score' => 'decimal:2',
        'max_score' => 'decimal:2',
        'component_scores' => 'array', // Cast JSON to array
        'is_submitted' => 'boolean',
        'is_locked' => 'boolean',
        'locked_at' => 'datetime',
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
        return $query->whereRaw('is_submitted::boolean = TRUE');
    }

    public function scopeUnsubmitted($query)
    {
        return $query->whereRaw('is_submitted::boolean = FALSE');
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

    public function scopeLocked($query)
    {
        return $query->where('is_locked', true);
    }

    public function scopeUnlocked($query)
    {
        return $query->where('is_locked', false);
    }

    // Methods
    public function submit()
    {
        $this->update([
            'is_submitted' => true,
            'submitted_at' => now(),
            'is_locked' => true,
            'locked_at' => now(),
        ]);
    }

    /**
     * Lock this mark (semester closed)
     */
    public function lock()
    {
        $this->update([
            'is_locked' => true,
            'locked_at' => now(),
        ]);
    }

    /**
     * Unlock this mark (semester reopened)
     */
    public function unlock()
    {
        $this->update([
            'is_locked' => false,
            'locked_at' => null,
        ]);
    }

    /**
     * Check if this mark is locked
     */
    public function isLocked()
    {
        return $this->is_locked;
    }
}
