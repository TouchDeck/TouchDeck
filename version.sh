#!/usr/bin/env bash
set -eu

if [ -z "${1+x}" ]
then
  echo 'Specify which version to bump: patch, minor or major.'
  exit 1
fi

echo "Bumping $1 version."
npm version "$1" --prefix agent
npm version "$1" --prefix web
npm version "$1"
