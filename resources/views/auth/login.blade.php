@extends('app')

@section('content')

    <div class="container-fluid">

        @include('partials/hero')

        <div class="row">
            <div class="col-md-4"></div>

            <div class="col-md-4">

                {{ Form::open(['id' => 'login-form', 'role' => 'form', 'url' => '/auth/login']) }}

                    {!! csrf_field() !!}

                    <div class='form-group'>
                        {{ Form::text('username', null, ['id' => 'username', 'placeholder' => 'Email', 'class' => 'form-control']) }}
                    </div>

                    <div class='form-group'>
                        {{ Form::password('password', ['id' => 'password', 'placeholder' => 'Password', 'class' => 'form-control']) }}
                    </div>

                    <div class='form-group'>
                        @include('partials/errors')
                    </div>

                    {{ Form::submit('Sign in', ['id' => 'submit-button', 'class' => 'btn btn-primary btn-small btn-block']) }}

                {{ Form::close() }}

            </div>
        </div>
    </div>

@stop


