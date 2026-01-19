<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
<<<<<<< HEAD

class AssessmentType extends Model
{
    protected $fillable = ['name']; // e.g., Midterm, Final, Assign, Test

    public $timestamps = false;
=======
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

    public function marks(): HasMany
    {
        return $this->hasMany(Mark::class);
    }
>>>>>>> 1625b52f4ebced92b4d6b212abd6caa19efe6d1b
}
