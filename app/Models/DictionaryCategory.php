<?php

namespace App\Models;

use App\Models\Traits\HasCreatedUpdatedBy;
use App\Models\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;

class DictionaryCategory extends Model
{
    use HasFactory, HasUuid, HasCreatedUpdatedBy;

    public $incrementing = false;

    protected $fillable = [];

    protected $with = [
        'cover',
        'i18n.language',
    ];

    public function cover()
    {
        return $this->belongsTo('App\Models\Media', 'media_id')->select(['id', 'url']);
    }

    public function i18n()
    {
//        $language = Language::where(['code' => App::getLocale()])->orWhere(['code' => 'en-US'])->first();
        return $this->hasMany('App\Models\DictionaryCategoryI18n', 'dictionary_category_id', 'id')
            ->select(['id', 'dictionary_category_id', 'text', 'language_id']);
//            ->where(['language_id' => $language->id]);
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
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
        'deleted_at',
    ];
}
