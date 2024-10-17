// backend/routes/reviewRoutes.js
const express = require('express');
const Review = require('../models/review');
const router = express.Router();

// Add a new review
router.post('/', async (req, res) => {
    const review = new Review(req.body);
    try {
        await review.save();
        res.status(201).send(review);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all reviews for a specific movie
router.get('/:movieId', async (req, res) => {
    const reviews = await Review.find({ movieId: req.params.movieId });
    res.send(reviews);
});

module.exports = router;
