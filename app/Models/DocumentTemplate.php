<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class DocumentTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'description',
        'template_content',
        'placeholders',
        'settings',
        'is_default',
        'is_active',
    ];

    protected $casts = [
        'placeholders' => 'array',
        'settings' => 'array',
    ];

    /**
     * Boot the model - handle boolean conversion before saving.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Ensure booleans are actual PHP booleans
            if (isset($model->attributes['is_default'])) {
                $model->attributes['is_default'] = (bool) $model->attributes['is_default'];
            }
            if (isset($model->attributes['is_active'])) {
                $model->attributes['is_active'] = (bool) $model->attributes['is_active'];
            }
        });

        static::updating(function ($model) {
            // Ensure booleans are actual PHP booleans
            if (isset($model->attributes['is_default'])) {
                $model->attributes['is_default'] = (bool) $model->attributes['is_default'];
            }
            if (isset($model->attributes['is_active'])) {
                $model->attributes['is_active'] = (bool) $model->attributes['is_active'];
            }
        });
    }

    /**
     * Get is_default attribute as boolean.
     */
    protected function isDefault(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => (bool) $value,
            set: fn ($value) => (bool) $value,
        );
    }

    /**
     * Get is_active attribute as boolean.
     */
    protected function isActive(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => (bool) $value,
            set: fn ($value) => (bool) $value,
        );
    }

    /**
     * Replace placeholders in template with actual data.
     */
    public function render(array $data): string
    {
        $content = $this->template_content;

        foreach ($data as $key => $value) {
            $content = str_replace('{{' . $key . '}}', $value, $content);
        }

        return $content;
    }

    /**
     * Get default template for a type.
     */
    public static function getDefault(string $type)
    {
        return self::where('type', $type)
            ->whereRaw('is_default::boolean = TRUE')
            ->whereRaw('is_active::boolean = TRUE')
            ->first();
    }
}
