<?php

namespace Database\Factories;

use App\Models\DictionaryItem;
use App\Models\Media;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DictionaryItemFactory extends Factory
{

    protected $model = DictionaryItem::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $user = User::all()->random();
        return [
            'media_id' => Media::factory()->create([
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ])->id
        ];
    }
}
