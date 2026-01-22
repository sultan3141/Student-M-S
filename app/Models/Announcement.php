<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_id',
        'recipient_type',
        'recipient_ids',
        'subject',
        'message',
        'attachments',
        'scheduled_at',
        'sent_at',
        'status',
        'total_recipients',
        'opened_count',
        'clicked_count',
    ];

    protected $casts = [
        'recipient_ids' => 'array',
        'attachments' => 'array',
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    /**
     * Get the sender (admin/director).
     */
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Get open rate percentage.
     */
    public function getOpenRateAttribute()
    {
        if ($this->total_recipients === 0) return 0;
        return round(($this->opened_count / $this->total_recipients) * 100, 2);
    }

    /**
     * Get click rate percentage.
     */
    public function getClickRateAttribute()
    {
        if ($this->total_recipients === 0) return 0;
        return round(($this->clicked_count / $this->total_recipients) * 100, 2);
    }
}
