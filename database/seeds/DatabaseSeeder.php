<?php

use Illuminate\Database\Seeder;
use App\User;
use App\Tag;
use App\Bookmark;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name'          => 'Admin',
            'username'      => 'admin',
            'password'      => Hash::make('nimda'),
            'administrator' => true
        ]);
    }
}
