<?php

namespace App\Models;

use App\Models\Traits\CrudLog;
use App\Models\Traits\HasUuid;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasUuid, HasFactory, Notifiable, CrudLog;

    protected $primaryKey = 'id';
    protected $keyType = 'uuid';
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'media_id',
    ];

    protected $with = [
        'roles',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'email_verified_at',
        'deleted_at',
        'updated_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'string',
        'email_verified_at' => 'datetime',
    ];

    public function avatar()
    {
        return $this->belongsTo('App\Models\Media', 'media_id')->select(['id', 'url']);
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id');
    }

    public function hasRole(string $name) {
        return $this->roles()
                ->where('key', $name)
                ->orWhere('key', 'dev')
                ->first() !== null;
    }

    private function updateMedia(array &$fields = [])
    {
        if ($fields['avatar']['id']) {
            $fields['media_id'] = $fields['avatar']['id'];
        } else if ($fields['avatar']['url']) {
            $newMedia = Media::create($fields['avatar']);
            $fields['media_id'] = $newMedia['id'];
        }

        return $fields;
    }

    private function updatePassword(array &$fields = [])
    {
        if ($fields['id'] === null) {
            $fields['password'] = bcrypt($fields['password']);
        } else {
            if (isset($fields->password) && !empty(trim($fields['password']))) {
                $fields['password'] = bcrypt($fields['password']);
            } else {
                unset($fields->password);
            }
        }

        return $fields;
    }

    public function create(array $attributes = [], array $options = []) {
        $this->updateMedia($attributes);
        $this->updatePassword($attributes);
        parent::create($attributes);
    }

    public function update(array $attributes = [], array $options = []) {
        $this->updateMedia($attributes);
        $this->updatePassword($attributes);
        parent::update($attributes);
    }
}
