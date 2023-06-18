<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Notifications extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('notifications');

        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->unique()->primary();
            $table->foreignUuid('user_id')->references('id')->on('users');
            $table->string('type');
            $table->json('meta')->nullable();
            $table->boolean('acknowledged')->default(false);
            $table->boolean('email_sent')->default(false);
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
        Schema::dropIfExists('notifications');

        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->unique()->primary();
            $table->string('type');
            $table->morphs('notifiable');
            $table->text('data');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }
}
