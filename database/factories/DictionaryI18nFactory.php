<?php

namespace Database\Factories;

use App\Models\DictionaryI18n;
use Illuminate\Database\Eloquent\Factories\Factory;

class DictionaryI18nFactory extends Factory
{

    protected $model = DictionaryI18n::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'type' => ['title', 'body'][rand(0, 1)],
            'text' => $this->faker->sentence(rand(3, 7))
        ];
    }
}
