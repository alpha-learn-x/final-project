import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon, BookOpen, Target, Award, HelpCircle, ShoppingCart, Brain, Eye } from 'lucide-react';
import axios from 'axios';
import Header from "@/components/Header.tsx";

const GameContext = () => {
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedUsername = localStorage.getItem('username');
        if (storedUserId) setUserId(storedUserId);
        if (storedUsername) setUsername(storedUsername);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 relative overflow-hidden">
            <div className="absolute top-10 left-10 text-4xl animate-bounce">🌟</div>
            <div className="absolute top-20 right-20 text-3xl animate-ping">⭐</div>
            <div className="absolute bottom-20 left-20 text-4xl animate-pulse">🎈</div>

            <Header></Header>
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-16">
                    <div className="relative">
                        <div className="text-6xl mb-4 animate-bounce">🧠</div>
                        <h1 className="text-6xl font-bold text-white mb-6 animate-pulse">
                            🪄 Welcome to TinkerAlpha!
                        </h1>
                        <div className="absolute -top-8 -left-8 text-5xl animate-spin">⭐</div>
                        <div className="absolute -top-8 -right-8 text-5xl animate-spin">⭐</div>
                    </div>
                    <div className="bg-white/90 rounded-3xl p-6 max-w-4xl mx-auto border-4 border-yellow-400 shadow-2xl">
                        <p className="text-2xl text-purple-800 font-bold mb-4">
                            Hi {username || 'Student'}! 👋 Explore our interactive learning modules!
                        </p>
                        <p className="text-lg text-blue-700">
                            🌟 Choose a module to start your learning adventure! 🌟
                        </p>
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border-4 border-yellow-300 flex-1 flex flex-col items-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                        <Link to="/read-write" className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 border-2 border-dashed border-blue-300 hover:bg-blue-200 transition-all duration-300">
                            <div className="flex items-center justify-center">
                                <BookOpen className="h-12 w-12 text-purple-800 mr-4" />
                                <span className="text-2xl font-bold text-purple-800">Read & Write</span>
                            </div>
                        </Link>
                        <Link to="/visual" className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 border-2 border-dashed border-blue-300 hover:bg-blue-200 transition-all duration-300">
                            <div className="flex items-center justify-center">
                                <Eye className="h-12 w-12 text-purple-800 mr-4" />
                                <span className="text-2xl font-bold text-purple-800">Visual</span>
                            </div>
                        </Link>
                        <Link to="/drag-and-drop" className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 border-2 border-dashed border-blue-300 hover:bg-blue-200 transition-all duration-300">
                            <div className="flex items-center justify-center">
                                <Target className="h-12 w-12 text-purple-800 mr-4" />
                                <span className="text-2xl font-bold text-purple-800">Drag & Drop</span>
                            </div>
                        </Link>
                        <Link to="/auditory" className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 border-2 border-dashed border-blue-300 hover:bg-blue-200 transition-all duration-300">
                            <div className="flex items-center justify-center">
                                <Brain className="h-12 w-12 text-purple-800 mr-4" />
                                <span className="text-2xl font-bold text-purple-800">Auditory</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameContext;