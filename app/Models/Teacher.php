<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Teacher extends Model
{
    /** @use HasFactory<\Database\Factories\TeacherFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'photo',
        'phone',
        'address',
        'bio',
        'department',
        // Add other existing fields if any
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignments()
    {
        return $this->hasMany(TeacherAssignment::class);
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'teacher_assignments')
            ->withPivot(['grade_id', 'section_id', 'academic_year_id'])
            ->distinct();
    }

    public function marks()
    {
        return $this->hasMany(Mark::class);
    }

    public function changeLogs()
    {
        return $this->hasMany(MarkChangeLog::class);
    }

    // Helper to check if teacher is assigned to a specific class
    public function hasAssignment($subjectId, $gradeId, $sectionId, $academicYearId = null)
    {
        $query = $this->assignments()
            ->where('subject_id', $subjectId)
            ->where('grade_id', $gradeId)
            ->where('section_id', $sectionId);
            
        if ($academicYearId) {
            $query->where('academic_year_id', $academicYearId);
        }

        return $query->exists();
    }

    // Helper to check if teacher can manage a specific mark
    public function canManageMark(Mark $mark)
    {
        return $this->hasAssignment(
            $mark->subject_id, 
            $mark->grade_id, 
            $mark->section_id, 
            $mark->academic_year_id
        );
    }
    
    // Get all assigned sections grouped by grade
    public function getAssignedSections()
    {
        return $this->assignments()
            ->with(['grade', 'section', 'subject'])
            ->get()
            ->groupBy('grade.name');
    }
}
