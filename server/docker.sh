#!/bin/bash

set -e

docker-compose down -v
docker-compose up --build -d


#docker-compose up --build -d app

# docker-compose down   # When you want to stop everything
