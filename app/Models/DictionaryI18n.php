<?php

namespace App\Models;

use App\Models\Traits\HasCreatedUpdatedBy;
use App\Models\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DictionaryI18n extends Model
{
    use HasFactory, HasUuid, HasCreatedUpdatedBy;

    public $table = 'dictionary_i18n';
    public $incrementing = false;

    protected $fillable = [
        'text',
        'type',
        'dictionary_id',
        'language_id',
    ];

    public function scopeOfLanguage($query, $languageId)
    {
        return $query->whereIn('language_id', $languageId);
    }

    public function language()
    {
        return $this->belongsTo('App\Models\Language', 'language_id');
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
        'dictionary_id',
        'language_id',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
        'deleted_at',
    ];
}
