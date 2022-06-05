<?php

namespace Database\Factories;

use App\Models\Dictionary;
use App\Models\DictionaryCategory;
use App\Models\Media;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class DictionaryFactory extends Factory
{

    protected $model = Dictionary::class;

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
            'dictionary_category_id' => DictionaryCategory::all()->random()->id,
            'media_id' => Media::factory()->create([
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ])->id
        ];
    }
}
