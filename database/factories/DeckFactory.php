<?php

namespace Database\Factories;

use App\Models\Voice;
use Illuminate\Database\Eloquent\Factories\Factory;

class DeckFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $single = $this->faker->boolean;
        return [
            'default_front_voice_id' => Voice::all()->random()->id,
            'default_back_voice_id' => $single ? null : Voice::all()->random()->id,
            'name' => $this->faker->sentence(1, 3),
            'single' => $single,
        ];
    }
}
