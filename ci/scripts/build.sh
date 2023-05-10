#!/usr/bin/env bash

set -e

# shellcheck disable=SC2046
SCRIPT_DIR=$(cd $( dirname "$0") && pwd)
ROOT_DIR=$(dirname $(dirname "$SCRIPT_DIR"))

function build {
  DOCKER_FILE_DIR=$1
  IMAGE_PATH=$2
  VERSION=$3
  echo docker build -t $IMAGE_PATH:$VERSION --build-arg TAG_VERSION="$VERSION" "$DOCKER_FILE_DIR"
}

build "$ROOT_DIR" nalbion/appert-shopping $(git rev-parse --short HEAD)
