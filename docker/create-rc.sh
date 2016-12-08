#!/bin/bash

echo "Create release candidate..."
echo

if [ ! -d .git ]; then
  echo "ensure this script is run from the project root"
  exit 1
fi

if [ -z "$1" ]; then
  echo "no version specified, please run with e.g. 'docker/create-rc.sh v1.0'"
  exit 1
fi

if [ -f "$1.tar.gz" ]; then
  echo "the file $1.tar.gz exist, please remove and try again"
  exit 1
fi

docker-compose run --rm gulp --production

docker-compose run --rm phpunit

find ./storage -type 'f' | grep -v ".gitignore" | xargs rm -f

TIMESTAMP=$(date)

echo "$1 created at $TIMESTAMP" >> ./VERSION

tar \
    --owner=0 --group=0 \
    -czf ./$1.tar.gz \
    app/ \
    bootstrap/ \
    config/ \
    database/ \
    docker/ \
    public/ \
    resources/ \
    storage/ \
    vendor/ \
    .env.docker \
    .env.example \
    .htaccess \
    artisan \
    docker-compose.sample.yml \
    server.php \
    VERSION
