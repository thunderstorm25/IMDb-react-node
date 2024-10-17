// backend/models/rating.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    // field for userId in the future if needed
}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;
