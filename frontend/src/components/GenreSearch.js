import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GenreSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [genres, setGenres] = useState([]);
    const [filteredGenres, setFilteredGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null); // State to hold the genre to be updated

    // Fetch all genres when the component loads
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/genres');
                setGenres(response.data);
                setFilteredGenres(response.data); // Initially show all genres
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
        fetchGenres();
    }, []);

    // Real-time filtering of genres based on search term
    useEffect(() => {
        const results = genres.filter((genre) =>
            genre.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredGenres(results);
    }, [searchTerm, genres]); // Trigger this effect on changes to searchTerm or genres

    const handleUpdateGenre = async (e) => {
        e.preventDefault();
        if (!selectedGenre || !selectedGenre._id) {
            console.error('No genre selected or genre ID is undefined');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5000/api/genres/${selectedGenre._id}`, selectedGenre);
            console.log('Updated genre:', response.data); // Log the updated genre
            setSelectedGenre(null);
            setSearchTerm(''); // Clear search term
        } catch (error) {
            console.error('Error updating genre:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            {/* Search form */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search Genres..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Real-time update on change
                    className="border p-3 w-full text-gray-700 focus:outline-none focus:border-blue-500 rounded-lg shadow-md"
                />
            </div>

            {/* Genre List */}
            {filteredGenres.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredGenres.map((genre) => (
                        <li key={genre._id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-2">{genre.name}</h3>
                            </div>
                            <div className="flex justify-between">
                                <button
                                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                                    onClick={() => setSelectedGenre(genre)} // Set selected genre for updating
                                >
                                    Update
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-700">No genres found.</p>
            )}

            {/* Update Genre Form */}
            {selectedGenre && (
                <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Update Genre</h3>
                    <form onSubmit={handleUpdateGenre}>
                        <input
                            type="text"
                            value={selectedGenre.name}
                            onChange={(e) => setSelectedGenre({ ...selectedGenre, name: e.target.value })}
                            required
                            className="border p-3 mb-3 w-full rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Update Genre
                        </button>
                        <button
                            type="button"
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                            onClick={() => setSelectedGenre(null)} // Clear selected genre
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default GenreSearch;
