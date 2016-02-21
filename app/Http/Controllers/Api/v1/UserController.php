<?php

namespace App\Http\Controllers\Api\v1;

use Auth;
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
                'message' => 'No user sessions found.'
            ];
        }

        return [
            'result' => 'ok',
            'message' => ''
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
                    'message' => 'That username/password combo does not exist.'
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
                'message' => 'Active session limit reached. Please logout to clean out session tokens.'
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
                'message' => 'No session found, please login again.'
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
                'message' => 'No session found, please login again.'
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
                    'message' => 'Both passwords must match.'
                ];
            }
            $user->password = \Hash::make($request->input('password1'));
        }

        $user->save();

//        $userData = [
//            'name' => $user->name,
//            'email' => $user->username
//        ];

        return [
            'result' => 'ok',
            'message' => ''
        ];
    }

//    /**
//     * Check if token is valid for current user.
//     *
//     * @param Request $request
//     */
//    public function token(Request $request) {
//        $token = $request->input('token');
//
//        // Check if token is not empty
//        if ($token == '') {
//            return [
//                'result' => 'error',
//                'message' => 'The token is invalid.'
//            ];
//        }
//
//        $userToken = \App\UserToken::where('token', $token)
//            ->where('expires_at', '>', \Carbon\Carbon::now())
//            ->first();
//
//        // Token does not exist
//        if (!$userToken) {
//            return [
//                'result' => 'error',
//                'message' => 'The token is invalid or has expired.'
//            ];
//        }
//
//        // Refresh current token expiry timestamp
//        $userToken->update([
//            'expires_at' => \Carbon\Carbon::now()->addSeconds(self::$session_expiry)
//        ]);
//
//        // Clean up expired tokens
//        foreach ($userToken
//                     ->user
//                     ->tokens()
//                     ->where('expires_at', '<', \Carbon\Carbon::now())
//                     ->get() as $tokenObject) {
//            $tokenObject->delete();
//        }
//
//        // At this point we are happy that the user has a valid token
//        return [
//            'result' => 'ok',
//            'message' => ''
//        ];
//    }
//
//    /**
//     * Generate unique token.
//     *
//     * @return string
//     */
//    private function generateToken() {
//        $uuid4 = Uuid::uuid4();
//
//        return $uuid4->toString();
//    }
//
//    /**
//     * Associate usertoken with user model.
//     *
//     * @param $token
//     */
//    private function associateToken($token) {
//        \App\UserToken::create([
//            'token' => $token,
//            'user_id' => Auth::id(),
//            'expires_at' => \Carbon\Carbon::now()->addSeconds(self::$session_expiry)
//        ]);
//    }

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
}
