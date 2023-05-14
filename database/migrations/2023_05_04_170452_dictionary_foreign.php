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
            $table->foreignUuid('media_id')->nullOnDelete()->change();
            $table->foreignUuid('dictionary_category_id')->nullOnDelete()->change();
        });

        Schema::table('dictionary_categories', function (Blueprint $table) {
            $table->foreignUuid('media_id')->nullOnDelete()->change();
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
            $table->foreignUuid('media_id')->restrictOnDelete()->change();
            $table->foreignUuid('dictionary_category_id')->restrictOnDelete()->change();
        });

        Schema::table('dictionary_categories', function (Blueprint $table) {
            $table->foreignUuid('media_id')->restrictOnDelete()->change();
        });
    }
}
