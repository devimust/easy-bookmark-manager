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
        'name', 'username', 'password', 'administrator', 'can_share'
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
     * Get the bookmarks for the user.
     */
    public function bookmarks()
    {
        return $this->hasMany('App\Bookmark');
    }

    /**
     * Get the bookmarks for the tag.
     */
    public function tags()
    {
        return $this->hasMany('App\Tag');
    }

    public static function getFormMessages()
    {
        return  [
            'username.required' => trans('messages.userNameRequired'),
            'username.email' => trans('messages.usernameEmail'),
            'username.unique' => trans('messages.usernameUnique')
        ];
    }

    /**
     * See if this user is allowed to share bookmarks by returning
     * the output message.
     */
    public function getCanShareText()
    {
        if ($this->can_share) {
            return trans('messages.yes') . '('.$this->can_share.')';
        }

        if ($this->administrator) {
            return '(' . trans('messages.yes') . ')';
        }

        return trans('messages.no');
    }
}
