<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Media extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('medias', function (Blueprint $table) {
            $table->string('mime_type')->nullable()->after('id');
            $table->integer('file_size')->nullable()->after('mime_type');
            $table->string('url')->nullable()->after('file_size');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('medias', function (Blueprint $table) {
            $table->dropColumn('mime_type');
            $table->dropColumn('file_size');
            $table->dropColumn('url');
        });
    }
}
