<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DictionaryForeign extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('dictionaries', function (Blueprint $table) {
            $table->dropForeign(['media_id']);
            $table->dropForeign(['dictionary_category_id']);
            $table->foreign('media_id')->references('id')->on('medias')->onDelete('cascade');
            $table->foreign('dictionary_category_id')->references('id')->on('dictionary_categories')->onDelete('cascade');
        });

        Schema::table('dictionary_categories', function (Blueprint $table) {
            $table->dropForeign(['media_id']);
            $table->foreign('media_id')->references('id')->on('medias')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('dictionaries', function (Blueprint $table) {
            $table->dropForeign(['media_id']);
            $table->dropForeign(['dictionary_category_id']);
            $table->foreign('media_id')->nullable()->references('id')->on('medias');
            $table->foreign('dictionary_category_id')->nullable()->references('id')->on('dictionary_categories');
        });

        Schema::table('dictionary_categories', function (Blueprint $table) {
            $table->dropForeign(['media_id']);
            $table->foreign('media_id')->nullable()->references('id')->on('medias');
        });
    }
}
