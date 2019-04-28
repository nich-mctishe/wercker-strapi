#!/usr/bin/env node
'use strict';

/**
 * Use `server.js` to run your application without `$ strapi start`.
 * To start the server, run: `$ npm start`.
 *
 * This is handy in situations where the Strapi CLI is not relevant or useful.
 */

process.chdir(__dirname);

console.log('DOKKU_MONGO_API_PORT_27017_TCP_ADDR', process.env.DOKKU_MONGO_API_PORT_27017_TCP_ADDR);
console.log('DOKKU_MONGO_API_PORT_27017_TCP_PORT', process.env.DOKKU_MONGO_API_PORT_27017_TCP_PORT);
console.log('DB_USERNAME', process.env.DB_USERNAME);
console.log('DB_PASSWORD', process.env.DB_PASSWORD);

(() => {
  const strapi = require('strapi');
  strapi.start();
})();
