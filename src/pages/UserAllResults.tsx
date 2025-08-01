import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen, Eye, Volume2, PenTool, Activity } from 'lucide-react';

interface QuizTotals {
    percentage: number;
    totalMarks: number;
}

interface UserQuizData {
    VISUAL: QuizTotals;
    AUDITORY: QuizTotals;
    READWRITE: QuizTotals;
    KINESTHETIC: QuizTotals;
    userId: string | null;
    username: string | null;
}

interface QuizResultData {
    quizName: string;
    totalMarksSum: number;
}

const UserAllResults: React.FC = () => {
    const [quizData, setQuizData] = useState<UserQuizData | null>(null);
    const [marksData, setMarksData] = useState<Record<string, number>>({});
    const [error, setUserQuizError] = useState<string | null>(null);
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchUserQuizTotals = async () => {
            setUserQuizError(null);

            if (!token) {
                setUserQuizError('No authentication token found. Please sign in.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/v1/quizzes/user-quiz-totals', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const userData: UserQuizData = response.data.data;
                setQuizData(userData);

                if (userData.userId) {
                    const quizTypes = ['VISUAL', 'AUDITORY', 'READWRITE', 'KINESTHETIC'];

                    const marksResponses = await Promise.all(
                        quizTypes.map((quizType) =>
                            axios.get<QuizResultData>(
                                `http://localhost:5000/api/v1/quizzes/quiz-results/${quizType}/${userData.userId}`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            ).then(res => ({
                                quizName: quizType,
                                totalMarksSum: res.data.totalMarksSum
                            })).catch(err => {
                                console.error(`Error fetching results for ${quizType}:`, err.message);
                                return { quizName: quizType, totalMarksSum: 0 };
                            })
                        )
                    );

                    const updatedMarksData: Record<string, number> = {};
                    marksResponses.forEach(result => {
                        updatedMarksData[result.quizName] = result.totalMarksSum;
                    });

                    setMarksData(updatedMarksData);
                }

            } catch (error: any) {
                console.error('Error fetching user quiz totals:', error.response?.data || error.message);
                setUserQuizError(
                    error.response?.data?.message || 'Failed to load quiz totals. Please try again later.'
                );
            }
        };

        fetchUserQuizTotals();
    }, [token]);

    const renderCard = (
        title: string,
        data?: QuizTotals,
        color: string = 'from-indigo-500 to-blue-500',
        Icon?: React.ElementType
    ) => {
        const totalMarksSum = marksData[title.toUpperCase()] || 0;

        return (
            <div className={`bg-gradient-to-br ${color} text-white shadow-xl rounded-2xl p-6 w-full transform transition-transform hover:scale-[1.02]`}>
                <div className="flex items-center mb-4">
                    {Icon && <Icon className="w-8 h-8 mr-3" />}
                    <h2 className="text-xl font-bold">{title}</h2>
                </div>
                <div className="text-sm mb-1">Total Marks (Sum): <span className="font-semibold">{totalMarksSum}</span></div>
                <div className="text-sm mb-1">Latest Total Marks: <span className="font-semibold">{data?.totalMarks ?? 0}</span></div>
                <div className="text-sm mb-2">Percentage: <span className="font-semibold">{data?.percentage ?? 0}%</span></div>
                <div className="w-full bg-white/30 rounded-full h-3 mt-2">
                    <div
                        className="bg-white h-3 rounded-full transition-all duration-300"
                        style={{ width: `${data?.percentage ?? 0}%` }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-100 p-6">
            <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800">📊 Your Quiz Learning Styles</h1>

            {error ? (
                <p className="text-red-600 text-center">{error}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {renderCard('Visual', quizData?.VISUAL, 'from-purple-500 to-pink-500', Eye)}
                    {renderCard('Auditory', quizData?.AUDITORY, 'from-blue-500 to-teal-400', Volume2)}
                    {renderCard('Read/Write', quizData?.READWRITE, 'from-green-500 to-lime-400', PenTool)}
                    {renderCard('Kinesthetic', quizData?.KINESTHETIC, 'from-yellow-500 to-orange-500', Activity)}
                </div>
            )}
        </div>
    );
};

export default UserAllResults;
