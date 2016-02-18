<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserToken extends Model
{

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'user_tokens';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'token', 'expires_at'
    ];

    /**
     * Get the user linked to token.
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
