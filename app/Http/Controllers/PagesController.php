<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

use Auth;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Redirect;

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

            $user = User::where('username', $username)->first();

            if ($user->confirmed == false) {
                return \Redirect::back()->withErrors(trans('messages.notConfirmed'));
            }

            if (!Auth::attempt(['username' => $username, 'password' => $password], true))
            {
                return \Redirect::back()
                    ->withErrors(trans('messages.loginCombo'));
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

    public function showRegister()
    {
        // If user is connected we redirect it to homepage
        if (!Auth::check()) {
            return view('auth/register');
        }

        return redirect('/');
    }


    public function register(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|unique:users',
            'username' => 'required|unique:users,username|email|min:3',
            'password' => 'required|confirmed|min:5',
            'password_confirmation' => 'required|min:5'
        ], User::getFormMessages());

        $userData = $request->all();
        $userData['password'] = Hash::make($userData['password']);

        $user = User::create($userData);

        // check if mail confirmation is disabled
        // if mail confirmation is disabled we set user as confirmed
        if (env('ENABLE_REGISTER_MAIL') === false) {
            $user->confirmed = true;
        } else {
            $user->hashValidation = hash('sha256', $user->username);
        }

        $user->save();

        return view('auth/login', array('message' => trans('messages.account.validationMessage')));
    }

    public function validation($hashValidation, Request $request)
    {
        $user = User::where('hashValidation', $hashValidation)->first();

        if ($user) {
            if ($user->confirmed) { return Redirect::to('/'); }

            $user->confirmed = true;
            $user->hashValidation = null;
            $user->save();

            return view('auth/login', array('message' => trans('messages.account.validated')));
        }

        return Redirect::to('/');
    }

}
