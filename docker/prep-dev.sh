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
    cp ./.env.docker ./.env
    echo "creating .env from .env.docker, remember to modify"
fi

if [ ! -f ./docker-compose.yml ]; then
    cp ./docker-compose.sample.yml ./docker-compose.yml
    echo "creating docker-compose.yml from docker-compose.sample.yml, remember to modify"
fi

#chmod -R a+w ./storage

docker-compose stop
docker-compose rm -f
docker-compose build
docker-compose run --rm composer install
docker-compose run --rm npm install
docker-compose run --rm gulp --production
docker-compose run --rm artisan key:generate
docker-compose run --rm phpunit
docker-compose up -d
sleep 10s
docker-compose run --rm artisan migrate:refresh --seed
docker-compose run --rm artisan db:seed --class=DummyBookmarksSeeder

echo "done"
