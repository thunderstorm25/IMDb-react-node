import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const User = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [filter, setFilter] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [genres, setGenres] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/movies');
                setMovies(response.data);
            } catch (err) {
                setError('Failed to fetch movies. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        const fetchGenres = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/genres');
                setGenres(response.data);
            } catch (err) {
                console.error('Failed to fetch genres', err);
            }
        };

        fetchMovies();
        fetchGenres();
    }, []);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleGenreChange = (e) => {
        setSelectedGenre(e.target.value);
    };

    const handleSearch = () => {
        const filtered = movies.filter((movie) => {
            const matchesName = movie.name.toLowerCase().includes(filter.toLowerCase());
            const matchesGenre = selectedGenre ? movie.genreId._id === selectedGenre : true;
            return matchesName && matchesGenre;
        });

        setFilteredMovies(filtered);
    };

    useEffect(() => {
        handleSearch();
    }, [filter, selectedGenre, movies]);

    const getGenreName = (genreId) => {
        const genre = genres.find((g) => g._id === genreId || g._id === genreId._id);
        return genre ? genre.name : 'Unknown Genre';
    };

    return (
        <div className="user-panel p-6 bg-gradient-to-r from-blue-50 via-gray-100 to-blue-50 min-h-screen">
            <button
                onClick={() => navigate('/')}
                className="absolute top-4 left-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-md shadow-lg hover:from-gray-600 hover:to-gray-700 transition-transform transform hover:-translate-y-1"
            >
                Back to Home
            </button>

            <h2 className="text-5xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                Movie Search Panel
            </h2>

            <div className="flex flex-col md:flex-row mb-10 space-y-6 md:space-y-0 md:space-x-6 items-center justify-center">
                <input
                    type="text"
                    placeholder="Search by movie name..."
                    value={filter}
                    onChange={handleFilterChange}
                    className="border-2 border-gray-300 p-4 rounded-lg w-full md:w-1/3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-shadow shadow-lg"
                />

                <select
                    value={selectedGenre}
                    onChange={handleGenreChange}
                    className="border-2 border-gray-300 p-4 rounded-lg w-full md:w-1/3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-shadow shadow-lg"
                >
                    <option value="">Select Genre</option>
                    {genres.map((genre) => (
                        <option key={genre._id} value={genre._id}>
                            {genre.name}
                        </option>
                    ))}
                </select>
            </div>

            {loading && <p className="text-lg text-center text-gray-600">Loading movies...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            <h3 className="text-3xl font-bold mb-8 text-center text-gray-800">
                Filtered Movies
            </h3>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
                {filteredMovies.length > 0 ? (
                    filteredMovies.map((movie) => (
                        <li
                            key={movie._id}
                            className="bg-white border rounded-lg shadow-xl hover:shadow-2xl transition-shadow p-6 flex flex-col space-y-4 transform hover:scale-105 hover:-translate-y-1 transition-transform"
                        >
                            <Link
                                to={`/movies/${movie._id}`}
                                className="text-blue-700 hover:text-blue-900 transition-colors"
                            >
                                <h4 className="text-2xl font-extrabold mb-4 text-gray-900">
                                    {movie.name}
                                </h4>
                                <div className="text-gray-700 space-y-2">
                                    <p>{movie.description}</p>
                                    <p>
                                        <strong>Cast:</strong> {movie.cast.join(', ')}
                                    </p>
                                    <p>
                                        <strong>Director:</strong> {movie.director}
                                    </p>
                                    <p>
                                        <strong>Genre:</strong> {getGenreName(movie.genreId)}
                                    </p>
                                    <p>
                                        <strong>Release Date:</strong>{' '}
                                        {new Date(movie.releaseDate).toLocaleDateString()}
                                    </p>
                                    {movie.image && (
                                        <img
                                            src={movie.image}
                                            alt={movie.name}
                                            className="w-62 h-54 object-cover rounded-lg mt-4 shadow-md"
                                        />
                                    )}
                                </div>
                            </Link>
                        </li>
                    ))
                ) : (
                    <p className="text-center text-gray-600 col-span-full">
                        No movies found matching your filter.
                    </p>
                )}
            </ul>
        </div>
    );
};

export default User;
