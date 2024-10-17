// backend/models/movie.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    cast: { type: [String], required: true },
    director: { type: String, required: true },
    genreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true },
    reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
    image: { type: String }, // URL or path to the movie poster/image
    releaseDate: { type: Date, required: true }, // Movie release date
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
