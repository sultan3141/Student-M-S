<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'is_default' => 'boolean',
        'is_active' => 'boolean',
    ];

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
            ->where('is_default', true)
            ->where('is_active', true)
            ->first();
    }
}
