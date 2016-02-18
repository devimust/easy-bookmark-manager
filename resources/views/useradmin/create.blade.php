@extends('app')

@section('content')

    <div class='col-lg-4 col-lg-offset-4'>

        <h1>Add User <a href="/admin/users" class="btn btn-default pull-right">Back</a></h1>

        {{ Form::open(['role' => 'form', 'url' => '/admin/user/store']) }}

        @include('useradmin/userform')

        @include('partials/errors')

        <div class='form-group'>
            {{ Form::submit('Create', ['class' => 'btn btn-success']) }}
        </div>

        {{ Form::close() }}

    </div>

@stop


