<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'id' => Str::orderedUuid(),
            'name' => 'Administrator',
            'email' => 'admin@polymind.app',
            'email_verified_at' => now(),
            'password' => bcrypt('polymind'),
            'remember_token' => Str::random(10),
            'created_at' => now(),
        ]);
    }
}
