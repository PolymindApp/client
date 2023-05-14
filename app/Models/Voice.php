<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voice extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'language_id',
        'name',
        'gender',
        'neural',
        'standard',
        'bilingual',
        'child',
    ];

    protected $with = [
        'language',
    ];

    protected $casts = [
        'gender' => 'boolean',
        'neural' => 'boolean',
        'standard' => 'boolean',
        'bilingual' => 'boolean',
        'child' => 'boolean',
    ];

    public function language(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne('App\Models\Language', 'id', 'language_id')->latest();
    }
}
