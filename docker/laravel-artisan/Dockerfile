FROM php:5.6-cli

MAINTAINER Rudi Olckers <d3vimust@gmail.com>

RUN apt-get update && apt-get install -y libpq-dev libmcrypt-dev && rm -r /var/lib/apt/lists/*

RUN docker-php-ext-install mcrypt mbstring pdo_mysql pdo_pgsql

#docker run -it --rm xxx php -v
#docker-compose run --rm artisan list
