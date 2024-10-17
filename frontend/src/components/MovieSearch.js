import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MovieSearch = () => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [updatedMovie, setUpdatedMovie] = useState({
        name: '',
        description: '',
        cast: '',
        director: '',
        genreId: '',
        image: '',
        releaseDate: '',
    });
    const [error, setError] = useState('');

    // Fetch all movies when the component loads
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/movies');
                setMovies(response.data);
                setFilteredMovies(response.data);  // Initially show all movies
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };
        fetchMovies();
    }, []);

    // Real-time filtering of movies based on search term
    useEffect(() => {
        const results = movies.filter((movie) =>
            movie.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMovies(results);
    }, [searchTerm, movies]); // Trigger this effect on changes to searchTerm or movies

    const handleUpdate = async (id) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/movies/${id}`, updatedMovie);
            // Update the movie list with the edited movie
            setFilteredMovies((prevResults) =>
                prevResults.map((movie) => (movie._id === id ? response.data : movie))
            );
            resetForm();
        } catch (error) {
            console.error('Error updating movie:', error);
            setError('Error updating movie. Please check your inputs and try again.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/movies/${id}`);
            // Remove the deleted movie from filtered movies
            setFilteredMovies((prevResults) => prevResults.filter((movie) => movie._id !== id));
        } catch (error) {
            console.error('Error deleting movie:', error);
            setError('Error deleting movie. Please try again later.');
        }
    };

    const resetForm = () => {
        setSelectedMovie(null);
        setUpdatedMovie({
            name: '',
            description: '',
            cast: '',
            director: '',
            genreId: '',
            image: '',
            releaseDate: '',
        });
        setError('');
    };

    return (
        <div className="container mx-auto p-4">
            {/* Search form */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search Movies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Real-time update on change
                    className="border p-3 w-full text-gray-700 focus:outline-none focus:border-blue-500 rounded-lg shadow-md"
                />
            </div>

            {/* Movie List */}
            {filteredMovies.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMovies.map((movie) => (
                        <li key={movie._id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-2">{movie.name}</h3>
                                <p className="text-gray-700 mb-2">{movie.description}</p>
                                <p className="text-sm text-gray-500 mb-2">Director: {movie.director}</p>
                                <p className="text-sm text-gray-500 mb-4">Cast: {movie.cast.join(', ')}</p>
                            </div>
                            <div className="flex justify-between">
                                <button
                                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                                    onClick={() => {
                                        setSelectedMovie(movie._id);
                                        setUpdatedMovie({
                                            name: movie.name,
                                            description: movie.description,
                                            cast: movie.cast.join(', '), // Join array for display
                                            director: movie.director,
                                            genreId: movie.genreId,
                                            image: movie.image,
                                            releaseDate: movie.releaseDate.split('T')[0],  // Format date
                                        });
                                    }}
                                >
                                    Update
                                </button>
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    onClick={() => handleDelete(movie._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-700">No movies found.</p>
            )}

            {/* Update Movie Form */}
            {selectedMovie && (
                <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Update Movie</h3>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(selectedMovie); }}>
                        <input
                            type="text"
                            placeholder="Movie Name"
                            value={updatedMovie.name}
                            onChange={(e) => setUpdatedMovie({ ...updatedMovie, name: e.target.value })}
                            className="border p-3 mb-3 w-full rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                        <textarea
                            placeholder="Description"
                            value={updatedMovie.description}
                            onChange={(e) => setUpdatedMovie({ ...updatedMovie, description: e.target.value })}
                            className="border p-3 mb-3 w-full rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Cast (comma separated)"
                            value={updatedMovie.cast}
                            onChange={(e) => setUpdatedMovie({ ...updatedMovie, cast: e.target.value })}
                            className="border p-3 mb-3 w-full rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Director"
                            value={updatedMovie.director}
                            onChange={(e) => setUpdatedMovie({ ...updatedMovie, director: e.target.value })}
                            className="border p-3 mb-3 w-full rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={updatedMovie.image}
                            onChange={(e) => setUpdatedMovie({ ...updatedMovie, image: e.target.value })}
                            className="border p-3 mb-3 w-full rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                        <input
                            type="date"
                            value={updatedMovie.releaseDate}
                            onChange={(e) => setUpdatedMovie({ ...updatedMovie, releaseDate: e.target.value })}
                            className="border p-3 mb-3 w-full rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Save Changes
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MovieSearch;
