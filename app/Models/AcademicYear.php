<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    /** @use HasFactory<\Database\Factories\AcademicYearFactory> */
    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'is_current',
        'status', // Active, Closed, Preparation
    ];

    protected $casts = [
        'is_current' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function students()
    {
        // Logic to get students enrolled in this year (e.g. via marks or assignments)
    }

    public function marks()
    {
        return $this->hasMany(Mark::class);
    }
}
