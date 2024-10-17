// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from './components/Admin';
import User from './components/User';
import Home from './components/Home'; // Import the Home component
import MovieDetail from './components/MovieDetail'; // Import the MovieDetail component

function App() {
    return (
        <Router>
            <div className="App bg-gray-100 min-h-screen">
                <Routes>
                    {/* Home route */}
                    <Route path="/" element={<Home />} />
                    {/* Admin and User routes */}
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/user" element={<User />} />
                    {/* Movie detail route */}
                    <Route path="/movies/:id" element={<MovieDetail />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
