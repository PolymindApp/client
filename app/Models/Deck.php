<?php

namespace App\Models;

use App\Models\Traits\HasUuid;
use App\Models\Traits\HasCreatedUpdatedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deck extends Model
{
    use HasFactory, HasUuid, HasCreatedUpdatedBy;

    public $incrementing = false;

    protected $fillable = [
        'name',
        'default_front_voice_id',
        'default_back_voice_id',
    ];


    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'default_front_voice_id' => 'integer',
        'default_back_voice_id' => 'integer',
    ];

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
