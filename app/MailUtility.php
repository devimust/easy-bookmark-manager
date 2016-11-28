<?php

namespace App;

use Illuminate\Support\Facades\Mail;

class MailUtility
{
    public static function sendRegisterMail(User $user)
    {
        Mail::send('emails.register', ['user' => $user], function ($m) use($user) {
            $m->from(env('MAIL_USERNAME', 'user@domain.com'), 'Bookmark Manager');

            $m->to($user->username, $user->name)->subject('Account confirmation');
        });
    }

}
