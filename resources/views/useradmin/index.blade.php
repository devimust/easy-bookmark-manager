@extends('app')

@section('content')

    <div class="col-lg-10 col-lg-offset-1">
        <h1>User Administration <a href="/auth/logout" class="btn btn-default pull-right">Logout</a></h1>

        <div class="table-responsive">
            <table class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email / Login</th>
                        <th>Created</th>
                        <th>Admin</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                @foreach ($users as $user)
                    <tr>
                        <td>{{ $user->name }}</td>
                        <td>{{ $user->username }}</td>
                        <td>{{ $user->created_at->format('F d, Y h:ia') }}</td>
                        <td>{{ $user->administrator ? 'yes' : '' }}</td>
                        <td width="110">
                            <a href="/admin/user/{{ $user->id }}/edit" class="btn btn-info btn-xs pull-left" style="margin-right: 3px;">Edit</a>
                            {{ Form::open(['url' => '/admin/user/' . $user->id, 'method' => 'DELETE']) }}
                            {{ Form::submit('Delete', ['class' => 'btn btn-danger btn-xs'])}}
                            {{ Form::close() }}
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>

        <a href="/admin/user/create" class="btn btn-success">Add User</a>
    </div>

@stop


