<?php

namespace App\Models;

use App\Models\Traits\CheckOwnership;
use App\Models\Traits\HasUuid;
use App\Models\Traits\HasCreatedUpdatedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    use HasFactory, HasUuid, HasCreatedUpdatedBy, CheckOwnership;

    public $incrementing = false;

    protected $with = [
        'front_voice.language',
        'back_voice.language',
    ];

    protected $fillable = [
        'deck_id',
        'front',
        'front_voice_id',
        'front_synthesized',
        'back',
        'back_voice_id',
        'back_synthesized',
    ];

    protected $casts = [
        'front_voice_id' => 'integer',
        'back_voice_id' => 'integer',
    ];

    public function front_voice(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo('App\Models\Voice', 'front_voice_id');
    }

    public function back_voice(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo('App\Models\Voice', 'back_voice_id');
    }
}
