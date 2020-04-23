const express = require('express');
const movieRouter = express.Router();

const MOVIES = require('../movie-data-small.json');

movieRouter
  .route('/')
  .get((req, res) => {
    const { genre, country, avg_vote, } = req.query;

    let response = MOVIES;

    if (genre) {
      response = response.filter(movie => movie.genre.toUpperCase().includes(genre.toUpperCase()));
    }

    if (country) {
      response = response.filter(movie => movie.country.toUpperCase().includes(country.toUpperCase()));
    }

    if (avg_vote) {
      response = response.filter(movie => Number(movie.avg_vote) >= Number(avg_vote));
    }

    res.json(response);
  });

module.exports = movieRouter;