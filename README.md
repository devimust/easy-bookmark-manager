## Bookmarks - Easy bookmark manager

Easy (and fast) self-hosted bookmark manager.

![alt text](https://github.com/devimust/easy-bookmark-manager/raw/master/resources/assets/images/screenshot1.png "Screenshot 1")

### Demo

You can test easy-bookmark-manager here : [demo](http://bookmarkdemo.miceli.click/)

To access use **admin** as login and **nimda** as password.

You can also download easy-bookmark-manager [chrome plugin](https://chrome.google.com/webstore/detail/easy-bookmark-manager-ext/hhonlfdhoejpaofmmppaogebkfnbgefi)

And use this url : http://bookmarkdemo.miceli.click/ as target

![target](http://img15.hostingpics.net/pics/837402EasyBookmarkManagerOptionsGoogleChrome2.jpg)

### Requirements

* webserver (apache2, nginx)
* php 5.3+
* Laravel 5.2
* mysql (or laravel supported database)


### Installation

Step 1:
```bash
$ git clone git@github.com/devimust/easy-bookmark-manager.git
$ cd easy-bookmark-manager
$ composer install
$ npm install
$ gulp --production
```

Step 2: Update database details inside `.env` file.

Step 3:
```bash
$ php artisan migrate --seed #this will create the default admin user
```

Step 4: Update `.env` file with `APP_ENV=production`. Ensure webserver user (apache, www-data or nginx) can read and write to the `./storage` and `./bootstrap/cache` folders recursively.

Step 5: Navigate to http://insert-your-domain.com/ and login with email `admin` and password `nimda`. Go add some bookmarks or navigate to http://insert-your-domain.com/admin/users to create more users and *important* update the admin user's password.

Step 6: Optional security measure - to disable the `/admin` section set `ADMIN_ENABLED=false` inside .env file.

Example apache virtual host file

```apache
<VirtualHost *:80>
    ServerName <my-bookmarks.domain.com>
    DocumentRoot /var/www/{PROJECT_FOLDER}/public
    <Directory "/var/www/{PROJECT_FOLDER}/public">
        Options Indexes FollowSymLinks
        AllowOverride All
        Options -Indexes
    </Directory>
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```


### Development

I welcome any feedback and contributions.


#### Local native

```bash
# update .env with APP_ENV=local and APP_DEBUG=false
$ composer install
$ npm install
$ gulp
$ vendor/bin/phpunit
$ gulp watch
```

#### Local docker LAMP stack

```bash
# update .env with APP_ENV=local and APP_DEBUG=false
docker-compose build
docker-compose up
docker-compose run --rm composer install
docker-compose run --rm npm install
docker-compose run --rm gulp --production
docker-compose run --rm artisan key:generate
docker-compose run --rm phpunit
docker-compose run --rm artisan migrate:refresh --seed
docker-compose run --rm artisan db:seed --class=DummyBookmarksSeeder
```

#### Local docker LAMP stack using release candidate

Download latest release candidate and decompress into a folder, then

```bash
cp docker-compose.sample.yml docker-compose.yml
cp .env.docker .env
docker-compose build
docker-compose up
docker-compose run --rm artisan key:generate
docker-compose run --rm artisan migrate:refresh --seed
docker-compose run --rm artisan db:seed --class=DummyBookmarksSeeder
```

goto http://localhost:8000/ and login with `admin`:`nimda`


### Chrome Extension

[Easy Bookmark Manager Extension](https://chrome.google.com/webstore/detail/easy-bookmark-manager-ext/hhonlfdhoejpaofmmppaogebkfnbgefi)

[Source](https://github.com/devimust/easy-bookmark-manager-chrome-extension)


### Dev Dependencies and Credits

* jQuery 1.12
* Angular & Angular Route
* [Bootswatch](http://bootswatch.com)
* [Bootstrap 3](http://getbootstrap.com/)
* FontAwesome
* NodeJS
* Composer
* Gulp
* Select2
* Sass
* [Ace](https://ace.c9.io/)
* Normalize.css


### Todos

* Reset password via email


### License

MIT
