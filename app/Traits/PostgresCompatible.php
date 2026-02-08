<?php

namespace App\Traits;

trait PostgresCompatible
{
    /**
     * Scope a query to where a boolean column is true (PostgreSQL compatible)
     */
    public function scopeWhereBoolTrue($query, $column)
    {
        if (config('database.default') === 'pgsql') {
            return $query->whereRaw("{$column} = true");
        }
        return $query->where($column, true);
    }

    /**
     * Scope a query to where a boolean column is false (PostgreSQL compatible)
     */
    public function scopeWhereBoolFalse($query, $column)
    {
        if (config('database.default') === 'pgsql') {
            return $query->whereRaw("{$column} = false");
        }
        return $query->where($column, false);
    }
}
