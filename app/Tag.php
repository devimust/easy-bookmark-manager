<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'tags';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name'
    ];

    /**
     * Get the bookmarks for the tag.
     */
    public function bookmarks()
    {
        return $this->belongsToMany('App\Bookmark', 'bookmark_tag');
    }

    /**
     * Get the user linked to the tag.
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
