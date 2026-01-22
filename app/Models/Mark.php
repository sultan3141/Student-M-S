<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mark extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'assessment_id',
        'score',
        'remarks'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }

    // Helper method to get percentage
    public function getPercentageAttribute()
    {
        if ($this->assessment && $this->assessment->max_score > 0) {
            return round(($this->score / $this->assessment->max_score) * 100, 2);
        }
        return 0;
    }
}