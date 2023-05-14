<?php

namespace App\Models;

use App\Models\Traits\CheckOwnership;
use App\Models\Traits\HasUuid;
use App\Models\Traits\HasCreatedUpdatedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    use HasFactory, HasUuid, HasCreatedUpdatedBy, CheckOwnership;

    public $table = 'medias';
    public $incrementing = false;

    protected $fillable = [
        'mime_type',
        'file_size',
        'url',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'created_by',
        'created_at',
        'updated_by',
        'updated_at',
        'deleted_at',
    ];

    public function delete()
    {
        $lastIdx = strrpos($this->url,"/medias/");
        $filename = substr($this->url, $lastIdx);
        Storage::disk('s3')->delete($filename);
        return parent::delete();
    }
}
