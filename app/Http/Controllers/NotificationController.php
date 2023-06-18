<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NotificationController extends Controller
{
    /**
     * Acknowledge a list of notifications
     *
     * @param Request $request
     * @return Response
     */
    public function acknowledge(Request $request): Response
    {
        $results = [];
        $notifications = $request->all();
        foreach($notifications as $notification) {
            $model = Notification::find($notification['id']);
            if ($model) {
                $model->update([
                    'acknowledged' => true,
                ]);
                $results[] = $model->toArray();
            }
        }
        return response($results);
    }
}
