import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate(); 

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-100 via-blue-200 to-purple-300">
            {/* Main Title */}
            <h1 className="text-5xl font-extrabold text-gray-800 mb-12 drop-shadow-lg">
                Welcome to IMDb
            </h1>

            {/* Button Container */}
            <div className="flex space-x-8">
                {/* Button for Admin */}
                <button
                    onClick={() => navigate('/admin')} 
                    className="relative bg-blue-600 text-white px-8 py-4 rounded-full shadow-xl transition-transform transform hover:-translate-y-1 hover:bg-blue-700 hover:shadow-2xl"
                >
                    Admin
                    {/* Decorative Circular Background */}
                    <span className="absolute -top-2 -right-2 bg-white w-6 h-6 rounded-full animate-ping"></span>
                    <span className="absolute -top-2 -right-2 bg-blue-700 w-6 h-6 rounded-full"></span>
                </button>
                
                {/* Button for User */}
                <button
                    onClick={() => navigate('/user')} 
                    className="relative bg-green-600 text-white px-8 py-4 rounded-full shadow-xl transition-transform transform hover:-translate-y-1 hover:bg-green-700 hover:shadow-2xl"
                >
                    User (Movie Search)
                    {/* Decorative Circular Background */}
                    <span className="absolute -top-2 -right-2 bg-white w-6 h-6 rounded-full animate-ping"></span>
                    <span className="absolute -top-2 -right-2 bg-green-700 w-6 h-6 rounded-full"></span>
                </button>
            </div>

            {/* Subtext */}
            <p className="text-gray-600 mt-10 text-center text-xl max-w-2xl">
                Your go-to platform for all things movies. Whether you're an admin looking to manage movies or a user searching for your next film, you're in the right place!
            </p>

            {/* Footer with subtle opacity */}
            <footer className="absolute bottom-4 text-gray-600 text-sm opacity-80">
                &copy; {new Date().getFullYear()} IMDb Clone. All rights reserved.
            </footer>
        </div>
    );
};

export default Home;
