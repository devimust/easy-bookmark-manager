<?php

namespace App\Http\Controllers\Api\v1;

use Auth;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Ramsey\Uuid\Uuid;

class UserController extends Controller
{

    static $session_expiry = 86400;

    public function index() {
        return 'This is API v1';
    }

    public function loginStatus() {
        if (!Auth::check()) {
            return [
                'result' => 'error',
                'message' => trans('message.user.noSession')
            ];
        }

        return [
            'result' => 'ok',
            'message' => '',
            'data' => [
                'username' => Auth::user()->username,
                'canAccessAdmin' => (Auth::user()->administrator && (env('ADMIN_ENABLED') === true) ? 'yes' : 'no')
            ]
        ];
    }

    /**
     * Log the user in via username and password.
     *
     * @param Request $request
     * @return array
     */
    public function login(Request $request) {
        // User is NOT logged in
        if (!Auth::check()) {
            $username = $request->input('username');
            $password = $request->input('password');

            if (!Auth::attempt(['username' => $username, 'password' => $password], true))
            {
                return [
                    'result' => 'error',
                    'message' => trans('messages.loginCombo')
                ];
            }
        }

        // Get active tokens
        $activeTokenCount = \App\User::find(Auth::id())
            ->tokens()
            ->where('expires_at', '>', \Carbon\Carbon::now())
            ->count();
        if ($activeTokenCount > 10) {
            // Should we have a bad response now? It appears to be a DOS attack
            return [
                'result' => 'error',
                'message' => trans('messages.user.sessionReached')
            ];
        }

        $token = $this->generateToken();

        $this->associateToken($token);

        return [
            'result' => 'ok',
            'message' => '',
            'data' => [
                'token' => $token
            ]
        ];
    }

    /**
     * Return current user details.
     *
     * @param Request $request
     * @return array
     */
    public function edit(Request $request) {
        $user = Auth::user();

        if (!$user) {
            return [
                'result' => 'error',
                'message' => trans('message.user.noSession')
            ];
        }

        $userData = [
            'name' => $user->name,
            'email' => $user->username
        ];

        return [
            'result' => 'ok',
            'message' => '',
            'data' => [
                'user' => $userData
            ]
        ];
    }

    /**
     * Update current user details.
     *
     * @param Request $request
     * @return array
     */
    public function update(Request $request) {
        $user = Auth::user();

        if (!$user) {
            return [
                'result' => 'error',
                'message' => trans('message.user.noSession')
            ];
        }

        if ($request->input('name') != '')
            $user->name = $request->input('name');

        if ($request->input('email') != '')
            $user->username = $request->input('email');

        if ($request->input('password1') != '' && $request->input('password2') != '') {
            if ($request->input('password1') != $request->input('password2')) {
                return [
                    'result' => 'error',
                    'message' => trans('messages.password.match')
                ];
            }
            $user->password = \Hash::make($request->input('password1'));
        }

        $user->save();

        return [
            'result' => 'ok',
            'message' => ''
        ];
    }

    /**
     * Log the user in if logged in.
     *
     * @return array
     */
    public function logout() {
        Auth::logout();

        return [
            'result' => 'ok',
            'message' => ''
        ];
    }

    /**
     * Retrieve bookmark sharing information.
     *
     * @return array
     */
    public function shareInfo(Request $request) {
        $user = Auth::user();

        if (!$user) {
            return [
                'result' => 'error',
                'message' => trans('message.user.noSession')
            ];
        }

        $users = ['all'];
        $collection = User::where('id', '<>', $user->id) // exclude logged in user (ie cannot share with yourself)
                        ->where(function($query) {
                            $query
                                ->orWhere('administrator', '=', '1')
                                ->orWhere('can_share', '=', '1');
                            })
                        ->orderBy('username')
                        ->get();
        foreach ($collection as $item) {
            $users[] = strtolower($item->username);
        }

        $canShare = ($user->administrator || $user->can_share);

        return [
            'result' => 'ok',
            'message' => '',
            'data' => [
                'canShare' => $canShare ? 'yes' : 'no',
                'shareWith' => $canShare ? $users : []
            ]
        ];
    }
}
