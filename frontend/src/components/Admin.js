import React, { useEffect, useState } from "react";
import axios from "axios";
import { Sections } from './constants';
import MovieSearch from "./MovieSearch";
import TvShowSearch from "./TvShowSearch";
import GenreSearch from "./GenreSearch";
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const navigate = useNavigate();
    const [section, setSection] = useState(Sections.MOVIES);
    const [search, setSearch] = useState(false);
    const [movies, setMovies] = useState([]);
    const [tvShows, setTvShows] = useState([]);
    const [genres, setGenres] = useState([]);

    const [newMovie, setNewMovie] = useState({
        name: '',
        description: '',
        cast: '',
        director: '',
        genreId: '',
        image: '',
        releaseDate: '',
    });

    const [newTvShow, setNewTvShow] = useState({
        name: '',
        description: '',
        cast: '',
        director: '',
        genreId: '',
        image: '',
        releaseDate: '',
    });
    const [newGenre, setNewGenre] = useState({ name: '' });

    // Fetch genres for the dropdown
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/genres');
                setGenres(response.data);
            } catch (error) {
                console.error('Error fetching genres:', error.response?.data || error.message);
                window.alert('Error fetching genres: ' + (error.response?.data?.message || 'Unknown error'));
            }
        };

        fetchGenres();
    }, []);

    const handleAddMovie = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/movies', newMovie);
            window.alert('Movie added successfully!');
            setNewMovie({
                name: '',
                description: '',
                cast: '',
                director: '',
                genreId: '',
                image: '',
                releaseDate: '',
            });
            fetchMovies();
        } catch (error) {
            console.error('Error adding movie:', error);
            window.alert('Error adding movie. Please try again.');
        }
    };

    const handleAddTvShow = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/tvshows', newTvShow);
            window.alert('TV Show added successfully!');
            setNewTvShow({
                name: '',
                description: '',
                cast: '',
                director: '',
                genreId: '',
                image: '',
                releaseDate: '',
            });
            fetchTvShows();
        } catch (error) {
            console.error('Error adding TV show:', error);
            window.alert('Error adding TV show. Please try again.');
        }
    };

    const handleAddGenre = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/genres', newGenre);
            window.alert('Genre added successfully!');
            setNewGenre({ name: '' });
            fetchGenres();
        } catch (error) {
            console.error('Error adding genre:', error);
            window.alert('Error adding genre. Please try again.');
        }
    };

    const fetchMovies = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/movies');
            setMovies(response.data);
        } catch (error) {
            console.error('Error fetching movies:', error);
            window.alert('Error fetching movies. Please try again.');
        }
    };

    const fetchTvShows = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tvshows');
            setTvShows(response.data);
        } catch (error) {
            console.error('Error fetching TV shows:', error);
            window.alert('Error fetching TV shows. Please try again.');
        }
    };

    const fetchGenres = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/genres');
            setGenres(response.data);
        } catch (error) {
            console.error('Error fetching genres:', error);
            window.alert('Error fetching genres. Please try again.');
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <button
                onClick={() => navigate('/')}
                className="absolute top-2 left-2 bg-gray-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600 transition-colors"
            >
                Back to Home
            </button>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Admin Panel</h2>
            <div className="flex justify-center space-x-6 mb-8">
                <button
                    onClick={() => setSection(Sections.MOVIES)}
                    className={`transition transform hover:-translate-y-1 bg-blue-600 text-white py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 
                    ${section === Sections.MOVIES ? 'ring ring-blue-400' : ''}`}
                >
                    Movies
                </button>
                <button
                    onClick={() => setSection(Sections.TVSHOWS)}
                    className={`transition transform hover:-translate-y-1 bg-blue-600 text-white py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 
                    ${section === Sections.TVSHOWS ? 'ring ring-blue-400' : ''}`}
                >
                    TV Shows
                </button>
                <button
                    onClick={() => setSection(Sections.GENRES)}
                    className={`transition transform hover:-translate-y-1 bg-blue-600 text-white py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 
                    ${section === Sections.GENRES ? 'ring ring-blue-400' : ''}`}
                >
                    Genres
                </button>
            </div>

            <div className="flex justify-center mb-6">
                <button
                    className="py-2 px-8 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-all"
                    onClick={() => setSearch(!search)}
                >
                    {search ? "BACK" : "SEARCH"}
                </button>
            </div>

            <div className="flex justify-center">
                {section === Sections.MOVIES && (
                    <>
                        {!search ? (
                            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-2xl font-bold mb-4 text-center">Add Movie</h3>
                                <form onSubmit={handleAddMovie}>
                                    <input
                                        type="text"
                                        placeholder="Movie Name"
                                        value={newMovie.name}
                                        onChange={(e) => setNewMovie({ ...newMovie, name: e.target.value })}
                                        required
                                        className="border p-3 mb-4 w-full rounded-lg focus:ring-2 focus:ring-blue-300"
                                    />
                                    <textarea
                                        placeholder="Description"
                                        value={newMovie.description}
                                        onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                                        required
                                        className="border p-3 mb-4 w-full rounded-lg focus:ring-2 focus:ring-blue-300"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cast (comma separated)"
                                        value={newMovie.cast} // This should be a string
                                        onChange={(e) => setNewMovie({ ...newMovie, cast: e.target.value })} // Store as string
                                        required
                                        className="border p-3 mb-4 w-full rounded-lg focus:ring-2 focus:ring-blue-300"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Director"
                                        value={newMovie.director}
                                        onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                                        required
                                        className="border p-3 mb-4 w-full rounded-lg focus:ring-2 focus:ring-blue-300"
                                    />
                                    <select
                                        value={newMovie.genreId}
                                        onChange={(e) => setNewMovie({ ...newMovie, genreId: e.target.value })}
                                        required
                                        className="border p-3 mb-4 w-full rounded-lg focus:ring-2 focus:ring-blue-300"
                                    >
                                        <option value="">Select Genre</option>
                                        {genres.map((genre) => (
                                            <option key={genre._id} value={genre._id}>
                                                {genre.name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Image URL"
                                        value={newMovie.image}
                                        onChange={(e) => setNewMovie({ ...newMovie, image: e.target.value })}
                                        required
                                        className="border p-3 mb-4 w-full rounded-lg focus:ring-2 focus:ring-blue-300"
                                    />
                                    <input
                                        type="date"
                                        placeholder="Release Date"
                                        value={newMovie.releaseDate}
                                        onChange={(e) => setNewMovie({ ...newMovie, releaseDate: e.target.value })}
                                        required
                                        className="border p-3 mb-4 w-full rounded-lg focus:ring-2 focus:ring-blue-300"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
                                    >
                                        Add Movie
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <MovieSearch setMovies={setMovies} />
                        )}
                    </>
                )}

                {section === Sections.TVSHOWS && (
                    <>
                        {!search ? (
                            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-2xl font-bold mb-4 text-center">Add TV Show</h3>
                                <form onSubmit={handleAddTvShow}>
                                    {/* Similar fields and structure for TV Shows */}
                                </form>
                            </div>
                        ) : (
                            <TvShowSearch setTvShows={setTvShows} />
                        )}
                    </>
                )}

                {section === Sections.GENRES && (
                    <>
                        {!search ? (
                            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-2xl font-bold mb-4 text-center">Add Genre</h3>
                                <form onSubmit={handleAddGenre}>
                                    <input
                                        type="text"
                                        placeholder="Genre Name"
                                        value={newGenre.name}
                                        onChange={(e) => setNewGenre({ name: e.target.value })}
                                        required
                                        className="border p-3 mb-4 w-full rounded-lg focus:ring-2 focus:ring-blue-300"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
                                    >
                                        Add Genre
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <GenreSearch setGenres={setGenres} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Admin;
