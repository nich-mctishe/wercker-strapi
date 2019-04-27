FROM node:10.15.0

COPY src /src
COPY dokku/CHECKS /src/CHECKS
COPY dokku/entrypoint.sh /

RUN npm install -g strapi@alpha

EXPOSE 80

WORKDIR /src

ENV NODE_ENV production

# CMD [ "npm", "start" ]

ENTRYPOINT ["./entrypoint.sh"]
