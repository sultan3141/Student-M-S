<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * AssessmentType Model
 * Defines the types of assessments (Midterm, Final, Quiz, etc.)
 * and their default weighting percentages.
 */
class AssessmentType extends Model
{
    protected $fillable = [
        'name',
        'weight_percentage',
        'subject',
        'description',
    ];

    public $timestamps = false;

    public function marks(): HasMany
    {
        return $this->hasMany(Mark::class);
    }
}
