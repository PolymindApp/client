<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DeckSingle extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('decks', function (Blueprint $table) {
            $table->boolean('single')->default(false)->after('name');
        });
        Schema::table('cards', function (Blueprint $table) {
            $table->string('back')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('decks', function (Blueprint $table) {
            $table->dropColumn('single');
        });
        Schema::table('cards', function (Blueprint $table) {
            $table->string('back')->nullable(false)->change();
        });
    }
}
