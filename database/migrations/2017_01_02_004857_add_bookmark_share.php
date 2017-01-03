<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddBookmarkShare extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function ($table) {
            $table->boolean('can_share');
        });

        Schema::table('bookmarks', function ($table) {
            $table->boolean('share_all');
        });

        Schema::create('bookmark_shares', function(Blueprint $table)
        {
            $table->increments('id');
            $table->integer('bookmark_id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->timestamps();

            $table->index(['bookmark_id', 'user_id']);

            $table->foreign('bookmark_id')->references('id')->on('bookmarks');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

        Schema::drop('bookmark_shares');

        Schema::table('bookmarks', function ($table) {
            $table->dropColumn('share_all');
        });

        Schema::table('users', function ($table) {
            $table->dropColumn('can_share');
        });
    }
}
