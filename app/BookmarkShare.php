<?php

namespace App;

use App\Http\Controllers\Api\v1\BookmarkController;
use Illuminate\Database\Eloquent\Model;

class BookmarkShare extends Model
{

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'bookmark_shares';

    // /**
    //  * The attributes that should be casted to native types.
    //  *
    //  * @var array
    //  */
    // protected $casts = [
    //     'favourite' => 'boolean'
    // ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'bookmark_id'
    ];

    // /**
    //  * Get the tags for the bookmark.
    //  */
    // public function tags()
    // {
    //     return $this->belongsToMany('App\Tag', 'bookmark_tag');
    // }

    // /**
    //  * Get the tags for the bookmark.
    //  */
    // public function sharedWith()
    // {
    //     return $this->belongsToMany('App\Tag', 'bookmark_share');
    // }

    /**
     * Get the user linked to the bookmark.
     */
    public function bookmark()
    {
        return $this->belongsTo('App\Bookmark');
    }

    /**
     * Get the user linked to the bookmark.
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }

    // /**
    //  * Cast input to boolean type.
    //  *
    //  * @param $value
    //  */
    // public function setFavouriteAttribute($value)
    // {
    //     $this->attributes['favourite'] = filter_var($value, FILTER_VALIDATE_BOOLEAN);
    // }

    // /**
    //  * Cast output to boolean type.
    //  *
    //  * @param $value
    //  * @return bool
    //  */
    // public function getFavouriteAttribute($value)
    // {
    //     return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    // }

    // /**
    //  * Set the bookmark category based on env setting.
    //  *
    //  * @param  string  $value
    //  * @return string
    //  */
    // public function setCategoryAttribute($value)
    // {
    //     $category = $value;

    //     // set category to Unsorted if empty string and env is configured
    //     if ($category == '') {
    //         if (env('ALLOW_UNSORTED_CATEGORY', true)) {
    //             $category = 'Unsorted';
    //         }
    //     }

    //     $this->attributes['category'] = $category;
    // }

    // /**
    //  * Update bookmark title if title is empty and link exist.
    //  *
    //  * @param array $attributes
    //  * @return $this
    //  */
    // public function fill(array $attributes)
    // {
    //     $title = isset($attributes['title']) ? $attributes['title'] : '';
    //     $link = isset($attributes['link']) ? $attributes['link'] : '';
    //     if (isset($attributes['title']) && $title == '' && $link != '') {
    //         $attributes['title'] = BookmarkController::getSiteTitle($link);
    //     }
    //     return parent::fill($attributes);
    // }
}
