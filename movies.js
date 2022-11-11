'use strict';

const mongoose = require('mongoose');

const {Schema} = mongoose;

const movieSchema = new Schema({
  title: {type: String, required: true },
  streaming: {type: String, required: true},
  watched: {type: Boolean}
});

const movieModel = mongoose.model('Movie', movieSchema);

module.exports = movieModel;