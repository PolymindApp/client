<?php

namespace Database\Factories;

use App\Models\DictionaryItemI18n;
use Illuminate\Database\Eloquent\Factories\Factory;

class DictionaryItemI18nFactory extends Factory
{

    protected $model = DictionaryItemI18n::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'text' => $this->faker->word(),
            'text_synthesized' => null,
        ];
    }
}
