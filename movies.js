'use strict';

const mongoose = require('mongoose');

const {Schema} = mongoose;

const movieSchema = new Schema({
  title: {type: String, required: true },
  status: {type: Boolean, required: true}
});

const movieModel = mongoose.model('Movie', movieSchema);

module.exports = movieModel;