<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cards', function (Blueprint $table) {
            $table->uuid('id')->unique()->primary();
            $table->foreignUuid('deck_id')->nullable()->onDelete('cascade');
            $table->foreignId('front_voice_id')->nullable()->references('id')->on('voices');
            $table->foreignId('back_voice_id')->nullable()->references('id')->on('voices');
            $table->string('front');
            $table->string('back');
            $table->binary('front_synthesized')->nullable();
            $table->binary('back_synthesized')->nullable();
            $table->timestamps();
            $table->foreignUuid('created_by')->references('id')->on('users');
            $table->foreignUuid('updated_by')->references('id')->on('users');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cards');
    }
}
