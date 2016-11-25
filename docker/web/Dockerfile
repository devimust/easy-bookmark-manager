FROM debian:jessie
MAINTAINER Rudi Olckers <rudi.olckers@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update

RUN apt-get -y install \
    curl wget apache2 libapache2-mod-php5 \
    php5 php5-common php5-cli php5-curl \
    php5-mysql php-apc php5-mcrypt

RUN rm -r /var/lib/apt/lists/*

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin/ --filename=composer

ADD apache_default.conf /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite headers expires

RUN ln -sf /dev/stdout /var/log/apache2/access.log
RUN ln -sf /dev/stderr /var/log/apache2/error.log

COPY ./sample /app
RUN mkdir -p /app && rm -fr /var/www/html && ln -s /app /var/www/html

COPY ./php.ini /etc/php5/apache2/php.ini

#Environment variables to configure php
ENV PHP_UPLOAD_MAX_FILESIZE 10M
ENV PHP_POST_MAX_SIZE 10M

# RUN echo 'alias artisan="php artisan"' >> ~/.bashrc

EXPOSE  80

WORKDIR /app

CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
