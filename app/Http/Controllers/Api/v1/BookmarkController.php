<?php

namespace App\Http\Controllers\Api\v1;

use Auth;
use DB;
use Illuminate\Http\Request;

use App;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class BookmarkController extends Controller
{

    /**
     * Returns a collection of all bookmarks filtered by various request parameters. Bookmarks are filters by
     * (categories or tags) and search (if it was parsed).
     *
     * @return array
     */
    public function index(Request $request) {
        $bookmarks = [];

        $categories = $request->input('categories') != '' ? explode(',', $request->input('categories')) : [];
        $tags = $request->input('tags') != '' ? explode(',', $request->input('tags')) : [];
        $search = $request->input('search');
        $pageNr = is_numeric($request->input('page')) ? $request->input('page') : 1;
        $limit = is_numeric($request->input('limit')) && $request->input('limit') < 250 ? $request->input('limit') : 250;

        $collection = Auth::user()
            ->bookmarks();

        $collection = $collection
            ->select('bookmarks.id', 'title', 'favourite', 'link', 'snippet', 'icon', 'category')
            ->distinct();

        if (count($categories) || count($tags)) {

            if (count($tags)) {
                $collection = $collection
                    ->join('bookmark_tag', 'bookmarks.id', '=', 'bookmark_tag.bookmark_id')
                    ->join('tags', 'tags.id', '=', 'bookmark_tag.tag_id');
            }

            $collection = $collection
                ->Where(function($query) use ($categories, $tags) {
                    if (count($categories)) {
                        foreach ($categories as $cat) {
                            $query
                                ->orWhere('category', '=', $cat);
                        }
                    }

                    if (count($tags)) {
                        $query
                            ->orWhere('tags.name', '=', 'video')
                            ->orWhere('tags.name', '=', 'markdown');
                        foreach ($tags as $tag) {
                            $query
                                ->orWhere('tags.name', '=', $tag);
                        }
                    }
                });
        }

        if ($search != '') {
            $collection = $collection
                ->Where(function($query) use ($search) {
                    $query
                        ->orWhere('title', 'like', '%'.$search.'%')
                        ->orWhere('link', 'like', '%'.$search.'%')
                        ->orWhere('snippet', 'like', '%'.$search.'%');
                });
        }

        $totalCount = $collection->count();

        // Ensure page count starts at 0
        $pageNr--;
        $collection = $collection
            ->skip($pageNr)
            ->take($limit)
            ->orderBy('bookmarks.updated_at', 'desc')
            ->get();

        foreach($collection as $bookmark) {
            $tags = [];

            foreach ($bookmark->tags as $tag) {
                $tags[] = $tag->name;
            }

            $item = [
                'id' => $bookmark->id,
                'title' => $bookmark->title,
                'favourite' => (bool)$bookmark->favourite,
                'link' => $bookmark->link,
                'snippet' => $bookmark->snippet,
                'icon' => $bookmark->icon,
                'category' => $bookmark->category,
                'tags' => $tags
            ];

            $bookmarks[] = $item;
        }

        return [
            'result' => 'ok',
            'message' => '',
            'data' => [
                'bookmarks' => $bookmarks,
                'totalCount' => $totalCount
            ]
        ];
    }

    /**
     * Return list of categories and tags.
     *
     * @return array
     */
    public function categoriesAndTags(Request $request) {
        // Get list of categories
        $categories = [];
        $result = $this->categories($request);
        if ($result['result'] == 'ok') {
            $categories = $result['data']['categories'];
        }

        // Get list of tags
        $tags = [];
        $result = $this->tags($request);
        if ($result['result'] == 'ok') {
            $tags = $result['data']['tags'];
        }

        return [
            'result' => 'ok',
            'message' => '',
            'data' => [
                'categories' => $categories,
                'tags' => $tags
            ]
        ];
    }

    /**
     * Return list of tags.
     *
     * @return array
     */
    public function tags(Request $request) {
        $tags = DB::table('tags')
            ->join('bookmark_tag', 'tags.id', '=', 'bookmark_tag.tag_id')
            ->select('name', DB::raw('COUNT(name) as count'))
            ->where('user_id', '=', Auth::id())
            ->groupBy('name')
            ->get();

        return [
            'result' => 'ok',
            'message' => '',
            'data' => [
                'tags' => $tags
            ]
        ];
    }

    /**
     * Return list of categories.
     *
     * @return array
     */
    public function categories(Request $request) {
        // Get list of categories
        $categories = DB::table('bookmarks')
            ->select('category as name', DB::raw('COUNT(category) as count'))
            ->where('user_id', '=', Auth::id())
            ->groupBy('category')
            ->orderBy('count', 'desc')
            ->get();

        return [
            'result' => 'ok',
            'message' => '',
            'data' => [
                'categories' => $categories
            ]
        ];
    }

    /**
     * Return bookmark identified by id.
     *
     * @return array
     */
    public function edit(Request $request, $id) {
        $bookmark = Auth::user()
            ->bookmarks()
            ->find($id);

        if (!$bookmark) {
            return [
                'result' => 'error',
                'message' => 'Could not retrieve the item.'
            ];
        }

        return [
            'result' => 'ok',
            'message' => '',
            'data' => [
                'bookmark' => $this->buildBookmark($bookmark)
            ]
        ];
    }

    /**
     * Create a new bookmark.
     *
     * @return array
     */
    public function create(Request $request) {
        $bookmark = Auth::user()->bookmarks()->create($request->all());

        $this->syncTags($bookmark, $request->input('tags'));

        return [
            'result' => 'ok',
            'message' => '',
            'data' => [
                'bookmark' => $this->buildBookmark($bookmark)
            ]
        ];
    }

    /**
     * Update an existing bookmark.
     *
     * @return array
     */
    public function update(Request $request, $id) {
        $bookmark = Auth::user()
            ->bookmarks()
            ->find($id);

        if (!$bookmark) {
            return [
                'result' => 'error',
                'message' => 'Could not retrieve the item.'
            ];
        }

        $bookmark->update($request->all());

        $this->syncTags($bookmark, $request->input('tags'));

        return [
            'result' => 'ok',
            'message' => '',
            'data' => [
                'bookmark' => $this->buildBookmark($bookmark)
            ]
        ];
    }

    /**
     * Delete an existing bookmark.
     *
     * @return array
     */
    public function delete(Request $request, $id) {
        $bookmark = Auth::user()
            ->bookmarks()
            ->find($id);

        if (!$bookmark) {
            return [
                'result' => 'error',
                'message' => 'Could not retrieve the item.'
            ];
        }

        $this->syncTags($bookmark, []);

        $bookmark->delete();

        return [
            'result' => 'ok',
            'message' => ''
        ];
    }

    /**
     * Build up json format structure.
     *
     * @param App\Bookmark $bookmark
     * @return array
     */
    private function buildBookmark(App\Bookmark $bookmark) {
        $tags = [];
        foreach ($bookmark->tags()->get() as $tag) {
            $tags[] = $tag->name;
        }

        return [
            'id' => $bookmark->id,
            'title' => $bookmark->title,
            'favourite' => (bool)$bookmark->favourite,
            'link' => $bookmark->link,
            'snippet' => $bookmark->snippet,
            'category' => $bookmark->category,
            'tags' => $tags
        ];
    }

    /**
     * Sync up the list of tags in the database
     *
     * @param App\Bookmark $bookmark
     * @param array $tags
     */
    private function syncTags(App\Bookmark $bookmark, $tags)
    {
        if (!is_array($tags)) {
            return;
        }

        $newTags = $tags;
        $newTags = array_map('strtolower', $newTags); //force all values to lowercase
        $newTags = array_unique($newTags); //strip out duplicates

        // Unlink tags we don't need
        foreach ($bookmark->tags as $tag) {
            if (!in_array($tag->name, $tags)) {
                $bookmark->tags()->detach($tag->id);
                // This tag is not linked to anything so we can delete
                if (!$tag->bookmarks()->count()) {
                    $tag->delete();
                }
            } else {
                $key = array_search($tag->name, $newTags);
                unset($newTags[$key]);
                $newTags = array_values($newTags);
            }
        }

        // Create new ones
        foreach ($newTags as $tagName) {
            $tag = App\Tag::where('name', '=', $tagName)
                ->where('user_id', '=', Auth::id())
                ->first();
            if (!$tag) {
                $tag = new App\Tag();
                $tag->name = $tagName;
                $tag->user()->associate(Auth::user());
                $tag->save();
            }
            $bookmark->tags()->attach($tag->id);
        }
    }
}
