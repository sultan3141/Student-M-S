<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admission extends Model
{
    protected $fillable = [
        'student_name',
        'student_email',
        'parent_name',
        'parent_email',
        'parent_phone',
        'previous_school',
        'grade_applying_for',
        'status',
        'notes',
    ];
}
