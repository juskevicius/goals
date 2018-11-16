const createError = require('http-errors');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const errorHandler = require('errorhandler');
/*const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');*/

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

const app = express();

//Set up mongoose connection.
const mongoose = require('mongoose');
const mongoDB = 'mongodb://127.0.0.1:27017/Goals';
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
mongoose.set('debug', true);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

require('./models/User');
require('./config/passport');
app.use(require('./routes/users'));
app.use(require('./routes/goals'));
/*app.use('/', indexRouter);
app.use('/users', usersRouter);*/

if(!isProduction) {
  app.use(errorHandler());
}

//Error handlers & middlewares
if(!isProduction) {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

module.exports = app;
