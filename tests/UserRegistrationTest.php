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
        $payload = [
            'name' => $name,
            'username' => $username,
            'password' => $password,
            'password_confirmation' => $confirmation,
            '_token' => csrf_token()
        ];

        $response = $this->call('POST', 'auth/register', $payload);

        return $response;
    }

    /**
     * Run migration tasks
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();

        Artisan::call('migrate');
        // Artisan::call('db:seed');
    }

    /**
     * Test is user is created after register route
     * We disable send mail middleware
     *
     * @return void
     */
    public function testUserRegistration()
    {
        $beforeRegisterCount = count(User::all());
        $this->assertEquals(0, $beforeRegisterCount);

        $response = $this->registerAUser();
        $this->assertEquals(200, $response->getStatusCode());

        $afterRegisterCount = count(User::all());
        $this->assertEquals(1, $afterRegisterCount);
    }

    /**
     * Try to create a user with an already token username
     */
    public function testUserRegistrationFailed()
    {

        $beforeRegisterCount = count(User::all());
        $this->assertEquals(0, $beforeRegisterCount);

        $response = $this->registerAUser();
        $this->assertEquals(200, $response->getStatusCode());

        $response = $this->registerAUser();
        $this->assertEquals(302, $response->getStatusCode());

        $afterRegisterCount = count(User::all());
        $this->assertEquals(1, $afterRegisterCount);
    }
}
