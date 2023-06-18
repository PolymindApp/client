<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('roles')->insert([
            'key' => 'dev',
            'name' => 'Developer',
            'description' => 'Full-access to everything including development-only features.',
        ]);
        DB::table('roles')->insert([
            'key' => 'admin',
            'name' => 'Administrator',
            'description' => 'Full-access to everything.',
        ]);
        DB::table('roles')->insert([
            'key' => 'moderator',
            'name' => 'Moderator',
            'description' => 'Can review content.',
        ]);
        DB::table('roles')->insert([
            'key' => 'teacher',
            'name' => 'Student',
            'description' => 'Can create classes and manage students',
        ]);
        DB::table('roles')->insert([
            'key' => 'student',
            'name' => 'Student',
            'description' => 'Can request to join a class',
        ]);
    }
}
