<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Auth;
use App;
use Hash;

use App\User;
use App\Http\Requests;
use Redirect;
use App\Http\Controllers\Controller;

class UserAdminController extends Controller
{

    private function getFormMessages()
    {
        return  [
            'username.required' => trans('messages.userNameRequired'),
            'username.email' => trans('messages.usernameEmail'),
            'username.unique' => trans('messages.usernameUnique')
        ];
    }

    /**
     * Display a listing of the user model.
     *
     * @return Response
     */
    public function index()
    {
        if (!Auth::check()) {
            return Redirect::to('/');
        }

        if (!Auth::user()->administrator) {
            App::abort(403, 'Access denied');
        }

        $users = User::all();

        return view('useradmin.index', compact('users'));
    }

    /**
     * Show the form for creating a new user.
     *
     * @return Response
     */
    public function create()
    {
        return view('useradmin.create');
    }

    /**
     * Store a newly created user in storage.
     *
     * @return Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|unique:users',
            'username' => 'required|unique:users,username|email|min:3',
            'password' => 'required|confirmed|min:5'
        ], $this->getFormMessages());

        User::create($request->all());

        return Redirect::to('/admin/users');
    }

    /**
     * Show the form for editing the specified user.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        $user = User::findOrFail($id);

        return view('useradmin.edit', compact('user'));
    }

    /**
     * Update the specified user in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id, Request $request)
    {
        $this->validate($request, [
            'name' => 'required',
            'username' => 'required|unique:users,username,' . $id . '|email|min:3',
            'password' => 'confirmed|min:5'
        ], $this->getFormMessages());

        $user = User::findOrFail($id);

        $userData = [
            'name' => $request->input('name'),
            'username' => $request->input('username'),
            'administrator' => $request->input('administrator')
        ];

        if ($request->input('password') != '') {
            $userData['password'] = Hash::make($request->input('password'));
        }

        $user->update($userData);

        return Redirect::to('/admin/users');
    }

    /**
     * Remove the specified user from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        User::destroy($id);

        return Redirect::to('/admin/users');
    }

}
