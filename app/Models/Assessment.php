<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'subject_id',
        'grade_id',
        'section_id',
        'academic_year_id',
        'assessment_type_id',
        'name',
        'weight_percentage',
        'max_score',
        'semester',
        'due_date',
        'description',
        'status',
    ];

    protected $casts = [
        'weight_percentage' => 'decimal:2',
        'max_score' => 'decimal:2',
        'due_date' => 'date',
    ];

    // Relationships
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function assessmentType()
    {
        return $this->belongsTo(AssessmentType::class);
    }

    public function marks()
    {
        return $this->hasMany(Mark::class);
    }

    public function components()
    {
        return $this->hasMany(AssessmentComponent::class);
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeForTeacher($query, $teacherId)
    {
        return $query->where('teacher_id', $teacherId);
    }

    public function scopeForClass($query, $gradeId, $sectionId, $subjectId)
    {
        return $query->where('grade_id', $gradeId)
                    ->where('section_id', $sectionId)
                    ->where('subject_id', $subjectId);
    }

    public function scopeBySemester($query, $semester)
    {
        return $query->where('semester', $semester);
    }

    // Helper methods
    public function getCompletionPercentageAttribute()
    {
        $totalStudents = Student::where('section_id', $this->section_id)->count();
        if ($totalStudents === 0) return 0;
        
        $marksEntered = $this->marks()->whereNotNull('score')->count();
        return round(($marksEntered / $totalStudents) * 100, 2);
    }

    public function getAverageScoreAttribute()
    {
        return $this->marks()->whereNotNull('score')->avg('score');
    }

    public function publish()
    {
        $this->update(['status' => 'published']);
    }

    public function lock()
    {
        $this->update(['status' => 'locked']);
    }
}
