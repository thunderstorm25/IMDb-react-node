import React, { useState } from 'react';
import axios from 'axios';

const TvShowSearch = ({ setTvShows }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5000/api/tvshows/search?name=${searchTerm}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching TV shows:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch} className="mb-4">
                <input
                    type="text"
                    placeholder="Search TV Shows"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    required
                    className="border p-2 mb-2 w-full"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Search
                </button>
            </form>

            {searchResults.length > 0 ? (
                <ul>
                    {searchResults.map((tvShow) => (
                        <li key={tvShow._id}>
                            {tvShow.name} - {tvShow.description}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results found</p>
            )}
        </div>
    );
};

export default TvShowSearch;
