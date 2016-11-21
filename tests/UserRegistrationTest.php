<?php

use App\User;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class UserRegistrationTest extends TestCase
{
    use WithoutMiddleware;
    use DatabaseTransactions;

    private function registerAUser($name = 'mademan', $username = 'mademan@free.fr', $password = 'mademan19', $confirmation = 'mademan19')
    {
        $response = $this->call('POST', 'auth/register', array(
            '_token' => csrf_token(),
            'name' => $name,
            'username' => $username,
            'password' => $password,
            'password_confirmation' => $confirmation
        ));

        return $response;
    }
    /**
     * Test is user is created after register route
     * We disable send mail middleware
     *
     * @return void
     */
    public function testUserRegistration()
    {

        $this->withoutMiddleware();

        $beforeRegister = count(User::all());

        $this->registerAUser();

        $afterRegister = count(User::all());

        $this->assertEquals($afterRegister, $beforeRegister + 1);
    }

    /**
     * Try to create a user with an already token username
     */
    public function testUserRegistrationFailed()
    {
        $this->withoutMiddleware();

        $this->registerAUser();

        $this->registerAUser();

        // 2 beacause with seed admin user is automatically created
        $this->assertEquals(2, count(User::all()));
    }

    public function testUserRegisterWithoutMailConfirmation()
    {
        putenv('ENABLE_REGISTER_MAIL=false');

        $this->registerAUser();

        $addedUser = User::where('name', 'mademan')->first();

        $this->assertEquals(true, $addedUser->confirmed);
    }

    public function testUserRegisterWithMailConfirmation()
    {
        putenv('ENABLE_REGISTER_MAIL=true');

        $this->registerAUser();

        $addedUser = User::where('name', 'mademan')->first();

        $this->assertEquals(false, $addedUser->confirmed);
    }
}
