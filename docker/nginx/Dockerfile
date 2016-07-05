FROM nginx:latest

MAINTAINER Rudi Olckers <d3vimust@gmail.com>

ADD nginx.conf /etc/nginx/
ADD laravel.conf /etc/nginx/sites-available/

RUN rm /etc/nginx/conf.d/default.conf
RUN echo "upstream php-upstream { server php-fpm:9000; }" > /etc/nginx/conf.d/upstream.conf

RUN usermod -u 1000 www-data

CMD ["nginx"]

EXPOSE 80 443
