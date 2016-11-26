#!/bin/bash

echo "Create release candidate..."
echo

if [ ! -d .git ]; then
  echo "ensure this script is run from the project root"
  exit 1
fi

docker-compose run --rm gulp --production

find ./storage -type 'f' | grep -v ".gitignore" | xargs rm -f

TIMESTAMP=$(date +%s)

tar \
    --owner=0 --group=0 \
    -czf ./easy-bookmark-manager.$TIMESTAMP.tar.gz \
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
    server.php
