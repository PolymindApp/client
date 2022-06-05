<?php

namespace App\Models\Traits;

trait HasCreatedUpdatedBy
{
    protected static function bootHasCreatedUpdatedBy()
    {
        static::creating(function ($model) {
            $user = auth()->user();
            if ($user && !$model->isDirty('created_by')) {
                $model->created_by = $user->id;
            }
            if ($user && !$model->isDirty('updated_by')) {
                $model->updated_by = $user->id;
            }
        });

        static::updating(function ($model) {
            $user = auth()->user();
            if ($user && !$model->isDirty('updated_by')) {
                $model->updated_by = $user->id;
            }
        });
    }
}
