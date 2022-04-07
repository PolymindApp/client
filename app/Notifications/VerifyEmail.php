<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Crypt;

class VerifyEmail extends Notification
{
    use Queueable;

    /**
     * Get the notification's channels.
     *
     * @param  mixed  $notifiable
     * @return array|string
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Build the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);
        return $this->buildMailMessage($verificationUrl);
    }

    /**
     * Get the verify email notification mail message for the given URL.
     *
     * @param  string  $url
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    protected function buildMailMessage($url)
    {
        return (new MailMessage)
            ->markdown('notifications::email', [
                'image' => asset('assets/images/emails/Email-2_Intro.png')
            ])
            ->subject(__('notification.verifyEmail.subject'))
            ->greeting(__('notification.verifyEmail.greeting'))
            ->line(__('notification.verifyEmail.description', [
                'hour' => 24,
            ]))
            ->action(__('notification.verifyEmail.action'), url($url));
    }

    /**
     * Get the verification URL for the given notifiable.
     *
     * @param  mixed  $notifiable
     * @return string
     */
    protected function verificationUrl($notifiable)
    {
        $signature = Crypt::encryptString(json_encode([
            'email' => $notifiable->getEmailForVerification(),
            'expiration' => Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60 * 24)),
        ]));

        $url = '/register/verify?signature=' . $signature;

        return $url;
    }
}
