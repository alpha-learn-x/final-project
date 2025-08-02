import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import axios from 'axios';
import Header from "@/components/Header.tsx"; // Adjust path as needed

interface MatchItem {
    id: string;
    text: string;
    imageUrl: string;
    _id: string;
}

interface KinestheticQuiz {
    _id: string;
    quizName: string;
    question: string;
    matchItems: MatchItem[];
    correctPairs: { [key: string]: string }; // sound: itemId
    createdAt: string;
}

interface UserData {
    id?: string;
    userId?: string;
    userName?: string;
    email?: string;
}

interface QuizResult {
    quizId: string;
    timeTaken: number;
    marks: number;
    userAnswer: { [key: string]: string };
    correctAnswer: { [key: string]: string };
}

const Kinesthetic: React.FC = () => {
    const [quizzes, setQuizzes] = useState<KinestheticQuiz[]>([]);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [time, setTime] = useState(0);
    const [draggedItem, setDraggedItem] = useState<MatchItem | null>(null);
    const [droppedItems, setDroppedItems] = useState<{ [key: string]: string }>({});
    const [results, setResults] = useState<QuizResult[]>([]);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [totalTime, setTotalTime] = useState(0);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [showCurrentResult, setShowCurrentResult] = useState(false);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [user, setUser] = useState('');
    const [totalMarks, setTotalMarks] = useState(0);
    const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/quizzes/kinesthetic/get-all');
                console.log('Quizzes data:', response.data);

                if (Array.isArray(response.data) && response.data.length > 0) {
                    setQuizzes(response.data);
                } else {
                    throw new Error('No quizzes available');
                }
                setLoading(false);
            } catch (err: any) {
                console.error('Error fetching quizzes:', err);
                setError(err.response?.data?.error || 'Failed to load quizzes. Please try again.');
                setLoading(false);
            }
        };

        fetchQuizzes();

        const userDataStr = localStorage.getItem('currentUser');
        if (!userDataStr) {
            setSaveStatus('Please log in to start the quiz.');
            return;
        }
        try {
            const userData: UserData = JSON.parse(userDataStr);
            setUser(userData.id || '');
            setUserId(userData.userId || '');
            setUsername(userData.userName || '');
            setEmail(userData.email || '');
        } catch (err) {
            console.error("Failed to parse user data from localStorage", err);
            setSaveStatus('Error loading user data. Please log in again.');
        }
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isTimerRunning) {
            timer = setInterval(() => {
                setTime(prev => prev + 1);
                setTotalTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isTimerRunning]);

    const handleStartTimer = () => {
        if (!isTimerRunning && !isQuizCompleted) {
            setIsTimerRunning(true);
        }
    };

    const handleDragStart = (e: React.DragEvent, item: MatchItem | 'No answer') => {
        if (item === 'No answer') {
            setDraggedItem(null);
            e.dataTransfer.setData("text/plain", 'No answer');
        } else {
            setDraggedItem(item);
            e.dataTransfer.setData("text/plain", item.id);
        }
    };

    const handleDrop = (e: React.DragEvent, sound: string) => {
        e.preventDefault();
        const itemId = e.dataTransfer.getData("text/plain");
        setDroppedItems(prev => ({
            ...prev,
            [sound]: itemId,
        }));
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    const handleClearDrop = (sound: string) => {
        setDroppedItems(prev => {
            const newItems = { ...prev };
            delete newItems[sound];
            return newItems;
        });
    };

    const handleNoAnswerDrop = (sound: string) => {
        setDroppedItems(prev => ({
            ...prev,
            [sound]: 'No answer',
        }));
    };

    const isComplete = () => {
        const currentQuiz = quizzes[currentQuizIndex];
        if (!currentQuiz) return false;
        return Object.keys(currentQuiz.correctPairs).every(sound => droppedItems.hasOwnProperty(sound));
    };

    const checkAnswerWithBackend = async (quizId: string, userAnswer: { [key: string]: string }): Promise<boolean> => {
        try {
            const response = await axios.post('http://localhost:5000/api/v1/quizzes/kinesthetic/check-answer', {
                quizId,
                userPairs: userAnswer,
            });
            return response.data.correct;
        } catch (error) {
            console.error('Backend check failed:', error);
            setSaveStatus('Failed to check answer with server. Please try again.');
            return false; // Fallback to false if backend fails
        }
    };

    const handleCheckAnswer = async () => {
        if (!isComplete() || !isTimerRunning || isCheckingAnswer) return;

        setIsCheckingAnswer(true);
        try {
            const currentQuiz = quizzes[currentQuizIndex];
            const isCorrect = await checkAnswerWithBackend(currentQuiz._id, droppedItems);
            const marks = isCorrect ? 1 : 0;

            setResults(prev => {
                if (prev.some(r => r.quizId === currentQuiz._id)) return prev;
                return [...prev, {
                    quizId: currentQuiz._id,
                    timeTaken: time,
                    marks,
                    userAnswer: droppedItems,
                    correctAnswer: currentQuiz.correctPairs,
                }];
            });

            setShowCurrentResult(true);
        } catch (error) {
            console.error('Error checking answer:', error);
            setSaveStatus('Failed to check answer. Please try again.');
        } finally {
            setIsCheckingAnswer(false);
        }
    };

    const handleNextQuiz = () => {
        if (!showCurrentResult) return;

        if (currentQuizIndex < quizzes.length - 1) {
            setCurrentQuizIndex(prev => prev + 1);
            setTime(0);
            setDroppedItems({});
            setDraggedItem(null);
            setShowCurrentResult(false);
        } else {
            setIsTimerRunning(false);
            setIsQuizCompleted(true);
            saveQuizResults(results, totalTime);
        }
    };

    const saveQuizResults = async (finalResults: QuizResult[], finalTotalTime: number) => {
        if (!user || !userId || !username || !email) {
            setSaveStatus('Error: Please log in to submit quiz results.');
            return;
        }

        const correctCount = finalResults.filter(r => r.marks > 0).length;
        setTotalMarks(correctCount);

        const payload = {
            quizName: "KINESTHETIC",
            user,
            userId,
            username,
            email,
            totalMarks: correctCount,
            participatedQuestions: quizzes.length,
            totalTime: finalTotalTime,
            date: new Date().toISOString(),
        };

        try {
            const response = await axios.post('http://localhost:5000/api/v1/quizzes/results/create', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setSaveStatus('✅ Quiz results saved successfully!');
            console.log('Quiz results saved:', response.data);
        } catch (error: any) {
            setSaveStatus('❌ Error saving quiz results. Please try again.');
            console.error('Error saving quiz results:', error.response?.data || error.message);
        }
    };

    const resetQuiz = () => {
        setCurrentQuizIndex(0);
        setTime(0);
        setTotalTime(0);
        setDroppedItems({});
        setResults([]);
        setIsTimerRunning(false);
        setIsQuizCompleted(false);
        setShowCurrentResult(false);
        setSaveStatus(null);
        setTotalMarks(0);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getEncouragementMessage = () => {
        const percentage = (totalMarks / quizzes.length) * 100;
        if (percentage === 100) return "🌟 Perfect! You're a kinesthetic genius! 🌟";
        if (percentage >= 80) return "🎉 Excellent work! Almost perfect! 🎉";
        if (percentage >= 60) return "👍 Good job! Keep learning! 👍";
        if (percentage >= 40) return "😊 Nice try! Practice makes perfect! 😊";
        return "🌈 Don't worry! Learning is fun! Try again! 🌈";
    };

    const getScoreColor = () => {
        const percentage = (totalMarks / quizzes.length) * 100;
        if (percentage >= 80) return "text-green-600";
        if (percentage >= 60) return "text-yellow-600";
        return "text-red-500";
    };

    const getAnswerDisplayText = (quiz: KinestheticQuiz, answerPairs: { [key: string]: string }) => {
        return Object.entries(answerPairs).map(([sound, itemId]) => {
            if (itemId === 'No answer' || !itemId) {
                return `${sound}: No answer`;
            }
            const item = quiz.matchItems.find(i => i.id === itemId);
            return `${sound}: ${item?.text || 'Unknown'}`;
        }).join(', ');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">📚</div>
                    <p className="text-3xl text-white font-bold">Loading quizzes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center">
                <div className="text-center bg-white/90 rounded-3xl p-8 border-4 border-red-400">
                    <div className="text-6xl mb-4">❌</div>
                    <p className="text-2xl text-red-600 font-bold mb-4">{error}</p>
                    <Link to="/">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full">
                            Back to Home
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!quizzes || quizzes.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center">
                <div className="text-center bg-white/90 rounded-3xl p-8 border-4 border-yellow-400">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-2xl text-purple-800 font-bold mb-4">No quizzes available.</p>
                    <Link to="/">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full">
                            Back to Home
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const currentQuiz = quizzes[currentQuizIndex];
    const currentResult = results.find(r => r.quizId === currentQuiz?._id);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 relative overflow-hidden">
            <Header />

            <div className="container mx-auto px-4 py-12">
                {saveStatus && (
                    <div className={`mb-4 p-4 rounded-lg ${saveStatus.includes('Error') || saveStatus.includes('❌') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {saveStatus}
                    </div>
                )}

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-6">
                        🪄 {currentQuiz.quizName} Quiz
                    </h1>
                    <div className="bg-white/90 rounded-3xl p-6 max-w-4xl mx-auto border-4 border-yellow-400 shadow-2xl">
                        <p className="text-xl text-purple-800 font-bold mb-4">
                            Hi {username || 'Student'}! 👋 {currentQuiz.question}
                        </p>
                        <p className="text-md text-gray-600">
                            Question {currentQuizIndex + 1} of {quizzes.length}
                            {isQuizCompleted && " - Quiz Completed!"}
                        </p>
                        {!isQuizCompleted && (
                            <p className="text-lg font-bold mt-2">
                                Current Score: <span className={getScoreColor()}>
                                    {results.reduce((acc, r) => acc + r.marks, 0)} / {quizzes.length}
                                </span>
                            </p>
                        )}
                    </div>
                </div>

                <div className="bg-white/95 rounded-3xl shadow-2xl p-8 border-4 border-yellow-300">
                    {!isQuizCompleted ? (
                        <>
                            <div className="flex flex-wrap justify-center gap-4 mb-8">
                                {currentQuiz.matchItems.map((item) => (
                                    <div
                                        key={item._id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, item)}
                                        className="w-40 h-40 flex flex-col items-center justify-center cursor-move border-2 border-gray-300 rounded-lg shadow-md p-2
                                        transform transition-transform duration-300 hover:scale-105 hover:bg-blue-50"
                                    >
                                        <img
                                            src={item.imageUrl}
                                            alt={item.text}
                                            className="w-32 h-32 object-contain mb-2"
                                            onError={() => console.error(`Failed to load image: ${item.imageUrl}`)}
                                        />
                                        <p className="text-center font-medium">{item.text}</p>
                                    </div>
                                ))}
                                <div
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, 'No answer')}
                                    className="w-40 h-40 flex flex-col items-center justify-center cursor-move border-2 border-red-300 rounded-lg shadow-md p-2 bg-red-50
                                    transform transition-transform duration-300 hover:scale-105 hover:bg-red-100"
                                >
                                    <div className="text-6xl mb-2">❌</div>
                                    <p className="text-center font-medium text-red-600">No Answer</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                {Object.keys(currentQuiz.correctPairs).map((sound, index) => (
                                    <div
                                        key={sound}
                                        onDrop={(e) => handleDrop(e, sound)}
                                        onDragOver={handleDragOver}
                                        className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 flex justify-between items-center rounded-xl border-2 border-dashed border-blue-300 hover:border-purple-400"
                                    >
                                        <span className="font-bold text-lg text-gray-800">
                                            {index + 1}. {sound}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-36 h-32 bg-white rounded-lg border border-gray-300 shadow-inner flex items-center justify-center">
                                                {droppedItems[sound] ? (
                                                    droppedItems[sound] === 'No answer' ? (
                                                        <div className="text-center">
                                                            <div className="text-4xl mb-1">❌</div>
                                                            <p className="text-sm text-red-600 font-medium">No Answer</p>
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src={currentQuiz.matchItems.find(item => item.id === droppedItems[sound])?.imageUrl}
                                                            alt="Dropped item"
                                                            className="w-28 h-28 object-contain"
                                                            onError={() => console.error(`Failed to load dropped image for ${sound}`)}
                                                        />
                                                    )
                                                ) : (
                                                    <span className="text-gray-400 italic">Drop here</span>
                                                )}
                                            </div>
                                            {droppedItems[sound] && (
                                                <button
                                                    onClick={() => handleClearDrop(sound)}
                                                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleNoAnswerDrop(sound)}
                                                className="bg-gray-500 text-white px-2 py-1 rounded text-sm hover:bg-gray-600"
                                            >
                                                No Answer
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <div className="text-lg font-bold text-blue-800">
                                    ⏱️ Time: {formatTime(time)} (Total: {formatTime(totalTime)})
                                </div>
                                <button
                                    onClick={handleStartTimer}
                                    disabled={isTimerRunning}
                                    className="bg-green-500 text-white px-4 py-2 rounded-full disabled:opacity-50"
                                >
                                    {isTimerRunning ? "Timer Running..." : "Start Timer"}
                                </button>
                            </div>

                            {showCurrentResult && currentResult && (
                                <div className="mt-6 p-6 rounded-xl border-2 bg-green-100 border-green-400">
                                    <p className="text-2xl font-bold text-green-800 mb-4">
                                        Question {currentQuizIndex + 1} Result
                                    </p>
                                    <p className={`text-xl font-bold ${currentResult.marks > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        Score: {currentResult.marks} / 1
                                    </p>
                                    <p className="text-lg text-gray-700">
                                        Time: {formatTime(currentResult.timeTaken)}
                                    </p>
                                    <div className="mt-4">
                                        {Object.keys(currentQuiz.correctPairs).map((sound, index) => {
                                            const userAnswerId = currentResult.userAnswer[sound] || 'No answer';
                                            const userAnswer = userAnswerId === 'No answer' ?
                                                'No answer' :
                                                currentQuiz.matchItems.find(item => item.id === userAnswerId)?.text || 'Unknown';
                                            const correctAnswerId = currentQuiz.correctPairs[sound] || 'No answer';
                                            const correctAnswer = correctAnswerId === 'No answer' ?
                                                'No answer' :
                                                currentQuiz.matchItems.find(item => item.id === correctAnswerId)?.text || 'Unknown';
                                            const isCorrect = userAnswerId === correctAnswerId || (
                                                userAnswerId !== 'No answer' &&
                                                currentQuiz.matchItems.find(item => item.id === userAnswerId)?.text.toLowerCase() === sound.toLowerCase()
                                            );

                                            return (
                                                <div key={index} className={`p-4 rounded mb-2 ${isCorrect ? 'bg-green-200' : 'bg-red-200'}`}>
                                                    <p className="font-semibold">Sound: {sound}</p>
                                                    <p><strong>Your Answer:</strong> {userAnswer}</p>
                                                    <p><strong>Correct Answer:</strong> {correctAnswer}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-center gap-4 mt-6">
                                {showCurrentResult ? (
                                    <button
                                        onClick={handleNextQuiz}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full"
                                    >
                                        {currentQuizIndex < quizzes.length - 1 ? "Next Question" : "Finish Quiz"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleCheckAnswer}
                                        disabled={!isComplete() || !isTimerRunning || isCheckingAnswer}
                                        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-full disabled:opacity-50"
                                    >
                                        {isCheckingAnswer ? "Checking..." : "Check Answer"}
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-8">
                            <h2 className="text-3xl font-bold text-purple-900 mb-4">
                                🎉 Quiz Completed!
                            </h2>
                            <div className={`text-6xl font-bold mb-6 ${getScoreColor()}`}>
                                {totalMarks} / {quizzes.length}
                            </div>
                            <div className="text-xl mb-6">
                                <p>{getEncouragementMessage()}</p>
                                <p>Total Time: {formatTime(totalTime)}</p>
                            </div>

                            <div className="space-y-6 overflow-y-auto max-h-96 mb-8">
                                <h3 className="text-2xl font-semibold text-purple-800 mb-4">Detailed Results</h3>
                                {results.map((result, idx) => {
                                    const quiz = quizzes.find(q => q._id === result.quizId);
                                    const isCorrect = result.marks > 0;

                                    return (
                                        <div key={result.quizId} className={`p-6 rounded-xl border-2 ${
                                            isCorrect ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'
                                        } text-center`}>
                                            <p className="font-semibold text-gray-800 text-xl mb-3">
                                                Q{idx + 1}: {quiz?.question || 'Question not found'}
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
                                                <div className="text-lg">
                                                    <strong>Your answer:</strong><br />
                                                    {getAnswerDisplayText(quiz!, result.userAnswer)}
                                                </div>
                                                <div className="text-lg">
                                                    <strong>Correct answer:</strong><br />
                                                    {getAnswerDisplayText(quiz!, quiz!.correctPairs)}
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <strong>Time:</strong> {formatTime(result.timeTaken)}
                                            </div>
                                            <div className="mt-2">
                                                {isCorrect ? (
                                                    <span className="text-green-600 font-bold text-xl">✅ Correct!</span>
                                                ) : (
                                                    <span className="text-red-600 font-bold text-xl">❌ Incorrect</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={resetQuiz}
                                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full"
                                >
                                    Restart Quiz
                                </button>
                                <Link to="/">
                                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full flex items-center">
                                        <Home className="mr-2" /> Home
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Kinesthetic;