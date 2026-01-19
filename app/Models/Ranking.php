<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Ranking Model
 * Represents a student's ranking within a specific class/subject context.
 * Stores calculated performance metrics like rank position, average score, and trend.
 */
class Ranking extends Model
{
    protected $fillable = [
        'student_id',
        'semester',
        'academic_year',
        'subject',
        'rank_position',
        'average_score',
        'total_marks',
        'attendance_percentage',
        'trend',
        'published_at',
    ];

    protected $casts = [
        'average_score' => 'decimal:2',
        'total_marks' => 'decimal:2',
        'attendance_percentage' => 'decimal:2',
        'published_at' => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at');
    }

    public function scopeForSemester($query, $semester, $academicYear)
    {
        return $query->where('semester', $semester)
                     ->where('academic_year', $academicYear);
    }

    public function scopeTopRankers($query, $limit = 10)
    {
        return $query->orderBy('rank_position', 'asc')->limit($limit);
    }

    public function getTrendIconAttribute()
    {
        return match($this->trend) {
            'up' => '↗',
            'down' => '↘',
            default => '→',
        };
    }
}
