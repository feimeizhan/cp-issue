FROM node:14-alpine

WORKDIR /srv/index
COPY . ./
RUN npm install --only=production

ENV APP_DIR /srv/index

ENTRYPOINT [ "npm", "run", "start" ]
