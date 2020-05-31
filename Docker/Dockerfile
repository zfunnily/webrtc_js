FROM node:latest
COPY ./package.json /usr/local/src/app/https
WORKDIR /usr/local/src/app
RUN npm install express  serve-index -g\
   && mkdir -p /usr/local/src/app/
WORKDIR /usr/local/src/app/https
CMD node server.js