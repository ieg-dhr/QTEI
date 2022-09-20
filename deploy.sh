#!/bin/bash -e

npm run build
rsync -av ./public/ app@prime.wendig.io:/var/storage/host/static/current/qtei/
