'use strict';

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const movies = require('./movies.js');

mongoose.connect(process.env.DB_KEY);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
});

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {

  response.status(200).send('Welcome to Our Server!');

});

app.get('/movies', async (request, response, next) => {
    try {
        let name = request.query.name;
        
        const options = {
          method: 'GET',
          url: 'https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup',
          params: {term: name, country: 'us'},
          headers: {
            'X-RapidAPI-Key': '23368796ccmsh5a62dd973d348d1p17f8c8jsn2a26a85c4ce3',
            'X-RapidAPI-Host': 'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com'
          }
      };
 
        let getMovie = await axios(options);

        console.log('results', getMovie.data);
        
        let groomedData = getMovie.data.results.map(movie => {return new Film(movie)});
            response.status(200).send(groomedData);
        console.log(groomedData); 
    } catch (error) {
        next(error);
    }

});

class Film{
    constructor(films) {
        this.name = films.name;
        this.locations = films.locations;
        this.picture = films.picture;
    }
}

app.get('/movieList', getMovies);

async function getMovies(request, response, next){
  try{
    let res = await movies.find();
    console.log(res);
    response.status(200).send(res);
  }catch(error) {
    next(error);
  }
}

app.post('/movieList', addMovie);

async function addMovie(request, response, next) {
  try{ 
    console.log('test', request.body);
    let newMovie = await movies.create(request.body);
    console.log(newMovie);
    response.status(200).send(newMovie);
  } catch(error) {
    next(error);
  }
}

app.delete('/movieList/:movieID', deleteMovie);

async function deleteMovie(request, response, next) {
  try {
    let id = request.params.movieID;
    console.log(request);
    await movies.findByIdAndDelete(id);
    response.status(200).send('Movie was removed');
  }catch(error) {
    next(error);
  }
}

app.put('/movieList/:movieID', updateMovie);

async function updateMovie(request, response, next) {
  try{
    let id = request.params.movieID;
    let data = request.body;
    console.log('test', data);
    console.log('yes', request);
    const updateMovie = await movies.findByIdAndUpdate(id, data, {new: true, overwrite: true});
    response.status(201).send(updateMovie);

  }catch(error){
    next(error);
  }
}

// axios.request(options).then(function (response) {
// 	console.log(response.data);
// }).catch(function (error) {
// 	console.error(error);
// });


app.get('*', (request, response) => {
  response.status(404).send('Not availabe');
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));