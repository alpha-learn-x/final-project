import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import axios from 'axios';
import Header from "@/components/Header.tsx";

interface Image {
    id: string;
    src: string;
}

interface Task {
    id: number;
    images: Image[];
    options: string[];
    correctAnswers: { [key: string]: string };
}

interface UserData {
    id?: string;
    userId?: string;
    userName?: string;
    email?: string;
}

const Kinesthetic: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [time, setTime] = useState(0);
    const [draggedImage, setDraggedImage] = useState<string | null>(null);
    const [droppedItems, setDroppedItems] = useState<{ [key: string]: string }>({});
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [results, setResults] = useState<{ taskId: number; timeTaken: number; marks: number }[]>([]);
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

    // Fetch tasks and user data on mount
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/quizzes/kinesthetic/tasks');
                console.log('Raw API response:', response.data);

                let allTasks: Task[] = [];

                if (Array.isArray(response.data)) {
                    response.data.forEach((quiz: { tasks: Task[] }) => {
                        if (quiz && quiz.tasks && Array.isArray(quiz.tasks)) {
                            allTasks = [...allTasks, ...quiz.tasks];
                        }
                    });
                } else if (response.data && typeof response.data === 'object' && response.data.tasks) {
                    allTasks = response.data.tasks;
                }

                if (allTasks.length > 0 && allTasks.every(t => t.id && t.images?.length && t.options?.length && t.correctAnswers)) {
                    setTasks(allTasks);
                } else {
                    throw new Error('Invalid task data structure');
                }

                setLoading(false);
                console.log('Processed tasks:', allTasks);
            } catch (err: any) {
                console.error('Error fetching tasks:', err);
                setError('Failed to load tasks. Please try again.');
                setLoading(false);
            }
        };

        fetchTasks();

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

    // Timer effect
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
        if (!isTimerRunning) {
            setStartTime(new Date());
            setIsTimerRunning(true);
        }
    };

    const handleDragStart = (e: React.DragEvent, imageId: string) => {
        setDraggedImage(imageId);
        e.dataTransfer.setData("text/plain", imageId);
    };

    const handleDrop = (e: React.DragEvent, option: string) => {
        e.preventDefault();
        const imageId = draggedImage || e.dataTransfer.getData("text/plain");
        if (imageId && !droppedItems[option]) {
            setDroppedItems(prev => ({
                ...prev,
                [option]: imageId
            }));
        }
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    const calculateMarks = () => {
        const task = tasks[currentTaskIndex];
        const correctAnswers = task.correctAnswers;
        let correct = 0;

        task.options.forEach(option => {
            const userAnswer = droppedItems[option];
            const correctAnswer = correctAnswers[option];
            if (userAnswer === correctAnswer) {
                correct++;
            }
        });

        return correct;
    };

    const isComplete = Object.keys(droppedItems).length === tasks[currentTaskIndex]?.options.length;

    const handleCheckAnswer = () => {
        if (!isComplete || !isTimerRunning) return;

        const marks = calculateMarks();
        const taskResult = {
            taskId: tasks[currentTaskIndex].id,
            timeTaken: time,
            marks: marks
        };

        setResults(prev => {
            if (prev.some(r => r.taskId === taskResult.taskId)) return prev;
            return [...prev, taskResult];
        });

        setShowCurrentResult(true);
    };

    const handleNextActivity = () => {
        if (!isComplete || !showCurrentResult) return;

        if (currentTaskIndex < tasks.length - 1) {
            setCurrentTaskIndex(prev => prev + 1);
            setTime(0);
            setDroppedItems({});
            setShowCurrentResult(false);
        } else {
            setIsTimerRunning(false);
            setIsQuizCompleted(true);

            setResults(prev => {
                const finalResults = prev.some(r => r.taskId === tasks[currentTaskIndex].id)
                    ? prev
                    : [...prev, {
                        taskId: tasks[currentTaskIndex].id,
                        timeTaken: time,
                        marks: calculateMarks()
                    }];

                saveQuizResults(finalResults, totalTime);
                return finalResults;
            });
        }
    };

    const saveQuizResults = async (finalResults: { taskId: number; timeTaken: number; marks: number }[], finalTotalTime: number) => {
        if (!user || !userId || !username || !email) {
            setSaveStatus('Error: Please log in to submit quiz results.');
            return;
        }

        const totalMarks = finalResults.reduce((acc, r) => acc + r.marks, 0);

        try {
            const response = await axios.post('http://localhost:5000/api/v1/quizzes/saveQuizResults', {
                quizName: "KINESTHETIC",
                user,
                userId,
                username,
                email,
                totalMarks,
                totalTime: finalTotalTime,
                date: new Date().toISOString(),
                taskResults: finalResults
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setSaveStatus('✅ Quiz results saved successfully!');
            console.log('Quiz results saved:', response.data);
        } catch (error: any) {
            setSaveStatus('❌ Error saving quiz results. Please try again.');
            console.error('Error saving quiz results:', error.response?.data || error.message);
        }
    };

    const resetQuiz = () => {
        setCurrentTaskIndex(0);
        setTime(0);
        setTotalTime(0);
        setStartTime(null);
        setDroppedItems({});
        setResults([]);
        setIsTimerRunning(false);
        setIsQuizCompleted(false);
        setShowCurrentResult(false);
        setSaveStatus(null);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getScoreColor = (score: number) => {
        const totalPossibleMarks = tasks.length * 5;
        const percentage = (score / totalPossibleMarks) * 100;
        if (percentage >= 80) return "text-green-600";
        if (percentage >= 60) return "text-yellow-600";
        return "text-red-500";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">📚</div>
                    <p className="text-3xl text-white font-bold">Loading tasks...</p>
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

    if (!tasks || tasks.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center">
                <div className="text-center bg-white/90 rounded-3xl p-8 border-4 border-yellow-400">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-2xl text-purple-800 font-bold mb-4">No tasks available for this quiz.</p>
                    <Link to="/">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full">
                            Back to Home
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const task = tasks[currentTaskIndex];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 relative overflow-hidden">
            <div className="absolute top-10 left-10 text-4xl animate-bounce">🌟</div>
            <div className="absolute top-20 right-20 text-3xl animate-ping">⭐</div>
            <div className="absolute bottom-20 left-20 text-4xl animate-pulse">🎈</div>

            <Header />

            <div className="container mx-auto px-4 py-12">
                {saveStatus && (
                    <div className={`mb-4 p-4 rounded-lg ${saveStatus.includes('Error') || saveStatus.includes('❌') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {saveStatus}
                    </div>
                )}

                <div className="text-center mb-8">
                    <div className="relative">
                        <div className="text-6xl mb-4 animate-bounce">🧠</div>
                        <h1 className="text-6xl font-bold text-white mb-6 animate-pulse">
                            🪄 Test 2 - Kinesthetic Learning
                        </h1>
                    </div>
                    <div className="bg-white/90 rounded-3xl p-6 max-w-4xl mx-auto border-4 border-yellow-400 shadow-2xl">
                        <p className="text-2xl text-purple-800 font-bold mb-4">
                            Hi {username || 'Student'}! 👋 Let's test your drag and drop skills!
                        </p>
                        <p className="text-lg text-blue-700">
                            🌟 Drag the images to their correct positions! 🌟
                        </p>
                        <p className="text-md text-gray-600">
                            Task {currentTaskIndex + 1} of {tasks.length}
                            {isQuizCompleted && " - Quiz Completed!"}
                        </p>
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border-4 border-yellow-300">
                    {!isQuizCompleted ? (
                        <>
                            <div className="bg-white p-4 rounded-xl border-2 border-purple-300 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-lg font-bold text-purple-800">Progress</span>
                                    <span className="text-lg font-bold text-purple-800">
                                        {currentTaskIndex + 1} / {tasks.length}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-300"
                                        style={{ width: `${((currentTaskIndex + 1) / tasks.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <h2 className="text-3xl font-semibold text-center mb-2 text-purple-800">
                                Kinesthetic Test {task.id}
                            </h2>
                            <h3 className="text-xl font-medium text-center mb-6 text-blue-700">
                                Drag and Drop to correct Position
                            </h3>

                            <div className="border border-gray-400 flex justify-center gap-6 p-8 mb-6 bg-gray-50 rounded-xl overflow-x-auto">
                                {task.images.map((img) => (
                                    <div
                                        key={img.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, img.id)}
                                        className="w-52 h-52 flex items-center justify-center cursor-move hover:bg-blue-50 transition-colors border-2 border-gray-300 rounded-lg shadow-md hover:shadow-lg flex-shrink-0"
                                    >
                                        <img src={img.src} alt={img.id} className="w-52 h-52 object-contain" />
                                    </div>
                                ))}
                            </div>

                            <div className="text-center mb-6 bg-blue-100 p-4 rounded-xl">
                                <span className="text-2xl mr-6 font-bold text-blue-800">
                                    ⏱️ Total Time: {formatTime(totalTime)}
                                </span>
                                <span className="text-lg mr-6 text-gray-600">
                                    Current Task: {formatTime(time)}
                                </span>
                                <button
                                    onClick={handleStartTimer}
                                    disabled={isTimerRunning}
                                    className="bg-green-500 text-white px-6 py-3 rounded-full disabled:opacity-50 disabled:bg-gray-300 hover:bg-green-600 transition-colors font-bold text-lg"
                                >
                                    {isTimerRunning ? "⏰ Timer Running..." : "🚀 Start Now"}
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                {task.options.map((option, index) => (
                                    <div
                                        key={index}
                                        onDrop={(e) => handleDrop(e, option)}
                                        onDragOver={handleDragOver}
                                        className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 flex justify-between items-center rounded-xl border-2 border-dashed border-blue-300 hover:border-purple-400 transition-colors"
                                    >
                                        <span className="font-bold text-lg text-gray-800">
                                            {index + 1}. {option}
                                        </span>
                                        <div className="w-48 h-36 bg-white rounded-lg border border-gray-300 shadow-inner flex items-center justify-center">
                                            {droppedItems[option] ? (
                                                <img
                                                    src={task.images.find(img => img.id === droppedItems[option])?.src}
                                                    alt={droppedItems[option]}
                                                    className="w-40 h-32 object-contain"
                                                />
                                            ) : (
                                                <span className="text-gray-400 italic">Drop here</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {showCurrentResult && (
                                <div className="mt-6 p-6 rounded-xl border-2 bg-green-100 border-green-400">
                                    <p className="text-2xl font-bold text-green-800 mb-4">
                                        Task {currentTaskIndex + 1} Result
                                    </p>
                                    <p className={`text-xl font-bold ${getScoreColor(results.find(r => r.taskId === task.id)?.marks || 0)}`}>
                                        Score: {results.find(r => r.taskId === task.id)?.marks || 0} / 5
                                    </p>
                                    <p className="text-lg text-gray-700">
                                        Time: {formatTime(results.find(r => r.taskId === task.id)?.timeTaken || 0)}
                                    </p>
                                    <div className="mt-4">
                                        {task.options.map((option, index) => (
                                            <div
                                                key={index}
                                                className={`p-2 rounded mb-2 ${
                                                    droppedItems[option] === task.correctAnswers[option]
                                                        ? 'bg-green-200'
                                                        : 'bg-red-200'
                                                }`}
                                            >
                                                <p>{index + 1}. {option}</p>
                                                <p>
                                                    <strong>Your Answer:</strong> {droppedItems[option] || 'No answer'}
                                                </p>
                                                <p>
                                                    <strong>Correct Answer:</strong> {task.correctAnswers[option]}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-center gap-4 mt-10">
                                {showCurrentResult ? (
                                    <button
                                        onClick={handleNextActivity}
                                        className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 border-4 border-white"
                                    >
                                        {currentTaskIndex < tasks.length - 1 ? "Next Task ➡️" : "Finish Quiz 🎯"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleCheckAnswer}
                                        disabled={!isComplete || !isTimerRunning}
                                        className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none border-4 border-white"
                                    >
                                        Check Answer ➡️
                                    </button>
                                )}
                            </div>

                            <div className="mt-6 text-center bg-yellow-100 p-4 rounded-xl border-2 border-yellow-300">
                                <p className="text-lg text-yellow-800 font-semibold">
                                    💡 Drag all images to their correct positions to check your answer
                                </p>
                                {currentTaskIndex === tasks.length - 1 && !showCurrentResult && (
                                    <p className="text-lg text-green-800 font-bold mt-2">
                                        🎯 This is the final task. Check your answer before finishing!
                                    </p>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-4xl font-bold text-center text-purple-900 mb-4">
                                🎉 Congratulations! You completed all tasks!
                            </h2>
                            <div className="text-center mb-6">
                                <p className="text-xl font-semibold mb-2 text-green-800">
                                    Total Time Taken: {formatTime(totalTime)}
                                </p>
                                <p className="text-xl font-semibold text-green-800">
                                    Total Marks: {results.reduce((acc, r) => acc + r.marks, 0)} / {tasks.length * 5}
                                </p>
                            </div>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={resetQuiz}
                                    className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 border-4 border-white"
                                >
                                    🔄 Restart Quiz
                                </button>
                                <Link to="/">
                                    <button
                                        className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                        aria-label="Back to home"
                                    >
                                        <Home className="mr-3 h-5 w-5 inline" />
                                        Home
                                    </button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Kinesthetic;