<?php

namespace App\Models;

use App\Models\Traits\CheckOwnership;
use App\Models\Traits\CrudLog;
use App\Models\Traits\HasUuid;
use App\Models\Traits\HasCreatedUpdatedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deck extends Model
{
    use HasFactory, HasUuid, HasCreatedUpdatedBy, CheckOwnership, CrudLog;

    public $incrementing = false;

    protected $fillable = [
        'media_id',
        'name',
        'single',
        'is_public',
        'default_front_voice_id',
        'default_back_voice_id',
        'playback_settings',
    ];

    protected $with = [
        'media',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'single' => 'boolean',
        'default_front_voice_id' => 'integer',
        'default_back_voice_id' => 'integer',
        'playback_settings' => 'json',
        'total_cards' => 'int',
    ];

    public function cards()
    {
        return $this->hasMany('App\Models\Card', 'deck_id', 'id');
    }

    public function media()
    {
        return $this->belongsTo('App\Models\Media', 'media_id')->select(['id', 'url']);
    }

    public function default_front_voice()
    {
        return $this->belongsTo('App\Models\Voice', 'default_front_voice_id');
    }

    public function default_back_voice()
    {
        return $this->belongsTo('App\Models\Voice', 'default_back_voice_id');
    }

    public function created_by()
    {
        return $this->belongsTo('App\Models\User', 'created_by');
    }

    public function updated_by()
    {
        return $this->belongsTo('App\Models\User', 'updated_by');
    }
}
