@if ($errors->has())
    <div class='bg-danger alert'>
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }} </li>
            @endforeach
        </ul>
    </div>
@endif
