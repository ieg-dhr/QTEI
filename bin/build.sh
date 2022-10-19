#!/bin/bash -e

rm -rf dist
mkdir dist

cp node_modules/bootstrap-icons/bootstrap-icons.svg dist/
cp -a assets/ public/
cp -a data public/data
rollup -c --environment NODE_ENV:production
sass -c --style=compressed --no-source-map src/app.scss dist/app.min.css
