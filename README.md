# Twitter Clone [![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)
Simple Twitter clone made with Koa and Vue.js

## Dependencies
Node and npm are required in order to build the app while Docker and docker-compose are required to run the app. Make sure you have what you need installed.

## Building

### Backend
```
$ cd backend && npm i
```

### Frontend
```
$ cd frontend && npm i && npm run build
```

## Running
After you've built the app, you can run it by starting `docker-compose`:
```
$ docker-compose up
```
The app is now running in development mode and is accessible here: [localhost:8080]().
