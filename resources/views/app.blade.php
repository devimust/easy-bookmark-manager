<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Easy Bookmark Manager</title>

    <script>
        /**
         * @see http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml
         */
        function loadResourceFile(filename, filetype){
            if (filetype=="js") { //if filename is a external JavaScript file
                var fileref=document.createElement('script')
                fileref.setAttribute("type","text/javascript")
                fileref.setAttribute("class", "custom-js")
                fileref.setAttribute("src", filename)
            } else if (filetype=="css") { //if filename is an external CSS file
                var fileref=document.createElement("link")
                fileref.setAttribute("rel", "stylesheet")
                fileref.setAttribute("type", "text/css")
                fileref.setAttribute("class", "custom-css")
                fileref.setAttribute("href", filename)
            }
            if (typeof fileref!="undefined") {
                document.getElementsByTagName("head")[0].appendChild(fileref)
            }
        }
        function loadTheme() {
            var theme = localStorage.getItem('theme') || 'bootstrap-yeti';
            loadResourceFile('/css/'+theme+'.css', 'css');
        }
        loadTheme();
    </script>

    <link href="/css/vendor.css" rel="stylesheet">
    <link href="{{ elixir('css/main.css') }}" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>

<body ng-app="bookmarksApp">

    @yield('content')

    <script src="/js/vendor.js"></script>

    <script src="{{ elixir('js/main.js') }}"></script>
</body>

</html>
