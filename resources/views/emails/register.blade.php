<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Easy Bookmark Manager</title>
        <link href="/css/vendor.css" rel="stylesheet">
    </head>
    <body>
        @include('partials.hero')

        <br>
        {{ trans('messages.account.welcome') }}
        <br>
        {{ trans('messages.account.confirm') }}

        <a href="{{ route('validation', array('hashValidation' => $user->hashValidation)) }}" class="btn btn-info">
            {{ trans('messages.account.confirmLink') }}
        </a>
    </body>
</html>
