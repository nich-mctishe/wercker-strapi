#!/bin/sh

ls -lah ../

npm install

npm link strapi-helper-plugin

npm run setup --plugins

npm start
