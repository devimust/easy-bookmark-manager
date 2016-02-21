<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Bookmark extends Model
{

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'bookmarks';

    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'favourite' => 'boolean'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'link', 'favourite', 'snippet', 'icon', 'category'
    ];

    /**
     * Get the tags for the bookmark.
     */
    public function tags()
    {
        return $this->belongsToMany('App\Tag', 'bookmark_tag');
    }

    /**
     * Get the user linked to the bookmark.
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }

    /**
     * Cast input to boolean type.
     *
     * @param $value
     */
    public function setFavouriteAttribute($value)
    {
        $this->attributes['favourite'] = filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }

    /**
     * Cast output to boolean type.
     *
     * @param $value
     * @return bool
     */
    public function getFavouriteAttribute($value)
    {
        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }
}
