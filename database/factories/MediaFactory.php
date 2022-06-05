<?php

namespace Database\Factories;

use App\Models\Media;
use Illuminate\Database\Eloquent\Factories\Factory;

class MediaFactory extends Factory
{
    protected $model = Media::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $fileSize = rand(10000, 1000000);
        return [
            'mime_type' => $this->faker->mimeType(),
            'file_size' => $fileSize,
            'url' => 'https://loremflickr.com/320/240?lock=' . $fileSize,
        ];
    }
}
