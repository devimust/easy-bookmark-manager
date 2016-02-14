@extends('app')

@section('content')

    <div class="container-fluid">

        @include('partials/hero')

        <div ng-view>
            <i class="fa fa-spinner fa-pulse fa-2x"></i>
        </div>
    </div>

@stop
