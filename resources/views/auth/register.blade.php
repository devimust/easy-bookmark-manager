@extends('app')

@section('content')

    <div class="container-fluid">

        @include('partials/hero')

        <div class="row">
            <div class="col-md-4"></div>

            <div class="col-md-4">

                <h1>
                    {{ trans('messages.user.register') }}
                    <a href="/" class="btn btn-default pull-right">
                        {{ trans('messages.back') }}
                    </a>
                </h1>

                {{ Form::open(['role' => 'form', 'url' => 'auth/register', 'name' => 'register']) }}

                @include('useradmin/registerform')

                @include('partials/errors')

                <div class='form-group'>
                    {{ Form::submit(trans('messages.user.register'), ['class' => 'btn btn-success']) }}
                </div>

                {{ Form::close() }}

            </div>
        </div>
    </div>
@endsection
