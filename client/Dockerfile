FROM node:18-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm install && npm cache clean --force

COPY . /app

CMD npm start