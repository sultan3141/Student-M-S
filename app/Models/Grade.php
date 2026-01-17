<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    /** @use HasFactory<\Database\Factories\GradeFactory> */
    protected $fillable = ['name', 'level'];

    public function sections()
    {
        return $this->hasMany(Section::class);
    }}
