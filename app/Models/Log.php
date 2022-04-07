<?php

namespace App\Models;

use App\Models\Traits\CheckOwnership;
use App\Models\Traits\HasUuid;
use App\Models\Traits\HasCreatedUpdatedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    use HasFactory, HasUuid, HasCreatedUpdatedBy, CheckOwnership;

    public $incrementing = false;

    protected $fillable = [];
}
