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
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'link', 'favourite', 'snippet', 'icon'
    ];

    /**
     * Get the tags for the bookmark.
     */
    public function tags()
    {
        return $this->belongsToMany('App\Tag');
    }
}
