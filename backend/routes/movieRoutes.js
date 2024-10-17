const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Genre = require('../models/Genre');

// GET all movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find().populate('genreId'); // Ensure genre details are populated
        res.status(200).json(movies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching movies' });
    }
});

// Search for movies by name
router.get('/search', async (req, res) => {
    const { name } = req.query;
    try {
        const movies = await Movie.find({ name: new RegExp(name, 'i') }).populate('genreId');
        if (movies.length === 0) {
            return res.status(404).json({ message: 'No movies found' });
        }
        res.status(200).json(movies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error searching movies' });
    }
});

// GET a single movie by ID
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id).populate('genreId');
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(movie);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching movie' });
    }
});

// POST a new movie
router.post('/', async (req, res) => {
    const { name, description, cast, director, genreId, image, releaseDate } = req.body;

    // Check for required fields
    if (!name || !description || !cast || !director || !genreId || !image || !releaseDate) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const genre = await Genre.findById(genreId);
        if (!genre) {
            return res.status(400).json({ message: 'Invalid genre' });
        }

        // Check if cast is a string before splitting
        const castArray = Array.isArray(cast) ? cast : typeof cast === 'string' ? cast.split(',') : [];

        const newMovie = new Movie({
            name,
            description,
            cast: castArray, // Now cast is always an array
            director,
            genreId,
            image,
            releaseDate,
        });

        const savedMovie = await newMovie.save();
        res.status(201).json(savedMovie);
    } catch (err) {
        console.error('Error while adding movie:', err); // Log the error details
        res.status(500).json({ message: 'Error adding movie' });
    }
});


// PUT (update) a movie by ID
router.put('/:id', async (req, res) => {
    const { name, description, cast, director, genreId, image, releaseDate } = req.body;
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        if (genreId) {
            const genre = await Genre.findById(genreId);
            if (!genre) {
                return res.status(400).json({ message: 'Invalid genre' });
            }
        }

        movie.name = name || movie.name;
        movie.description = description || movie.description;
        movie.cast = cast ? cast.split(',') : movie.cast;
        movie.director = director || movie.director;
        movie.genreId = genreId || movie.genreId;
        movie.image = image || movie.image;
        movie.releaseDate = releaseDate || movie.releaseDate;

        const updatedMovie = await movie.save();
        res.status(200).json(updatedMovie);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating movie' });
    }
});

// DELETE a movie by ID
router.delete('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        await movie.remove();
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting movie' });
    }
});

module.exports = router;
