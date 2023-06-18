<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Sharing extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('deck_sharing', function (Blueprint $table) {
            $table->id('id')->autoIncrement();
            $table->foreignUuid('user_id')->references('id')->on('users');
            $table->foreignUuid('class_id')->references('id')->on('classes');
            $table->timestamps();
            $table->foreignUuid('created_by')->references('id')->on('users');
            $table->foreignUuid('updated_by')->references('id')->on('users');
            $table->softDeletes();
        });

        Schema::table('decks', function (Blueprint $table) {
            $table->boolean('is_public')->after('playback_settings')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('deck_sharing');

        Schema::table('decks', function (Blueprint $table) {
            $table->dropColumn('is_public');
        });
    }
}
