<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'code', 'grade_id', 'description'];

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function assessments()
    {
        return $this->hasMany(Assessment::class);
    }

    public function teacherAssignments()
    {
        return $this->hasMany(TeacherAssignment::class);
    }

    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'teacher_assignments')
            ->withPivot(['grade_id', 'section_id', 'academic_year_id']);
    }
}
