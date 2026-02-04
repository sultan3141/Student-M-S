<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * AssessmentType Model
 * Defines the types of assessments (Midterm, Final, Quiz, etc.)
 * and their default weighting percentages.
 */
class AssessmentType extends Model
{
    protected $fillable = [
        'name',
        'weight',
        'weight_percentage',
        'subject',
        'description',
        'grade_id',
        'section_id',
        'subject_id',
    ];

    public function marks(): HasMany
    {
        return $this->hasMany(Mark::class);
    }

    public function grade(): BelongsTo
    {
        return $this->belongsTo(Grade::class);
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }
}
