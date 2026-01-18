<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssessmentType extends Model
{
    protected $fillable = ['name']; // e.g., Midterm, Final, Assign, Test

    public $timestamps = false;
}
