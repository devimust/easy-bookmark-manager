FROM node:4.6

MAINTAINER Rudi Olckers <rudi.olckers@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update

RUN apt-get -y install libnotify-bin

RUN rm -r /var/lib/apt/lists/*

RUN /usr/local/bin/npm install -g gulp

#RUN groupadd --gid 1000 web && useradd --uid 1000 --gid 1000 -G web,sudo,www-data web
#RUN echo 'web ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER node

WORKDIR /app

CMD [ "node" ]
