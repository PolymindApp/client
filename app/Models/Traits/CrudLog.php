<?php

namespace App\Models\Traits;

use Illuminate\Support\Facades\Log;

trait CrudLog
{
    protected static function bootCrudLog()
    {
        static::created(function ($model) {
            $changes = $model->toArray();
            unset($changes['updated_at']);

            Log::channel('db')->info(
                'CREATE_' . strtoupper(class_basename($model)),
                $changes,
            );
        });

        static::updated(function ($model) {
            $changes = $model->getChanges();
            unset($changes['updated_at']);

            Log::channel('db')->info(
                'UPDATE_' . strtoupper(class_basename($model)),
                $changes,
            );
        });

        static::deleted(function ($model) {
            Log::channel('db')->info(
                'DELETE_' . strtoupper(class_basename($model))
            );
        });
    }
}
