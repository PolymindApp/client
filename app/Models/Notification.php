<?php

namespace App\Models;

use App\Models\Traits\HasCreatedUpdatedBy;
use App\Models\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory, HasUuid, HasCreatedUpdatedBy;

    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'type',
        'meta',
        'acknowledged',
    ];

    protected $casts = [
        'meta' => 'json',
    ];

    public function created_by()
    {
        return $this->belongsTo('App\Models\User', 'created_by');
    }

    public function updated_by()
    {
        return $this->belongsTo('App\Models\User', 'updated_by');
    }
}
