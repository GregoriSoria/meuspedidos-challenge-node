FROM node:alpine

WORKDIR /src

COPY './package.json' .
COPY './npm-shrinkwrap.json' .
COPY './main.js' .
COPY './scripts' './scripts'

RUN npm install