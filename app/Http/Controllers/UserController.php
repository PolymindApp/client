<?php

namespace App\Http\Controllers;

use App\Models\Deck;
use App\Models\Log;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log as Logger;

class UserController extends Controller
{
    public function profile(string $uuid): Response
    {
        $user = User::find($uuid);
        if (!$user) {
            response(false, 401);
        }
        $decks = Deck::where(['created_by' => $uuid, 'is_public' => 1])
            ->with(['default_front_voice', 'default_back_voice'])
            ->orderBy('created_at', 'desc')
            ->get();

        $logs = Log::where(['created_by' => $uuid])
            ->whereIn('type', [
                'LOGIN', 'LOGOUT', 'UPDATE_USER',
                'CREATE_DECK', 'UPDATE_DECK',
                'JOIN_CLASS', 'LEFT_CLASS',
                'START_SESSION',
            ])
            ->limit(10)
            ->orderBy('created_at', 'desc')
            ->get();

        $notifications = [];
        if (auth()->user()->id === $uuid) {
            $notifications = Notification::where(['user_id' => $uuid])
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response([
            'user' => $user,
            'decks' => $decks,
            'logs' => $logs,
            'notifications' => $notifications,
        ], 200);
    }

    public function notifications(string $uuid): Response
    {
        if (auth()->user()->id !== $uuid) {
            response(false, 401);
        }

        $notifications = Notification::where(['user_id' => $uuid])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response($notifications, 200);
    }

    public function store(Request $request, string $uuid): Response
    {
        $item = $request->all();
        unset($item['email']);

        $this->validateItem($item);
        $model = User::find($uuid);
        if ($model) {
            $model->update($item);
        }
        return response($model);
    }

    protected function validateItem($fields)
    {
        return Validator::make($fields, [
            'name' => 'string|min:3|max:255',
            'password' => 'max:255',
        ])->validate();
    }
}
