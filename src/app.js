require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const MOVIES = require('./movie-data-small.json');

const { NODE_ENV } = require('./config');

const app = express();

const morganOption = NODE_ENV === 'production'
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

// Validation middleware
app.use(function validateBearerToken(req, res, next) {
  console.log('test 1');
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  // move to the next middleware
  next();
});

app.get('/movie', function handleMovies(req, res) {
  const { genre, country, avg_vote, } = req.query;

  let response = MOVIES;

  if (genre) {
    response = response.filter(movie => movie.genre.toUpperCase().includes(genre.toUpperCase));
  }

  if (country) {
    response = response.filter(movie => movie.country.toUpperCase.includes(country.toUpperCase));
  }

  if (avg_vote) {
    response = response.filter(movie => Number(movie.avg_vote) >= Number(avg_vote));
  }

  res.json(response);
});

app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.use((error, req, res, next) => { // eslint-disable-line no-unused-vars
  let message; // eslint-disable-line no-unused-vars
  if (NODE_ENV === 'production') {
    message = 'Server error';
  } else {
    console.log(error);
    message = error.message;
  }
  res.status(500).json({ error: error.message });
});

// if no route matches, return 404 with HTML page - Express default route

module.exports = app;