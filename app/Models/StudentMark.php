<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentMark extends Model
{
    protected $fillable = [
        'student_id',
        'assessment_id',
        'score',
        'remarks',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function assessment(): BelongsTo
    {
        return $this->belongsTo(Assessment::class);
    }

    // Helper calculate percentage
    public function getPercentageAttribute()
    {
        if ($this->assessment && $this->assessment->max_marks > 0) {
            return ($this->score / $this->assessment->max_marks) * 100;
        }
        return 0;
    }
}
