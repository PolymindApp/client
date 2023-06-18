<?php

namespace App\Models;

use App\Models\Traits\CheckOwnership;
use App\Models\Traits\CrudLog;
use App\Models\Traits\HasCreatedUpdatedBy;
use App\Models\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolClass extends Model
{
    use HasFactory, HasUuid, HasCreatedUpdatedBy, CheckOwnership, CrudLog;

    public $incrementing = false;
    public $table = 'classes';

    protected $fillable = [
        'id',
        'name',
    ];

    public function created_by()
    {
        return $this->belongsTo('App\Models\User', 'created_by');
    }

    public function updated_by()
    {
        return $this->belongsTo('App\Models\User', 'updated_by');
    }
}
