import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const MovieDetail = () => {
    const { id } = useParams(); 
    const navigate = useNavigate(); 
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ title: '', description: '' });
    const [rating, setRating] = useState(0);
    const [averageRating, setAverageRating] = useState(null); 
    const [ratingCount, setRatingCount] = useState(0); 
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/movies/${id}`);
                setMovie(response.data);

                // Fetch reviews
                const reviewsResponse = await axios.get(`http://localhost:5000/api/reviews/${id}`);
                setReviews(reviewsResponse.data);

                // Fetch average rating
                const ratingsResponse = await axios.get(`http://localhost:5000/api/movies/${id}/ratings`);
                setAverageRating(ratingsResponse.data.averageRating);
                setRatingCount(ratingsResponse.data.ratingCount);
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
            setReviews([...reviews, newReview]); 
            setNewReview({ title: '', description: '' }); 
        } catch (err) {
            setError('Failed to add review. Please try again later.');
        }
    };

    const handleRatingSubmit = async (newRating) => {
        try {
            await axios.post(`http://localhost:5000/api/movies/${id}/rate`, { rating: newRating });
            setRating(newRating); 

            // Fetch updated average rating
            const updatedRatings = await axios.get(`http://localhost:5000/api/movies/${id}/ratings`);
            setAverageRating(updatedRatings.data.averageRating);
            setRatingCount(updatedRatings.data.ratingCount);
        } catch (error) {
            console.error('Failed to submit rating', error);
            setError('Failed to submit rating. Please try again later.');
        }
    };

    // Function to handle printing
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 min-h-screen relative">
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Back to Movies Button */}
            <button
                onClick={() => navigate('/user')}
                className="absolute top-4 left-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-gray-700 transition-transform transform hover:-translate-y-1"
            >
                Back to Movies
            </button>

            {/* Print Button */}
            <button
                onClick={handlePrint}
                className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-green-700 transition-transform transform hover:-translate-y-1"
            >
                Print
            </button>

            {movie ? (
                <div className="bg-white p-8 rounded-lg shadow-2xl mx-auto max-w-4xl">
                    <h2 className="text-4xl font-extrabold mb-6 text-center text-blue-700">{movie.name}</h2>

                    <div className="flex justify-center mb-8">
                        <img
                            src={movie.image}
                            alt={movie.name}
                            className="w-half h-96 object-cover rounded-lg shadow-md"
                        />
                    </div>

                    <div className="text-lg space-y-4">
                        <p><strong>Description:</strong> {movie.description}</p>
                        <p><strong>Cast:</strong> {movie.cast.join(', ')}</p>
                        <p><strong>Director:</strong> {movie.director}</p>
                        <p><strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>
                    </div>

                    {/* Average Rating Display */}
                    <div className="mt-8 mb-6 text-center">
                        <h3 className="text-2xl font-semibold text-gray-800">Average Rating: 
                            <span className="text-yellow-500"> {averageRating ? averageRating : 'No ratings yet'}</span> 
                            ({ratingCount} ratings)
                        </h3>
                    </div>

                    {/* Rating Submission */}
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Rate this Movie:</h3>
                        <div className="flex justify-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleRatingSubmit(star)}
                                    className={`text-3xl transition-colors ${rating >= star ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <h3 className="text-2xl font-semibold mt-6 mb-4 text-gray-800">Reviews</h3>
                    <form onSubmit={handleAddReview} className="mb-6 space-y-4">
                        <input
                            type="text"
                            name="title"
                            placeholder="Review Title"
                            value={newReview.title}
                            onChange={handleReviewChange}
                            required
                            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
                        />
                        <textarea
                            name="description"
                            placeholder="Review Description"
                            value={newReview.description}
                            onChange={handleReviewChange}
                            required
                            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
                        />
                        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-700 transition-transform transform hover:-translate-y-1">
                            Add Review
                        </button>
                    </form>

                    <ul className="space-y-4">
                        {reviews.map((review) => (
                            <li key={review._id} className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-md">
                                <h4 className="font-bold text-lg">{review.title}</h4>
                                <p>{review.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-center text-lg text-gray-600">Loading movie details...</p>
            )}
        </div>
    );
};

export default MovieDetail;
