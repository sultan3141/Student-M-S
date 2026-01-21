<?php

namespace App\Events;

use App\Models\Teacher;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TeacherAccountCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $teacher;
    public $password;

    /**
     * Create a new event instance.
     */
    public function __construct(Teacher $teacher, string $password)
    {
        $this->teacher = $teacher;
        $this->password = $password;
    }
}
