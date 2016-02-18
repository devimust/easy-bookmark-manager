<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Auth;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class PagesController extends Controller
{

    /**
     * Main page entry point.
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function showIndex()
    {
        return view('pages/home');
    }

    /**
     * Show the login form to the user.
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function showLogin()
    {
        if (Auth::check()) {
            return \Redirect::to('/');
        }

        return view('auth/login');
    }

    /**
     * Log the user in
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function login(Request $request)
    {
        // User is NOT logged in
        if (!Auth::check()) {
            $username = $request->input('username');
            $password = $request->input('password');

            if (!Auth::attempt(['username' => $username, 'password' => $password], true))
            {
                return \Redirect::back()
                    ->withErrors('That username/password combo does not exist.');
            }
        }

        return \Redirect::to('/');
    }


    /**
     * Log the user out
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function logout()
    {
        if (!Auth::check()) {
            return redirect('/');
        }

        // @todo clean any existing tokens on logout
        // ...

        Auth::logout();

        return redirect('/');
    }

}
