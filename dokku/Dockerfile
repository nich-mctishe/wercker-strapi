FROM node:6.9.5

COPY src /src
COPY dokku/CHECKS /src/CHECKS

EXPOSE 80

WORKDIR /src

ENV NODE_ENV production

CMD [ "npm", "start" ]
