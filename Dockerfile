# develop stage
FROM node:18-alpine as develop-stage
WORKDIR /app
COPY package*.json ./
COPY nginx.conf ./
RUN npm install -g @quasar/cli
COPY /app .

# build stage
FROM develop-stage as build-stage
RUN npm install
RUN quasar build


FROM nginx:1.23.2-alpine as production-stage
RUN ls .
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
EXPOSE 9000
CMD ["nginx", "-g", "daemon off;"]
