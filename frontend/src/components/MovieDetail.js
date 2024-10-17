import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate

const MovieDetail = () => {
    const { id } = useParams(); // Get movie ID from the URL
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ title: '', description: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/movies/${id}`);
                setMovie(response.data);
                const reviewsResponse = await axios.get(`http://localhost:5000/api/reviews/${id}`);
                setReviews(reviewsResponse.data);
            } catch (err) {
                setError('Failed to fetch movie details. Please try again later.');
            }
        };

        fetchMovieDetails();
    }, [id]);

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setNewReview({ ...newReview, [name]: value });
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/reviews', { ...newReview, movieId: id });
            setReviews([...reviews, newReview]); // Update reviews state
            setNewReview({ title: '', description: '' }); // Reset the review form
        } catch (err) {
            setError('Failed to add review. Please try again later.');
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen relative">
            {error && <p className="text-red-500">{error}</p>}
            
            {/* Back to Movies Button - positioned absolutely */}
            <button
                onClick={() => navigate('/user')}
                className="absolute top-2 left-2 bg-gray-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600 transition-colors"
            >
                Back to Movies
            </button>

            {movie ? (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold mb-4 text-blue-700">{movie.name}</h2>
                    <img src={movie.image} alt={movie.name} className="w-full h-64 object-cover mb-4 rounded-lg shadow-md" />
                    <p className="mb-2"><strong>Description:</strong> {movie.description}</p>
                    <p className="mb-2"><strong>Cast:</strong> {movie.cast.join(', ')}</p>
                    <p className="mb-2"><strong>Director:</strong> {movie.director}</p>
                    <p className="mb-2"><strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>

                    <h3 className="text-xl font-semibold mt-4 mb-2">Reviews</h3>
                    <form onSubmit={handleAddReview} className="mb-4">
                        <input
                            type="text"
                            name="title"
                            placeholder="Review Title"
                            value={newReview.title}
                            onChange={handleReviewChange}
                            required
                            className="border p-2 mb-2 w-full rounded-md shadow-md"
                        />
                        <textarea
                            name="description"
                            placeholder="Review Description"
                            value={newReview.description}
                            onChange={handleReviewChange}
                            required
                            className="border p-2 mb-2 w-full rounded-md shadow-md"
                        />
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600">
                            Add Review
                        </button>
                    </form>

                    <ul className="mt-4">
                        {reviews.map((review) => (
                            <li key={review._id} className="border p-4 mb-2 rounded-md bg-white shadow-md">
                                <h4 className="font-semibold">{review.title}</h4>
                                <p>{review.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Loading movie details...</p>
            )}
        </div>
    );
};

export default MovieDetail;
