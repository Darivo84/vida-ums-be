const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const router = require('./router/user.route');

const app = express();

app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use('/', router);

module.exports = app;