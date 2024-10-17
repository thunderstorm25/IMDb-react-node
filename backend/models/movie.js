// backend/models/movie.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    cast: { type: [String], required: true },
    director: { type: String, required: true },
    genreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true },
    reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
    image: { type: String }, 
    releaseDate: { type: Date, required: true }, 
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
