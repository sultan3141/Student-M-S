<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'report_type',
        'message',
        'reported_by',
        'reported_at',
        'severity',
    ];

    protected $casts = [
        'reported_at' => 'datetime',
    ];

    /**
     * Get the student that owns the report.
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Scope a query to only include reports of a given type.
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('report_type', $type);
    }

    /**
     * Scope a query to only include reports of a given severity.
     */
    public function scopeOfSeverity($query, $severity)
    {
        return $query->where('severity', $severity);
    }

    /**
     * Scope to get recent reports (ordered by reported_at descending).
     */
    public function scopeRecent($query, $limit = 10)
    {
        return $query->orderBy('reported_at', 'desc')->limit($limit);
    }
}
