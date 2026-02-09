<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use App\Traits\PostgresCompatible;

class DocumentTemplate extends Model
{
    use HasFactory, PostgresCompatible;

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
        'is_default' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Get defaults trait boot logic if needed, but boot() is already handled in trait.
     */

    /**
     * Get is_default attribute as boolean.
     */
    protected function isDefault(): Attribute
    {
        return Attribute::make(
            get: fn($value) => (bool) $value,
            set: fn($value) => (bool) $value,
        );
    }

    /**
     * Get is_active attribute as boolean.
     */
    protected function isActive(): Attribute
    {
        return Attribute::make(
            get: fn($value) => (bool) $value,
            set: fn($value) => (bool) $value,
        );
    }

    /**
     * Replace placeholders in template with actual data.
     * Use regex to handle optional spacing in placeholders: {{ name }} or {{name}}
     */
    public function render(array $data): string
    {
        $content = $this->template_content;

        // Use regex for replacement to be robust to spacing in the template
        return preg_replace_callback('/\{\{\s*(.*?)\s*\}\}/', function ($matches) use ($data) {
            $key = $matches[1];
            return array_key_exists($key, $data) ? $data[$key] : $matches[0];
        }, $content);
    }

    /**
     * Get default template for a type.
     */
    public static function getDefault(string $type)
    {
        return self::where('type', $type)
            ->whereBoolTrue('is_default')
            ->whereBoolTrue('is_active')
            ->first();
    }
}
