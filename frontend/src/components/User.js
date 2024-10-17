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
        const filtered = movies.filter(movie => {
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
        <div className="user-panel p-6 bg-gray-100 min-h-screen">
            <button
                onClick={() => navigate('/')}
                className="absolute top-2 left-2 bg-gray-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600 transition-colors"
            >
                Back to Home
            </button>

            <h2 className="text-4xl font-bold mb-6 text-center text-blue-600">Movie Search Panel</h2>

            <div className="flex flex-col md:flex-row mb-8 space-y-4 md:space-y-0 md:space-x-4 items-center">
                <input
                    type="text"
                    placeholder="Search by movie name..."
                    value={filter}
                    onChange={handleFilterChange}
                    className="border p-3 rounded-lg w-full md:w-1/3 focus:outline-none focus:border-blue-500 shadow-md"
                />

                <select
                    value={selectedGenre}
                    onChange={handleGenreChange}
                    className="border p-3 rounded-lg w-full md:w-1/3 focus:outline-none focus:border-blue-500 shadow-md"
                >
                    <option value="">Select Genre</option>
                    {genres.map((genre) => (
                        <option key={genre._id} value={genre._id}>{genre.name}</option>
                    ))}
                </select>
            </div>

            {loading && <p className="text-lg text-center text-gray-600">Loading movies...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">Filtered Movies</h3>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMovies.length > 0 ? (
                    filteredMovies.map((movie) => (
                        <li key={movie._id} className="bg-white border rounded-lg shadow-lg hover:shadow-2xl transition-shadow p-6 flex flex-col space-y-4">
                            <Link to={`/movies/${movie._id}`} className="text-blue-700 hover:text-blue-900 transition-colors">
                                <h4 className="text-xl font-bold mb-2">{movie.name}</h4>
                                <div>
                                    <p className="text-gray-700 mb-2">{movie.description}</p>
                                    <p className="text-gray-600"><strong>Cast:</strong> {movie.cast.join(', ')}</p>
                                    <p className="text-gray-600"><strong>Director:</strong> {movie.director}</p>
                                    <p className="text-gray-600"><strong>Genre:</strong> {getGenreName(movie.genreId)}</p>
                                    <p className="text-gray-600"><strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>
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
                    <p className="text-center text-gray-600">No movies found matching your filter.</p>
                )}
            </ul>
        </div>
    );
};

export default User;
