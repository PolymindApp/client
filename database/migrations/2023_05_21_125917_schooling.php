<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Schooling extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('classes', function (Blueprint $table) {
            $table->uuid('id')->unique()->primary();
            $table->string('name');
            $table->integer('total_students')->default(0);
            $table->timestamps();
            $table->foreignUuid('created_by')->references('id')->on('users');
            $table->foreignUuid('updated_by')->references('id')->on('users');
            $table->softDeletes();
        });

        Schema::create('class_students', function (Blueprint $table) {
            $table->uuid('id')->unique()->primary();
            $table->foreignUuid('user_id')->references('id')->on('users');
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
        Schema::dropIfExists('classes');
        Schema::dropIfExists('class_students');
    }
}
