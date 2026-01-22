<?php

namespace App\Listeners;

use App\Events\TeacherAccountCreated;
use App\Notifications\TeacherWelcomeNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendTeacherWelcomeEmail
{
    /**
     * Handle the event.
     */
    public function handle(TeacherAccountCreated $event): void
    {
        $event->teacher->user->notify(new TeacherWelcomeNotification(
            $event->teacher->user->username,
            $event->password
        ));
    }
}
