#!/bin/bash -e

rm -rf public
mkdir public

cp node_modules/bootstrap-icons/bootstrap-icons.svg public/
cp -a assets/ public/
ejs -o public/index.html src/index.ejs

concurrently \
  'chokidar "data/**/*" --initial -c "rm -rf public/data && cp -a data public/data"' \
  'rollup -c -w --no-watch.clearScreen' \
  'sass -c -w --update --source-map src/app.scss public/app.css' \
  'live-server --host=127.0.0.1 --port=4000 --no-browser ./public'
