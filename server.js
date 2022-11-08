'use strict';

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

// const mongoose = require('mongoose');

// mongoose.connect(process.env.DB_KEY);

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//   console.log('Mongoose is connected');
// });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {

  response.status(200).send('Welcome to Our Server!');

});

app.get('/movies', async (request, response, next) => {
    try {

        let title = request.query.title;

        let url = `https://ott-details.p.rapidapi.com/search?title=${title}&rapidapi-key=${process.env.MOVIE_KEY})`

        let getMovie = await axios.get(url);

        console.log('results', getMovie.data);

        let groomedData = getMovie.data.results.map(movie => {return new Film(movie)});
            response.status(200).send(groomedData);
    } catch (error) {
        next(error);
    }

});

class Film{
    constructor(films) {
        this.title = films.title;
        this.synopsis = films.synopsis;
        this.released = films.released;
        this.imageurl = films.imageurl;
    }
}


app.get('*', (request, response) => {
  response.status(404).send('Not availabe');
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));