#!/bin/bash

echo "Prep local docker dev environment..."
echo

if ! [ -x "$(command -v docker)" ]; then
  echo "docker is not installed"
  exit 1
fi

if ! [ -x "$(command -v docker-compose)" ]; then
  echo "docker-compose is not installed"
  exit 1
fi

if [ ! -f ./.env ]; then
    echo ".env file does not exist, copy and modify from .env.docker"
    exit 1
fi

if [ ! -f ./docker-compose.yml ]; then
    echo "docker-compose.yml file does not exist, copy and modify from docker-compose.sample.yml"
    exit 1
fi

exit 0

chmod -R a+w ./storage

docker-compose stop
docker-compose rm -f
docker-compose build
docker-compose run --rm composer install
docker-compose run --rm npm install
docker-compose run --rm gulp --production
docker-compose run --rm artisan key:generate
docker-compose up -d
sleep 10s
docker-compose run --rm artisan migrate:refresh --seed
docker-compose run --rm artisan db:seed --class=DummyBookmarksSeeder

echo "done"
