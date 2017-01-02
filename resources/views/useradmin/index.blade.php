@extends('app')

@section('content')

    <div class="col-lg-10 col-lg-offset-1">
        <h1>
            {{ trans('messages.user.admin') }}

            <div  class="btn-group pull-right" role="group" aria-label="Basic example">
                <a href="/" class="btn btn-default ">
                    {{ trans("messages.back") }}
                </a>

                &nbsp;

                <a href="/auth/logout" class="btn btn-default pull-right">
                    {{ trans('messages.logout') }}
                </a>
            </div>
        </h1>

        <div class="table-responsive">
            <table class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>
                            {{ trans('messages.user.name') }}
                        </th>
                        <th>
                            {{ trans('messages.user.mail') }}
                        </th>
                        <th>
                            {{ trans('messages.user.created') }}
                        </th>
                        <th>
                            {{ trans('messages.user.adminRole') }}
                        </th>
                        <th>
                            {{ trans('messages.user.canShare') }}
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                @foreach ($users as $user)
                    <tr>
                        <td>{{ $user->name }}</td>
                        <td>{{ $user->username }}</td>
                        <td>{{ $user->created_at->format('F d, Y h:ia') }}</td>
                        <td>{{ $user->administrator ? trans('messages.yes') : '' }}</td>
                        <td>{{ $user->getCanShareText() }}</td>
                        <td width="110">
                            <a href="/admin/user/{{ $user->id }}/edit" class="btn btn-info btn-xs pull-left" style="margin-right: 3px;">
                                {{ trans('messages.edit') }}
                            </a>
                            {{ Form::open(['url' => '/admin/user/' . $user->id, 'method' => 'DELETE']) }}
                            {{ Form::submit(trans('messages.delete'), ['class' => 'btn btn-danger btn-xs'])}}
                            {{ Form::close() }}
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>

        <a href="/admin/user/create" class="btn btn-success">
            {{ trans('messages.user.add') }}
        </a>
    </div>

@stop


