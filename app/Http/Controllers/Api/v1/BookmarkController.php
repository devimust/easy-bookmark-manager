<?php

namespace App\Http\Controllers\Api\v1;

use Auth;
use DB;
use App\Bookmark;
use Illuminate\Http\Request;

use Response;
use App;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Mockery\CountValidator\Exception;

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
        $limit = is_numeric($request->input('limit')) && $request->input('limit') < 100 ? $request->input('limit') : 100;

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
        $skip = ($pageNr-1) * $limit;
        $collection = $collection
            ->skip($skip)
            ->take($limit)
            ->orderBy('bookmarks.favourite', 'desc')
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
            ->select('name', DB::raw('COUNT(name) AS count'))
            ->where('user_id', '=', Auth::id())
            ->where('name', '<>', '')
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
            ->select('category as name', DB::raw('COUNT(category) AS count'))
            ->where('user_id', '=', Auth::id())
            ->where('category', '<>', '')
            ->groupBy('category')
            ->orderBy('count', 'DESC')
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

        if ($bookmark->icon == '' && $bookmark->link != '') {
            $bookmark->icon = self::getSiteFavicon($bookmark->link);
            $bookmark->save();
        }

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

        if ($bookmark->icon == '' && $bookmark->link != '') {
            $bookmark->icon = self::getSiteFavicon($bookmark->link);
            $bookmark->save();
        }

        $tags = $request->input('tags') != '' ? $request->input('tags') : [];

        $this->syncTags($bookmark, $tags);

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
     * Import bookmarks via a file POST method containing chrome-exported html
     * bookmark data.
     *
     * @param Request $request
     * @return array
     */
    public function import(Request $request) {
        if (
            !$request->hasFile('bookmarkfile') ||
            !$request->file('bookmarkfile')->isValid()
        ) {
            return [
                'result' => 'error',
                'message' => 'There was a problem with uploading the file.'
            ];
        }

        $fileObject = $request->file('bookmarkfile');

        $file = $fileObject->getRealPath();

        $count = 0;

        switch ($fileObject->getClientOriginalExtension()) {
            case 'html' :
                $count = $this->importHtml($file);
                break;
            case 'json' :
                $count = $this->importJson($file);
                break;
        }

        return [
            'result' => 'ok',
            'message' => '',
            'data' => [
                'imported' => $count
            ]
        ];
    }


    /**
     * Export bookmark data to downloadable json file.
     *
     * @param Request $request
     * @return file
     */
    public function export(Request $request) {
        $bookmarks = Auth::user()
            ->bookmarks()
            ->orderBy('id')
            ->get();

        $objects = [];
        foreach ($bookmarks as $bookmark) {
            $tags = [];
            foreach ($bookmark->tags as $tag) {
                $tags[] = $tag->name;
            }

            $objects[] = [
                'title'      => $bookmark->title,
                'link'       => $bookmark->link,
                'category'   => $bookmark->category,
                'favourite'  => $bookmark->favourite,
                'snippet'    => $bookmark->snippet,
                'icon'       => $bookmark->icon,
                'created'    => $bookmark->created_at->format('Y-m-d H:i:s'),
                'modified'   => $bookmark->updated_at->format('Y-m-d H:i:s'),
                'tags'       => $tags
            ];
        }

        $headers = array(
            'Content-Type' => 'application/json; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="bookmarks-export-' . date('Ymd-His') . '.json"',
        );

        $responseData = json_encode(['bookmarks' => $objects]);

        return Response::make($responseData, 200, $headers);
    }

    /**
     * Import json file type as exported by application.
     *
     * @param $file
     * @return int
     */
    private function importJson($file) {
        $data = @file_get_contents($file);
        $importObject = json_decode($data);

        if (!isset($importObject->bookmarks)) {
            return 0;
        }

        $count = 0;

        foreach ($importObject->bookmarks as $bookmark) {

            $tagIds = [];

            foreach ($bookmark->tags as $tagString) {
                $tag = Auth::user()
                    ->tags()
                    ->where('name', '=', $tagString)
                    ->first();
                if (!$tag) {
                    $tag = Auth::user()
                        ->tags()
                        ->create([ 'name' => $tagString ]);
                }
                $tagIds[] = $tag->id;
            }

            Auth::user()->bookmarks()->create([
                'title'      => $bookmark->title,
                'link'       => $bookmark->link,
                'category'   => $bookmark->category,
                'favourite'  => $bookmark->favourite,
                'snippet'    => isset($bookmark->snippet) ? $bookmark->snippet : '',
                'icon'       => $bookmark->icon,
                'created_at' => $bookmark->created,
                'updated_at' => $bookmark->modified
            ])->tags()->attach($tagIds);

            $count++;

        }
        return $count;
    }

    /**
     * Import html (xml) file type.
     *
     * @param $file
     * @return int
     */
    private function importHtml($file) {
        // check if file is valid xml
        $xml = new \XMLReader;
        $xml->open($file);
        $xml->setParserProperty(\XMLReader::VALIDATE, true);
        if (!$xml->isValid()) {
            return 0;
        }

        $doc = @\DOMDocument::loadHTMLFile($file);
        $count = 0;
        foreach ($doc->getElementsByTagName('a') as $node) {
            Auth::user()->bookmarks()->create([
                'title'      => $node->nodeValue,
                'link'       => $node->getAttribute("href"),
                'category'   => 'Unsorted',
                'favourite'  => false,
                'icon'       => $node->getAttribute("icon"),
                'created_at' => $node->getAttribute("add_date"),
                'updated_at' => $node->getAttribute("add_date")
            ]);
            $count++;
        }
        return $count;
    }

    /**
     * Build up json format structure.
     *
     * @param App\Bookmark $bookmark
     * @return array
     */
    private function buildBookmark(App\Bookmark $bookmark) {
        $bookmarkId = $bookmark->id;

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
                $tag->name = trim(strtolower($tagName));
                $tag->user()->associate(Auth::user());
                $tag->save();
            }
            $bookmark->tags()->attach($tag->id);
        }
    }

    /**
     * Check how many duplicates exist of a potential new bookmark. We match by
     * the bookmark title as the link might contain multiple domains e.g. stackoverflow.
     *
     * @param Request $request
     * @return array
     */
    public function duplicates(Request $request) {
        if ($request->input('title') == '') {
            return [
                'result' => 'ok',
                'message' => ''
            ];
        }

        $collection = Auth::user()
            ->bookmarks()
            ->select('title', 'link', DB::raw('COUNT(*) as total'))
            ->where('title', '=', $request->input('title'))
            ->groupBy('title', 'link')
            ->get();

        $data = [];
        $total = 0;

        foreach ($collection as $bookmark) {
            $data[] = [
                'link' => $bookmark->link,
                'title' => $bookmark->title
            ];
            $total++;
        }

        return [
            'result' => 'ok',
            'message' => '',
            'data' => [
                'totalCount' => $total,
                'bookmarks' => $data
            ]
        ];
    }


    /**
     * Retrieve favicon via google of target url
     *
     * @param $url
     * @return string
     */
    public static function getSiteFavicon($link) {
        if (empty($link)) {
            return '';
        }
        $ch = curl_init('http://www.google.com/s2/favicons?domain=' . $link);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $data = curl_exec($ch);
        curl_close($ch);
        if ($data == '') {
            return '';
        }
        $base64 = 'data:image/png;base64,' . base64_encode($data);
        return $base64;
    }

    /**
     * Retrieve title of target link.
     *
     * @param $link
     * @return string
     */
    public static function getSiteTitle($link) {
        if (empty($link)) {
            return '';
        }
        try {
            $str = @file_get_contents($link);
            if (strlen($str) == 0) {
                return '';
            }
            $str = trim(preg_replace('/\s+/', ' ', $str)); // supports line breaks inside <title>
            preg_match("/\<title\>(.*)\<\/title\>/i", $str, $title); // ignore case
            if (count($title) <= 1) {
                return '';
            }
            return $title[1];
        } catch (Exception $e) {
            return '';
        }
    }
}
