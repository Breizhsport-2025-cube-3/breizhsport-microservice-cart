# syntax=docker/dockerfile:1

FROM node:22.11.0-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 4003
CMD ["node", "app.js"]
