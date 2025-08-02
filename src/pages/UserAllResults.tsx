import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Eye, Volume2, PenTool, Activity } from 'lucide-react';

interface UserQuizData {
    userId: string;
    username: string;
    email: string;
    results: string[]; // e.g., ["READWRITE 200%"]
}

const UserAllResults: React.FC = () => {
    const [quizData, setQuizData] = useState<UserQuizData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchUserQuizPercentages = async () => {
            setError(null);

            if (!token) {
                setError('No authentication token found. Please sign in.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/v1/quizzes/results/me/percentages', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('API Response:', response.data); // Debug the full response

                // Handle response structure (check for data wrapper)
                const userData: UserQuizData = response.data.data || response.data;
                if (!userData.results || !Array.isArray(userData.results)) {
                    throw new Error('Invalid data format from API');
                }
                console.log(userData);
                setQuizData(userData);
            } catch (error: any) {
                console.error('Error fetching user quiz percentages:', error.response?.data || error.message);
                setError(
                    error.response?.data?.error || 'Failed to load quiz percentages. Please try again later.'
                );
            }
        };

        fetchUserQuizPercentages();
    }, [token]);

    // Fixed parsePercentage function to handle both decimal and whole numbers
    const parsePercentage = (result: string) => {
        // Match patterns like "200%", "20.5%", "0.0%"
        const match = result.match(/(\d+(?:\.\d+)?)%/);
        return match ? parseFloat(match[1]) : 0;
    };

    const getResultForTitle = (title: string) => {
        const upperTitle = title.toUpperCase().replace(/[\/\s]/g, ''); // Handle "Read/Write" -> "READWRITE"
        console.log('Looking for title:', upperTitle, 'in results:', quizData?.results);
        return quizData?.results.find(r => {
            const resultTitle = r.split(' ')[0]; // Get the quiz name part before the percentage
            console.log('Comparing:', resultTitle, 'with:', upperTitle);
            return resultTitle === upperTitle;
        });
    };

    const renderCard = (
        title: string,
        color: string = 'from-indigo-500 to-blue-500',
        Icon?: React.ElementType
    ) => {
        const result = getResultForTitle(title);
        const percentage = result ? parsePercentage(result) : 0;

        console.log(`Card for ${title}:`, { result, percentage });

        return (
            <div className={`bg-gradient-to-br ${color} text-white shadow-xl rounded-2xl p-6 w-full transform transition-transform hover:scale-[1.02]`}>
                <div className="flex items-center mb-4">
                    {Icon && <Icon className="w-8 h-8 mr-3" />}
                    <h2 className="text-xl font-bold">{title}</h2>
                </div>
                <div className="text-sm mb-2">Percentage: <span className="font-semibold">{percentage}%</span></div>
                <div className="w-full bg-white/30 rounded-full h-3 mt-2">
                    <div
                        className="bg-white h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                </div>
            </div>
        );
    };

    // Debug state in the UI
    useEffect(() => {
        console.log('quizData state:', quizData);
    }, [quizData]);

    return (
        <div className="bg-gray-100 p-6">
            <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800">📊 Your Quiz Learning Styles</h1>

            {error ? (
                <p className="text-red-600 text-center">{error}</p>
            ) : quizData ? (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {renderCard('Visual', 'from-purple-500 to-pink-500', Eye)}
                    {renderCard('Auditory', 'from-blue-500 to-teal-400', Volume2)}
                    {renderCard('Read/Write', 'from-green-500 to-lime-400', PenTool)}
                    {renderCard('Kinesthetic', 'from-yellow-500 to-orange-500', Activity)}
                </div>
            ) : (
                <p className="text-center">Loading...</p>
            )}
        </div>
    );
};

export default UserAllResults;