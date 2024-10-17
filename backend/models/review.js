// backend/models/review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
