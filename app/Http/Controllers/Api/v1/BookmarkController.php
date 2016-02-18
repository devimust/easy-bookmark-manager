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
     * Returns a list of all bookmarks filtered by various request parameters. Bookmarks are filters by
     * (categories or tags) and search (if it was parsed)
     *
     * @return array
     */
    public function index(Request $request) {
        $bookmarks = [];
        $totalCount = 0;

        $categories = $request->input('categories') != '' ? explode(',', $request->input('categories')) : [];
        $tags = $request->input('tags') != '' ? explode(',', $request->input('tags')) : [];
        $search = $request->input('search');
        $pageNr = is_numeric($request->input('page')) ? $request->input('page') : 0;
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

        $collection = $collection
            ->skip($pageNr)
            ->take($limit)
            ->orderBy('bookmarks.updated_at', 'desc')
            ->get();

        $totalCount = $collection->count();

        foreach($collection as $bookmark) {
            $tags = [];

            foreach ($bookmark->tags as $tag) {
                $tags[] = $tag->name;
            }

            $item = [
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
        $categories = DB::table('bookmarks')
            ->select('category as name', DB::raw('COUNT(category) as count'))
            ->where('user_id', '=', Auth::id())
            ->groupBy('category')
            ->orderBy('count', 'desc')
            ->get();

        // Get list of tags
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
                'categories' => $categories,
                'tags' => $tags
            ]
        ];
    }
}
