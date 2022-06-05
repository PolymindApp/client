<?php

namespace Database\Seeders;

use App\Models\Deck;
use App\Models\Card;
use App\Models\User;
use App\Models\Voice;
use Illuminate\Database\Seeder;

class DeckSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = User::all();
        $voices = Voice::all();
        foreach($users as $user) {
            Deck::factory()->count(rand(1, 5))->create([
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ])->each(function ($deck) use ($user) {
                Card::factory()->count(rand(5, 25))->create([
                    'deck_id' => $deck->id,
                    'front_voice_id' => $deck->default_front_voice_id,
                    'back_voice_id' => $deck->default_back_voice_id,
                    'created_by' => $user->id,
                    'updated_by' => $user->id,
                ]);
            });

            // Some unclassified cards
            Card::factory()->count(rand(0, 10))->create([
                'front_voice_id' => $voices->random()->id,
                'back_voice_id' => $voices->random()->id,
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ]);
        }
    }
}
