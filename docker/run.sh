#!/bin/bash

command -v docker-compose >/dev/null 2>&1 || {
  echo >&2 "Please install docker-compose (https://docs.docker.com/compose/install/) and try again."
  exit 1
}

echo "Setting up docker environment"

docker-compose stop
docker-compose rm --all --force

docker-compose build

sudo rm -Rf docker/data/mysql/* docker/logs/nginx/*

cp ./.env.docker ./.env

docker-compose up -d
docker-compose ps

sleep 10 #wait for mysql to initialise
docker-compose run --rm artisan key:generate
docker-compose run --rm artisan migrate:refresh --seed
docker-compose run --rm artisan db:seed --class=DummyBookmarksSeeder

sed -i s/APP_ENV=local/APP_ENV=production/g ./.env
