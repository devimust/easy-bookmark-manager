<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'username', 'password', 'administrator'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * Get the tokens for the user.
     */
    public function tokens()
    {
        return $this->hasMany('App\UserToken');
    }

    /**
     * Get the bookmarks for the user.
     */
    public function bookmarks()
    {
        return $this->hasMany('App\Bookmark');
    }
}
