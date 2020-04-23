require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const { NODE_ENV } = require('./config');
const validateBearerToken = require('./validate-bearer-token');
const movieRouter = require('./movie/movieRouter');
const errorHandler = require('./errorHandler');
const app = express();

const morganOption = NODE_ENV === 'production'
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

// Validation middleware
app.use(validateBearerToken);

// Routes
app.use('/movie', movieRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.use(errorHandler);

// if no route matches, return 404 with HTML page - Express default route

module.exports = app;