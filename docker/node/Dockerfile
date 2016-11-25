FROM node:4.6

MAINTAINER Rudi Olckers <rudi.olckers@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update

RUN apt-get -y install libnotify-bin #inotify-tools

RUN rm -r /var/lib/apt/lists/*

RUN /usr/local/bin/npm install -g gulp

WORKDIR /app

CMD [ "node" ]
