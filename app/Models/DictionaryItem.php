<?php

namespace App\Models;

use App\Models\Traits\HasCreatedUpdatedBy;
use App\Models\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;

class DictionaryItem extends Model
{
    use HasFactory, HasUuid, HasCreatedUpdatedBy;

    public $incrementing = false;

    protected $fillable = [
        'id',
        'dictionary_id',
        'media_id',
    ];

    protected $with = [
        'cover',
        'i18n.language'
    ];

    public function i18n()
    {
        return $this->hasMany('App\Models\DictionaryItemI18n', 'dictionary_item_id', 'id')
            ->select(['id', 'dictionary_item_id', 'text', 'text_synthesized', 'language_id']);
    }

    public function cover()
    {
        return $this->belongsTo('App\Models\Media', 'media_id')->select(['id', 'url']);
    }

    public function created_by()
    {
        return $this->belongsTo('App\Models\User', 'created_by');
    }

    public function updated_by()
    {
        return $this->belongsTo('App\Models\User', 'updated_by');
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'media_id',
        'updated_at',
        'created_by',
        'updated_by',
        'deleted_at',
    ];
}
