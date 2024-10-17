const express = require('express');
const Genre = require('../models/Genre');
const router = express.Router();

// Add a new genre
router.post('/', async (req, res) => {
    const { name } = req.body; // Destructure name from request body
    try {
        const genre = new Genre({ name });
        await genre.save();
        res.status(201).send(genre);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error adding genre' });
    }
});

// GET all genres
router.get('/', async (req, res) => {
    try {
        const genres = await Genre.find(); // Fetch all genres
        res.status(200).json(genres);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching genres' });
    }
});

// Search genres by name
router.get('/search', async (req, res) => {
    const { name } = req.query;
    try {
        const genres = await Genre.find({ name: { $regex: name, $options: 'i' } });
        if (!genres.length) {
            return res.status(404).json({ message: 'No genres found' });
        }
        res.status(200).json(genres);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching genres' });
    }
});

// Update a genre by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body; // Destructure name from request body
    try {
        const updatedGenre = await Genre.findByIdAndUpdate(id, { name }, { new: true });
        if (!updatedGenre) {
            return res.status(404).json({ message: 'Genre not found' });
        }
        res.status(200).json(updatedGenre);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating genre' });
    }
});

module.exports = router;
