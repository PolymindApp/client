<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DeckMedia extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('decks', function (Blueprint $table) {
            $table->foreignUuid('media_id')->after('id')->nullable()->references('id')->on('medias')->onDelete('cascade');
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
            $table->dropForeign(['media_id']);
            $table->dropColumn('media_id');
        });
    }
}
