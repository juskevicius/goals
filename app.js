require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

// Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

const app = express();

// Set up mongoose connection.
const mongoose = require('mongoose');

const mongoDB = process.env.DB_ADDRESS;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
mongoose.set('debug', true);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(helmet());
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, './frontend/build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});

require('./models/User');
require('./config/passport');
app.use(require('./routes/users'));
app.use(require('./routes/goals'));

// Error handlers & middlewares
if (!isProduction) {
  app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

app.use((err, req, res) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

module.exports = app;
