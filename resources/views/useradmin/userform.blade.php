<div class='form-group'>
    {{ Form::label('name', trans('messages.user.name')) }}
    {{ Form::text('name', null, ['placeholder' => trans('messages.user.name'), 'class' => 'form-control']) }}
</div>

<div class='form-group'>
    {{ Form::label('username', 'Email') }}
    {{ Form::text('username', null, ['placeholder' => 'Email', 'class' => 'form-control']) }}
</div>

<div class='form-group'>
    {{ Form::label('password', trans('messages.user.password')) }}
    {{ Form::password('password', ['placeholder' => trans('messages.user.password'), 'class' => 'form-control']) }}
</div>

<div class='form-group'>
    {{ Form::label('password_confirmation', trans('messages.user.confirm')) }}
    {{ Form::password('password_confirmation', ['placeholder' => trans('messages.user.confirm'), 'class' => 'form-control']) }}
</div>

<div class='form-group'>
    {{ Form::label('administrator', trans('messages.user.isAdmin')) }}
    {{ Form::checkbox('administrator', 1, null, ['class' => 'form-inline']) }}
</div>

<div class='form-group'>
    {{ Form::label('can_share', trans('messages.user.canShare')) }}
    {{ Form::checkbox('can_share', 1, null, ['class' => 'form-inline']) }}
</div>
