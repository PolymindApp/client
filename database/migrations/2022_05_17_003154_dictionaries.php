<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Dictionaries extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dictionary_categories', function (Blueprint $table) {
            $table->uuid('id')->unique();
            $table->integer('total_dictionaries')->default(0);
            $table->foreignUuid('media_id')->nullable()->references('id')->on('medias');
            $table->timestamps();
            $table->foreignUuid('created_by')->references('id')->on('users');
            $table->foreignUuid('updated_by')->references('id')->on('users');
            $table->softDeletes();
        });

        Schema::create('dictionary_category_i18ns', function (Blueprint $table) {
            $table->uuid('id')->unique();
            $table->foreignUuid('dictionary_category_id')->references('id')->on('dictionary_categories');
            $table->foreignId('language_id')->references('id')->on('languages');
            $table->string('text');
            $table->timestamps();
            $table->foreignUuid('created_by')->references('id')->on('users');
            $table->foreignUuid('updated_by')->references('id')->on('users');
            $table->softDeletes();
        });

        Schema::create('dictionaries', function (Blueprint $table) {
            $table->uuid('id')->unique();
            $table->foreignUuid('dictionary_category_id')->nullable()->references('id')->on('dictionary_categories');
            $table->integer('total_items')->default(0);
            $table->foreignUuid('media_id')->nullable()->references('id')->on('medias');
            $table->timestamps();
            $table->foreignUuid('created_by')->references('id')->on('users');
            $table->foreignUuid('updated_by')->references('id')->on('users');
            $table->softDeletes();
        });

        Schema::create('dictionary_i18n', function (Blueprint $table) {
            $table->uuid('id')->unique();
            $table->foreignUuid('dictionary_id')->references('id')->on('dictionaries');
            $table->foreignId('language_id')->references('id')->on('languages');
            $table->enum('type', ['title', 'body']);
            $table->string('text');
            $table->timestamps();
            $table->foreignUuid('created_by')->references('id')->on('users');
            $table->foreignUuid('updated_by')->references('id')->on('users');
            $table->softDeletes();
        });

        Schema::create('dictionary_items', function (Blueprint $table) {
            $table->uuid('id')->unique();
            $table->foreignUuid('dictionary_id')->references('id')->on('dictionaries');
            $table->foreignUuid('media_id')->nullable()->references('id')->on('medias');
            $table->timestamps();
            $table->foreignUuid('created_by')->references('id')->on('users');
            $table->foreignUuid('updated_by')->references('id')->on('users');
            $table->softDeletes();
        });

        Schema::create('dictionary_item_i18ns', function (Blueprint $table) {
            $table->uuid('id')->unique();
            $table->foreignUuid('dictionary_item_id')->references('id')->on('dictionary_items');
            $table->foreignId('language_id')->references('id')->on('languages');
            $table->string('text');
            $table->binary('text_synthesized')->nullable();
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
        Schema::dropIfExists('dictionary_item_i18ns');
        Schema::dropIfExists('dictionary_items');
        Schema::dropIfExists('dictionary_i18n');
        Schema::dropIfExists('dictionaries');
        Schema::dropIfExists('dictionary_category_i18ns');
        Schema::dropIfExists('dictionary_categories');
    }
}
