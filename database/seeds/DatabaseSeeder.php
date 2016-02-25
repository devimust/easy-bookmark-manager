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

        if (file_exists(dirname(__FILE__) . '/import.json')) {
            $data = file_get_contents(dirname(__FILE__) . '/import.json');
            $importObject = json_decode($data);

            $this->command->getOutput()->writeln("<info>Importing:</info> " . count($importObject->data->bookmarks) . " rows");

            foreach ($importObject->data->bookmarks as $bookmark) {

                $tagIds = [];

                foreach ($bookmark->tags as $tagString) {
                    $tag = Tag::where('name', '=', $tagString)->first();
                    if (!$tag) {
                        $tag = Tag::create([
                            'name' => $tagString,
                            'user_id' => 1
                        ]);
                    }
                    $tagIds[] = $tag->id;
                }

                Bookmark::create([
                    'title'         => $bookmark->title,
                    'link'          => $bookmark->link,
                    'category'      => $bookmark->category,
                    'favourite'     => $bookmark->favourite,
                    'snippet'       => isset($bookmark->snippet) ? $bookmark->snippet : '',
                    'icon'          => $bookmark->icon,
                    'created_at'    => $bookmark->created,
                    'updated_at'    => $bookmark->modified,
                    'user_id'       => 1
                ])->tags()->attach($tagIds);

            }
        }
    }
}
