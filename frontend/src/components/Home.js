import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate(); // useNavigate hook to programmatically navigate

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-8">Welcome to IMDb</h1>
            <div className="space-x-4">
                {/* Button for Admin */}
                <button
                    onClick={() => navigate('/admin')} // Navigate to Admin page on click
                    className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
                >
                    Admin
                </button>
                
                {/* Button for User */}
                <button
                    onClick={() => navigate('/user')} // Navigate to User page on click
                    className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition"
                >
                    User (Movie Search)
                </button>
            </div>
        </div>
    );
};

export default Home;
