<?php

namespace App\Models;

use App\Models\Traits\CheckOwnership;
use App\Models\Traits\HasUuid;
use App\Models\Traits\HasCreatedUpdatedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Media extends Model
{
    use HasFactory, HasUuid, HasCreatedUpdatedBy;

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

    public static function boot()
    {
        parent::boot();

        self::creating(function($model) {

            $file = tmpfile();
            $path = stream_get_meta_data($file)['uri'];
            $base64 = explode('base64,', $model['url']);

            if (count($base64) > 1) {
                file_put_contents($path, base64_decode($base64[1]));
                $mimeType = mime_content_type($path);
                $splittedMimeType = explode('/', $mimeType);

                if ($splittedMimeType[0] === 'image') {
                    $id = Str::uuid();
                    $extension = $splittedMimeType[1];
                    $filename = 'medias/' . $id . '.' . $extension;

                    Storage::disk('s3')->put($filename, fopen($path, 'r+'), 'public');
                    $url = Storage::disk('s3')->url($filename);

                    $model['id'] = $id;
                    $model['mime_type'] = $mimeType;
                    $model['file_size'] = filesize($path);
                    $model['url'] = $url;
                }
            }

            return $model;
        });
    }
}
