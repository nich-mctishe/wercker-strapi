#!/bin/sh

env

ls -lah

npm install --production

npm run postinstall

npm link strapi-helper-plugin

npm run setup --plugins
npm run setup

NODE_ENV=production npm start
