<?php

use Illuminate\Database\Seeder;
use App\Tag;
use App\Bookmark;

class DummyBookmarksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (file_exists(dirname(__FILE__) . '/DummyBookmarks.json')) {
            $data = file_get_contents(dirname(__FILE__) . '/DummyBookmarks.json');
            $importObject = json_decode($data);

            $this->command->getOutput()->writeln("<info>Importing:</info> " . count($importObject->bookmarks) . " rows");

            foreach ($importObject->bookmarks as $bookmark) {
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
                    'title'      => $bookmark->title,
                    'link'       => $bookmark->link,
                    'category'   => $bookmark->category,
                    'favourite'  => $bookmark->favourite,
                    'snippet'    => isset($bookmark->snippet) ? $bookmark->snippet : '',
                    'icon'       => $bookmark->icon,
                    'created_at' => $bookmark->created,
                    'updated_at' => $bookmark->modified,
                    'user_id'       => 1
                ])->tags()->attach($tagIds);
            }
        }
    }
}
