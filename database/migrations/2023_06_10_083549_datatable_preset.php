<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DatatablePreset extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('datatable_presets', function (Blueprint $table) {
            $table->uuid('id')->unique()->primary();
            $table->string('name', 64);
            $table->json('meta')->nullable();
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
        Schema::dropIfExists('datatable_presets');
    }
}
