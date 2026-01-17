<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    /** @use HasFactory<\Database\Factories\TeacherFactory> */
    protected $fillable = [
        'user_id',
        'qualification',
        'phone',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
