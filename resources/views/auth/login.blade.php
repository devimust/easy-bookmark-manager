@extends('app')

@section('content')

    <div class="container-fluid">

        @include('partials/hero')

        <div class="row">
            <div class="col-md-4"></div>

            <div class="col-md-4">

                @if (!empty($message))
                    <div class="bg-success alert">
                        {{$message}}
                    </div>
                @endif

                {{ Form::open(['role' => 'form', 'url' => '/auth/login']) }}

                    {!! csrf_field() !!}

                    <div class='form-group'>
                        {{ Form::text('username', null, ['placeholder' => 'Email', 'class' => 'form-control']) }}
                    </div>

                    <div class='form-group'>
                        {{ Form::password('password', ['placeholder' => trans('messages.user.password'), 'class' => 'form-control']) }}
                    </div>

                    <div class='form-group'>
                        @include('partials/errors')
                    </div>

                    {{ Form::submit(trans('messages.signin'), ['class' => 'btn btn-primary btn-small btn-block']) }}

                    @if (env('ENABLE_REGISTER'))
                        <div class='form-group'>
                            or <a href="/register">register</a>
                        </div>
                    @endif

                {{ Form::close() }}

            </div>
        </div>
    </div>

@stop


