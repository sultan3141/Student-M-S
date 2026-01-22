<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TeacherWelcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $username;
    public $password;

    /**
     * Create a new notification instance.
     */
    public function __construct($username, $password)
    {
        $this->username = $username;
        $this->password = $password;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Welcome to School Management System')
                    ->greeting('Hello ' . $notifiable->name . ',')
                    ->line('Your teacher account has been created successfully.')
                    ->line('Here are your login credentials:')
                    ->line('Username: ' . $this->username)
                    ->line('Password: ' . $this->password)
                    ->action('Login to Dashboard', url('/login'))
                    ->line('Please change your password after your first login.')
                    ->line('Thank you for joining us!');
    }
}
