<?php

namespace App\Models;

use App\Models\Traits\HasUuid;
use App\Models\Traits\HasCreatedUpdatedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use HasFactory, HasUuid, HasCreatedUpdatedBy;

    public bool $incrementing = false;

    protected $fillable = [];
}
