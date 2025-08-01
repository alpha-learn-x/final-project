import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import axios from 'axios';
import Header from "@/components/Header.tsx";

// Define types for the question structure
interface Question {
    id: number;
    scenario: string;
    steps: string[];
    correctOrder: number[];
}

// Define type for the full quiz document
interface Quiz {
    _id: string;
    quizName: string;
    questions: Question[];
    createdAt: string;
    __v: number;
}

// Define types for user data
interface UserData {
    id?: string;
    userId?: string;
    userName?: string;
    email?: string;
}

const ReadWrite: React.FC = () => {
    const [language] = useState("english");
    const [isSoundEnabled] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);
    const [time, setTime] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [stepsOrder, setStepsOrder] = useState<string[]>(Array(5).fill(''));
    const [marks, setMarks] = useState<number[]>([]);
    const [totalMarks, setTotalMarks] = useState<number>(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showCurrentResult, setShowCurrentResult] = useState(false);
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [user, setUser] = useState('');
    const [quizName, setQuizName] = useState<string>('READWRITE');
    const [questions, setQuestions] = useState<Question[]>([]); // Changed to store all questions
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [questionTimes, setQuestionTimes] = useState<number[]>([]);
    const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
    const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
    const [totalTimeSpent, setTotalTimeSpent] = useState(0);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/quizzes/readandwrite/questions');
                console.log('Raw API response:', response.data);

                let allQuestions: Question[] = [];

                if (Array.isArray(response.data)) {
                    // If response is an array of quizzes, combine all questions
                    response.data.forEach((quiz: Quiz) => {
                        if (quiz && quiz.questions && Array.isArray(quiz.questions)) {
                            allQuestions = [...allQuestions, ...quiz.questions];
                        }
                    });
                } else if (response.data && typeof response.data === 'object' && response.data.questions) {
                    // If response is a single quiz object
                    allQuestions = response.data.questions;
                }

                // Validate the combined questions
                if (allQuestions.length > 0 && allQuestions.every(q => q.scenario && Array.isArray(q.steps) && Array.isArray(q.correctOrder))) {
                    setQuestions(allQuestions);
                    setMarks(Array(allQuestions.length).fill(0));
                    setQuestionTimes(Array(allQuestions.length).fill(0));
                    setQuizStartTime(Date.now());
                    setQuestionStartTime(Date.now());
                } else {
                    throw new Error('Invalid quiz data structure');
                }

                setLoading(false);
                console.log('Processed questions:', allQuestions);
            } catch (err: any) {
                console.error('Error fetching quiz:', err);
                setError('Failed to load quiz. Please try again.');
                setLoading(false);
            }
        };

        fetchQuestions();

        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                const userData: UserData = JSON.parse(storedUser);
                setUser(userData.id || '');
                setUserId(userData.userId || '');
                setUsername(userData.userName || '');
                setEmail(userData.email || '');
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isTimerRunning) {
            timer = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isTimerRunning]);

    const handleStartTimer = () => {
        if (!isTimerRunning) {
            setIsTimerRunning(true);
            setQuizStartTime(Date.now());
            setQuestionStartTime(Date.now());
        }
    };

    const handleOrderChange = (index: number, value: string) => {
        const newOrder = [...stepsOrder];
        const numValue = parseInt(value, 10);

        for (let i = 0; i < newOrder.length; i++) {
            if (newOrder[i] === value && i !== index) {
                newOrder[i] = '';
            }
        }

        if (numValue >= 1 && numValue <= 5) {
            newOrder[index] = value;
        } else if (value === '') {
            newOrder[index] = '';
        }

        setStepsOrder(newOrder);
    };

    const calculateMarksForCurrent = () => {
        if (!questions || !questions[currentQuestionIndex]) {
            return 0;
        }

        const userOrder = stepsOrder.map(val => parseInt(val) - 1).filter(val => !isNaN(val));
        const currentQuestion = questions[currentQuestionIndex];
        let correct = 0;

        if (userOrder.length === 5) {
            for (let i = 0; i < 5; i++) {
                if (userOrder[i] === currentQuestion.correctOrder[i]) {
                    correct++;
                }
            }
        }

        return correct;
    };

    const handleNext = () => {
        if (!isTimerRunning || !questions || stepsOrder.filter(val => val).length !== 5) return;

        const currentTime = Date.now();
        const timeSpent = Math.floor((currentTime - (questionStartTime || 0)) / 1000);
        const newQuestionTimes = [...questionTimes];
        newQuestionTimes[currentQuestionIndex] = timeSpent;
        setQuestionTimes(newQuestionTimes);

        const newMarks = [...marks];
        newMarks[currentQuestionIndex] = calculateMarksForCurrent();
        setMarks(newMarks);

        setShowCurrentResult(true);
    };

    const proceedToNextQuestion = () => {
        if (!questions) return;

        if (currentQuestionIndex < questions.length - 1) {
            setStepsOrder(Array(5).fill(''));
            setCurrentQuestionIndex(prev => prev + 1);
            setQuestionStartTime(Date.now());
            setShowCurrentResult(false);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (!questions || isSubmitted) return;

        const currentTime = Date.now();
        const timeSpent = Math.floor((currentTime - (questionStartTime || 0)) / 1000);
        const newQuestionTimes = [...questionTimes];
        newQuestionTimes[currentQuestionIndex] = timeSpent;
        setQuestionTimes(newQuestionTimes);

        const newMarks = [...marks];
        newMarks[currentQuestionIndex] = calculateMarksForCurrent();
        setMarks(newMarks);

        calculateMarks(newMarks);
    };

    const calculateMarks = async (finalMarks: number[]) => {
        if (!user || !userId || !username || !email) {
            setSaveStatus('Please log in to submit quiz results.');
            return;
        }

        const total = finalMarks.reduce((sum, mark) => sum + mark, 0);
        const currentTime = Date.now();
        const totalTime = Math.floor((currentTime - (quizStartTime || 0)) / 1000);

        setTotalMarks(total);
        setTotalTimeSpent(totalTime);
        setIsSubmitted(true);
        setIsTimerRunning(false);
        setShowResults(true);

        const totelquizes = questions.length;

        const quizData = {
            quizName,
            user,
            userId,
            username,
            email,
            participatedQuestions: totelquizes,
            totalMarks: total,
            totalTime: totalTime,
            date: new Date().toISOString()
        };

        try {
            const response = await axios.post('http://localhost:5000/api/v1/quizzes/saveQuizResults', quizData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000
            });

            if (response.status === 200 || response.status === 201) {
                setSaveStatus('✅ Quiz results saved successfully!');
            } else {
                setSaveStatus('Quiz completed! (Unexpected response from server)');
            }
        } catch (error: any) {
            setSaveStatus('❌ Error saving quiz results. Please try again.');
            console.error('Error saving quiz results:', error.response?.data || error.message);
        }
    };

    const resetQuiz = () => {
        if (!questions) return;

        setStepsOrder(Array(5).fill(''));
        setMarks(Array(questions.length).fill(0));
        setQuestionTimes(Array(questions.length).fill(0));
        setTotalMarks(0);
        setTotalTimeSpent(0);
        setIsSubmitted(false);
        setShowResults(false);
        setShowCurrentResult(false);
        setTime(0);
        setIsTimerRunning(false);
        setSaveStatus(null);
        setCurrentQuestionIndex(0);
        setQuizStartTime(Date.now());
        setQuestionStartTime(Date.now());
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getEncouragementMessage = () => {
        if (!questions) return "";

        const totalPossibleMarks = questions.length * 5;
        const totalPercentage = (totalMarks / totalPossibleMarks) * 100;

        if (totalPercentage === 100) return "🌟 Perfect! You're a sequencing master! 🌟";
        if (totalPercentage >= 80) return "🎉 Excellent work! Almost perfect! 🎉";
        if (totalPercentage >= 60) return "👍 Good job! Keep practicing! 👍";
        if (totalPercentage >= 40) return "😊 Nice try! Practice makes perfect! 😊";
        return "🌈 Don't worry! Learning is fun! Try again! 🌈";
    };

    const getScoreColor = (score: number = totalMarks) => {
        if (!questions) return "text-gray-500";

        const totalPossibleMarks = questions.length * 5;
        const totalPercentage = (score / totalPossibleMarks) * 100;

        if (totalPercentage >= 80) return "text-green-600";
        if (totalPercentage >= 60) return "text-yellow-600";
        return "text-red-500";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">📚</div>
                    <p className="text-3xl text-white font-bold">Loading quiz...</p>
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

    if (!questions || questions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center">
                <div className="text-center bg-white/90 rounded-3xl p-8 border-4 border-yellow-400">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-2xl text-purple-800 font-bold mb-4">No questions available for this quiz.</p>
                    <Link to="/">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full">
                            Back to Home
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

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

                {quizStartTime && !isSubmitted && (
                    <div className="bg-white/90 rounded-xl p-4 mb-4 text-center">
                        <p className="text-lg font-semibold text-purple-800">
                            ⏱️ Time Elapsed: {formatTime(Math.floor((Date.now() - quizStartTime) / 1000))}
                        </p>
                    </div>
                )}

                <div className="text-center mb-16">
                    <div className="relative">
                        <div className="text-6xl mb-4 animate-bounce">🧠</div>
                        <h1 className="text-6xl font-bold text-white mb-6 animate-pulse">
                            🪄 {quizName} - Read and Write
                        </h1>
                        <div className="absolute -top-8 -left-8 text-5xl animate-spin">⭐</div>
                        <div className="absolute -top-8 -right-8 text-5xl animate-spin">⭐</div>
                    </div>
                    <div className="bg-white/90 rounded-3xl p-6 max-w-4xl mx-auto border-4 border-yellow-400 shadow-2xl">
                        <p className="text-2xl text-purple-800 font-bold mb-4">
                            Hi {username || 'Student'}! 👋 Welcome to the Read and Write Quiz!
                        </p>
                        <p className="text-lg text-blue-700">
                            🌟 Put the steps in the correct order to help complete each scenario! 🌟
                        </p>
                        <p className="text-md text-gray-600">
                            Question {currentQuestionIndex + 1} of {questions.length}
                            {isSubmitted && " - Quiz Completed!"}
                        </p>
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border-4 border-yellow-300 flex-1 flex flex-col items-center">
                    {!showResults ? (
                        <div className="space-y-8 flex-1 w-full">
                            <div className="bg-white p-4 rounded-xl border-2 border-purple-300 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-lg font-bold text-purple-800">Progress</span>
                                    <span className="text-lg font-bold text-purple-800">
                                        {currentQuestionIndex + 1} / {questions.length}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-300"
                                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 border-2 border-dashed border-blue-300">
                                <div className="mb-6 text-center">
                                    <h2 className="text-3xl font-bold text-purple-800 bg-yellow-200 p-4 rounded-lg inline-block">
                                        Scenario: {currentQuestion.scenario}
                                    </h2>
                                </div>
                                <div className="flex items-center mb-4 justify-center">
                                    <span className="text-4xl mr-4">📝</span>
                                    <p className="text-2xl font-bold text-purple-800 text-center">
                                        Put (1-5) Numbers in correct order in the given boxes
                                    </p>
                                </div>
                                <div className="mt-6 space-y-4">
                                    {currentQuestion.steps.map((step: string, index: number) => (
                                        <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm">
                                            <input
                                                type="number"
                                                min="1"
                                                max="5"
                                                value={stepsOrder[index]}
                                                onChange={(e) => handleOrderChange(index, e.target.value)}
                                                className="w-16 p-3 border-2 border-yellow-400 rounded-lg text-center font-bold text-lg"
                                                disabled={isSubmitted || showCurrentResult}
                                                placeholder="?"
                                            />
                                            <p className="text-lg text-gray-700 flex-1">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {showCurrentResult && (
                                <div className="mt-6 p-6 rounded-xl border-2 bg-green-100 border-green-400">
                                    <p className="text-2xl font-bold text-green-800 mb-4">
                                        Question {currentQuestionIndex + 1} Result
                                    </p>
                                    <p className={`text-xl font-bold ${getScoreColor(marks[currentQuestionIndex])}`}>
                                        Score: {marks[currentQuestionIndex]} / 5
                                    </p>
                                    <p className="text-lg text-gray-700">
                                        Time: {formatTime(questionTimes[currentQuestionIndex] || 0)}
                                    </p>
                                    <div className="mt-4">
                                        {currentQuestion.steps.map((step: string, stepIndex: number) => (
                                            <div
                                                key={stepIndex}
                                                className={`p-2 rounded mb-2 ${
                                                    parseInt(stepsOrder[stepIndex]) - 1 === currentQuestion.correctOrder[stepIndex]
                                                        ? 'bg-green-200'
                                                        : 'bg-red-200'
                                                }`}
                                            >
                                                <p>Step {stepIndex + 1}: {step}</p>
                                                <p>
                                                    <strong>Your Order:</strong> {stepsOrder[stepIndex] || 'No order'}
                                                </p>
                                                <p>
                                                    <strong>Correct Order:</strong> {currentQuestion.correctOrder[stepIndex] + 1}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="text-center mb-6 bg-blue-100 p-6 rounded-xl">
                                <div className="mb-4">
                                    <span className="text-3xl mr-6 font-bold text-blue-800">
                                        ⏱️ Time: {formatTime(time)}
                                    </span>
                                </div>
                                <button
                                    onClick={handleStartTimer}
                                    disabled={isTimerRunning}
                                    className="bg-green-500 text-white px-8 py-4 rounded-full disabled:opacity-50 disabled:bg-gray-300 hover:bg-green-600 transition-colors font-bold text-xl"
                                >
                                    {isTimerRunning ? "⏰ Timer Running..." : "🚀 Start Quiz"}
                                </button>
                            </div>

                            <div className="flex justify-center gap-4 mt-10">
                                {showCurrentResult ? (
                                    <button
                                        onClick={proceedToNextQuestion}
                                        className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 border-4 border-white"
                                    >
                                        {currentQuestionIndex < questions.length - 1 ? "Next Question ➡️" : "Submit Quiz 🎯"}
                                    </button>
                                ) : currentQuestionIndex < questions.length - 1 ? (
                                    <button
                                        onClick={handleNext}
                                        disabled={!isTimerRunning || stepsOrder.filter(val => val).length !== 5}
                                        className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none border-4 border-white"
                                    >
                                        Check Answer ➡️
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleNext}
                                        disabled={!isTimerRunning || stepsOrder.filter(val => val).length !== 5 || isSubmitted}
                                        className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none border-4 border-white animate-pulse"
                                    >
                                        Check Answer 🎯
                                    </button>
                                )}
                            </div>

                            <div className="mt-6 text-center bg-yellow-100 p-4 rounded-xl border-2 border-yellow-300">
                                <p className="text-lg text-yellow-800 font-semibold">
                                    💡 Fill all 5 boxes with numbers 1-5 to check your answer
                                </p>
                                {currentQuestionIndex === questions.length - 1 && !showCurrentResult && (
                                    <p className="text-lg text-green-800 font-bold mt-2">
                                        🎯 This is the final question. Check your answer before submitting!
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-8 flex-1 w-full max-w-4xl">
                            <div className="bg-gradient-to-r from-yellow-200 to-pink-200 rounded-2xl p-8 border-4 border-yellow-400">
                                <h2 className="text-5xl font-bold text-purple-800 mb-6">🎊 Quiz Results! 🎊</h2>
                                <div className={`text-8xl font-bold mb-6 ${getScoreColor()}`}>
                                    {totalMarks} / {questions.length * 5}
                                </div>
                                <div className="text-3xl font-bold text-indigo-700 mb-4">
                                    {getEncouragementMessage()}
                                </div>
                                <div className="text-xl text-gray-700">
                                    ⏱️ Total Time: {formatTime(totalTimeSpent)}
                                </div>
                            </div>

                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {questions.map((question: Question, index: number) => {
                                    const timeSpent = questionTimes[index] || 0;
                                    const questionMarks = marks[index] || 0;

                                    return (
                                        <div key={index} className={`p-6 rounded-xl border-2 ${questionMarks === 5 ? 'bg-green-100 border-green-400' : questionMarks >= 3 ? 'bg-yellow-100 border-yellow-400' : 'bg-red-100 border-red-400'}`}>
                                            <p className="font-semibold text-gray-800 text-lg mb-2">
                                                Question {index + 1}: {question.scenario}
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <p className={`text-lg font-bold ${questionMarks === 5 ? 'text-green-600' : questionMarks >= 3 ? 'text-yellow-600' : 'text-red-500'}`}>
                                                    Score: {questionMarks} / 5
                                                </p>
                                                <p className="text-lg text-gray-700">
                                                    Time: {formatTime(timeSpent)}
                                                </p>
                                            </div>
                                            <div className="mt-4">
                                                {question.steps.map((step: string, stepIndex: number) => (
                                                    <div
                                                        key={stepIndex}
                                                        className={`p-2 rounded mb-2 ${
                                                            parseInt(stepsOrder[stepIndex]) - 1 === question.correctOrder[stepIndex]
                                                                ? 'bg-green-200'
                                                                : 'bg-red-200'
                                                        }`}
                                                    >
                                                        <p>Step {stepIndex + 1}: {step}</p>
                                                        <p>
                                                            <strong>Your Order:</strong> {stepsOrder[stepIndex] || 'No order'}
                                                        </p>
                                                        <p>
                                                            <strong>Correct Order:</strong> {question.correctOrder[stepIndex] + 1}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={resetQuiz}
                                    className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 border-4 border-white"
                                >
                                    🔄 Try Again! 🔄
                                </button>
                                <Link to="/">
                                    <button
                                        className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                        aria-label="Back to home"
                                    >
                                        <Home className="mr-3 h-5 w-5 inline" />
                                        🏠 Home
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

export default ReadWrite;