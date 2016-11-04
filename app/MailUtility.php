<?php
/**
 * Created by IntelliJ IDEA.
 * User: administrator
 * Date: 04/11/16
 * Time: 20:05
 */

namespace App;


use Illuminate\Support\Facades\Mail;

class MailUtility
{
    public static function sendMail(User $user)
    {
        Mail::send('emails.register', [], function ($m) use($user) {
            $m->from(env('MAIL_USERNAME'), 'Bookmark Manager');

            $m->to($user->username, $user->name)->subject('Account confirmation');
        });
    }

}
