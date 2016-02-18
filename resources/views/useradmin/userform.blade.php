<div class='form-group'>
    {{ Form::label('name', 'Name') }}
    {{ Form::text('name', null, ['placeholder' => 'Name', 'class' => 'form-control']) }}
</div>

<div class='form-group'>
    {{ Form::label('username', 'Email') }}
    {{ Form::text('username', null, ['placeholder' => 'Email', 'class' => 'form-control']) }}
</div>

<div class='form-group'>
    {{ Form::label('password', 'Password') }}
    {{ Form::password('password', ['placeholder' => 'Password', 'class' => 'form-control']) }}
</div>

<div class='form-group'>
    {{ Form::label('password_confirmation', 'Confirm Password') }}
    {{ Form::password('password_confirmation', ['placeholder' => 'Confirm Password', 'class' => 'form-control']) }}
</div>

<div class='form-group'>
    {{ Form::label('administrator', 'Administrator') }}
    {{ Form::checkbox('administrator', 1, null, ['class' => 'form-inline']) }}
</div>
