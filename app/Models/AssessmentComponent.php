<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssessmentComponent extends Model
{
    use HasFactory;

    protected $fillable = [
        'assessment_id',
        'name',
        'max_weight',
        'description',
    ];

    protected $casts = [
        'max_weight' => 'decimal:2',
    ];

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }
}
