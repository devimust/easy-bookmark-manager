<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\User;
use App\Http\Requests;
use Redirect;
use App\Http\Controllers\Controller;

class UserAdminController extends Controller
{

    static $form_messages = [
        'username.required' => 'The email field is required.',
        'username.email' => 'The email must be a valid email address.',
        'username.unique' => 'The email has already been taken.'
    ];

    /**
     * Display a listing of the user model.
     *
     * @return Response
     */
    public function index()
    {
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
            'name' => 'required',
            'username' => 'required|unique:users,username|email|min:3',
            'password' => 'required|confirmed|min:5'
        ], self::$form_messages);

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
        ], self::$form_messages);

        $user = User::findOrFail($id);

        $userData = [
            'name' => $request->input('name'),
            'username' => $request->input('username'),
            'administrator' => $request->input('administrator')
        ];

        if ($request->input('password') != '') {
            $userData['password'] = \Hash::make($request->input('password'));
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
