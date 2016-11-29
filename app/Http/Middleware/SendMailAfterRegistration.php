<?php

namespace App\Http\Middleware;

use App\MailUtility;
use App\User;
use Closure;

class SendMailAfterRegistration
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        return $next($request);
    }

    public function terminate($request, $response)
    {
        $data = $request->all();

        $user = User::where('username', $data['username'])->first();

        MailUtility::sendRegisterMail($user);
    }
}
