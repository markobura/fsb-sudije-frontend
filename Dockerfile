# develop stage
FROM node:18-alpine as develop-stage
WORKDIR /app
COPY package*.json ./
RUN npm install -g @quasar/cli
COPY /app .

# build stage
FROM develop-stage as build-stage
RUN npm install
RUN quasar build


EXPOSE 3000
CMD ["quasar","dev"]
