<?php

namespace App\Handlers;

use App\Models\Notification;
use App\Models\User;

class NotifyUser
{
    protected static function send(User $user, string $type, array $meta = [])
    {
        Notification::create([
            'user_id' => $user->id,
            'type' => $type,
            'meta' => $meta,
        ]);
    }
}
