<?php

namespace App\Models;

use App\Models\Traits\HasCreatedUpdatedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    use HasFactory, HasCreatedUpdatedBy;

    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'role_id',
    ];

    public function users()
    {
        return $this->belongsToMany('App\Models\User', 'user_id');
    }

    public function roles()
    {
        return $this->belongsToMany('App\Models\Role', 'role_id');
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
