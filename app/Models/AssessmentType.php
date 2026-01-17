<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
}
