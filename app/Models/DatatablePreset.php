<?php

namespace App\Models;

use App\Models\Traits\CheckOwnership;
use App\Models\Traits\CrudLog;
use App\Models\Traits\HasCreatedUpdatedBy;
use App\Models\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DatatablePreset extends Model
{
    use HasFactory, HasUuid, HasCreatedUpdatedBy, CheckOwnership, CrudLog;

    public $incrementing = false;

    protected $fillable = [
        'name',
        'meta',
    ];

    protected $cast = [
        'meta' => 'json'
    ];
}
