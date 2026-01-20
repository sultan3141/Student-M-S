<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'code', 'grade_id', 'credit_hours', 'description'];

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function assessments()
    {
        return $this->hasMany(Assessment::class);
    }
}
