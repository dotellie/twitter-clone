# Twitter Clone [![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)
Simple Twitter clone made with Koa and Vue.js

![](https://i.imgur.com/jp5Sb7W.png)

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

## Design
The app is split into two parts, the backend and the frontend. The backend is built with Koa and the frontend is built with Vue.js.

### Backend
The backend consists mainly of three important parts, the `auth` module, the `db` module and the routes. All of these are put together in the `index.js` file which is the main entrypoint.

The `auth` module is essentially a wrapper around `passport` with a few other minor utilities.

The `db` module exposes a database object created through `pg-promise` and a few other common database queries.

The routes are found in the `routes` folder and take care of most of the routing for the different parts of the application. They also take care of a lot of the database querying. The reason behind this is that, for example, the MVC pattern doesn't work that well for SPA's and the view and the model usually end up being too tightly coupled anyway.

### Frontend
The frontend is runs on top of `webpack` and uses Vue.js together with Element UI. The main entry point is `app.js`. `app.js` takes care of setting up the routes and starts the main Vue instance.

`api.js` is mostly a simple wrapper aroud fetch (XHR) calls with some utilities for keeping track of the signed in user.

`shell.vue` is the shell around the pages, used mainly for navigation and styling.

The `pages` directory contains all the pages of the app and the `components` directory contain reusable components.

`page-template.html` is the HTML file that will be sent to clients to initialize the JavaScript application.

### Docker
`docker-compose` is used mostly for development, but could also potentially be used in production by removing the override file. Otherwise, the three services needed are one for the proxy (which also serves static files such as the HTML and JavaScript files), one for the API and finally one for the database. The proxy is Nginx, the API is Node.js and the database is PostgreSQL.

### Potential improvement
The most important improvment that could be made to this app is lazy loading the routes for the frontend. Other things that could be improved include the documentation, the tight coupling of the database and the routes and the data handling in the frontend where something like `vuex` probably would have made more sense for this project.
