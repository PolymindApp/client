<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DevSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(LanguageSeeder::class);
        $this->call(VoiceSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(DeckSeeder::class);
        $this->call(DictionarySeeder::class);
    }
}
