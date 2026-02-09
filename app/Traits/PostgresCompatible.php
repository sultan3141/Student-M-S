<?php

namespace App\Traits;

trait PostgresCompatible
{
    /**
     * Boot the trait and add event listeners
     */
    protected static function bootPostgresCompatible()
    {
        static::saving(function ($model) {
            if (config('database.default') === 'pgsql') {
                foreach ($model->getCasts() as $key => $cast) {
                    if ($cast === 'boolean' && isset($model->attributes[$key])) {
                        // Convert integer to boolean for PostgreSQL
                        $model->attributes[$key] = (bool) $model->attributes[$key];
                    }
                }
            }
        });
    }

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
