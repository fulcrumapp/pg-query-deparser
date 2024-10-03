#!/usr/bin/env bash

export VERSION="$1"

yarn build
gh release create --generate-notes $VERSION
yarn publish --new-version $VERSION