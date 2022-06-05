<?php

namespace Database\Factories;

use App\Models\Media;
use App\Models\User;
use App\Models\DictionaryCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class DictionaryCategoryFactory extends Factory
{

    protected $model = DictionaryCategory::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $user = User::all()->random();
        return [
            'id' => Str::orderedUuid(),
            'media_id' => Media::factory()->create([
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ])->id
        ];
    }
}
