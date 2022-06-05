<?php

namespace App\Models;

use App\Models\Traits\HasCreatedUpdatedBy;
use App\Models\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dictionary extends Model
{
    use HasFactory, HasUuid, HasCreatedUpdatedBy;

    public $incrementing = false;

    protected $fillable = [];

    protected $with = [
        'cover',
        'created_by',
        'i18n.language',
    ];

    public function i18n()
    {
        $query = $this->hasMany('App\Models\DictionaryI18n', 'dictionary_id', 'id')
            ->select(['id', 'dictionary_id', 'type', 'text', 'language_id']);
        return $query;
    }

    public function cover()
    {
        return $this->belongsTo('App\Models\Media', 'media_id')->select(['id', 'url']);
    }

    public function category()
    {
        return $this->belongsTo('App\Models\DictionaryCategory', 'dictionary_category_id')->select(['id', 'media_id']);
    }

    public function created_by()
    {
        return $this->belongsTo('App\Models\User', 'created_by')->select(['id', 'name']);
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
        'updated_by',
        'updated_at',
        'deleted_at',
    ];
}
