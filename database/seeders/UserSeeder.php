<?php

namespace Database\Seeders;

use App\Models\UserRole;
use App\Models\Role;
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
        $userId = Str::orderedUuid();
        DB::table('users')->insert([
            'id' => $userId,
            'name' => 'Administrator',
            'email' => 'admin@polymind.app',
            'email_verified_at' => now(),
            'password' => bcrypt('polymind'),
            'remember_token' => Str::random(10),
            'created_at' => now(),
        ]);

        $role = Role::where(['key' => 'dev'])->first();
        if ($role) {
            UserRole::factory()->create([
                'user_id' => $userId,
                'role_id' => $role->id,
                'created_by' => $userId,
            ]);
        }
    }
}
