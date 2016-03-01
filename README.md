## Bookmarks - Easy bookmark manager

Easy (and fast) self-hosted bookmark manager.

![alt text](https://github.com/devimust/easy-bookmark-manager/raw/master/resources/assets/images/screenshot1.png "Screenshot 1")


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
```

Step 2: Update database details inside `.env` file.

Step 3:
```bash
$ php artisan migrate --seed #this will create the default admin user
```

Step 4: Update `.env` file with `APP_ENV=production`. Ensure webserver user (apache, www-data or nginx) can read and write to the `./storage` folder recursively.


Step 5: Navigate to http://insert-your-domain.com/ and login with email `admin` and password `nimda`. Go add some bookmarks or navigate to http://insert-your-domain.com/admin/users to create more users and *important* update the admin user's password.

Step 6: Optional security measure - to disable the `/admin` section set `ADMIN_ENABLED=false` inside .env file.

Example apache virtual host file
```apache
<VirtualHost *:80>
	ServerName <my-bookmarks.domain.com>
	DocumentRoot /var/www/<project folder>/public
	<Directory "/var/www/<project folder>/public">
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

```bash
# update .env with APP_ENV=local and APP_DEBUG=false
$ composer install
$ npm install
$ gulp && gulp watch
```


### Chrome Extension

[Easy Bookmark Manager Extension](https://chrome.google.com/webstore/detail/easy-bookmark-manager-ext/hhonlfdhoejpaofmmppaogebkfnbgefi)


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

- Write tests
- Reset password via email
- Add localstorage token session control to work more nicely with Chrome extension
- Add export functionality

### License

MIT
