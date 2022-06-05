<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\DictionaryCategoryI18n;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class DictionaryCategoryI18nFactory extends Factory
{

    protected $model = DictionaryCategoryI18n::class;
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'id' => Str::orderedUuid(),
            'text' => $this->faker->word(),
        ];
    }
}
