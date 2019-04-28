#!/bin/sh

env

npm install

npm run postinstall

# npm link strapi-helper-plugin

# npm run setup --plugins

strapi start
