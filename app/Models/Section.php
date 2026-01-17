<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    /** @use HasFactory<\Database\Factories\SectionFactory> */
    protected $fillable = ['name', 'grade_id', 'gender', 'capacity', 'stream_id'];

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }}
