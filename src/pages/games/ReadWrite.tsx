import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import axios from 'axios';
import Header from "@/components/Header.tsx";

const ReadWrite = () => {
    const [language, setLanguage] = useState("english");
    const [isSoundEnabled, setIsSoundEnabled] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [saveStatus, setSaveStatus] = useState(null);
    const [time, setTime] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [stepsOrder, setStepsOrder] = useState(Array(5).fill(''));
    const [marks, setMarks] = useState(Array(5).fill(0)); // Marks for each question
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [user, setUser] = useState('');

    const questions = [
        {
            id: 1,
            scenario: "Help Ruwan to light up a small bulb using a battery and wires.",
            steps: [
                "Ruwan connects one end of the wire to the battery's (+) terminal and the other to the bulb's metal base.",
                "The bulb lights up brightly, and Ruwan is happy!",
                "Ruwan checks that all connections are secure and touching the metal parts.",
                "He connects the other end of the second wire to the battery's (-) terminal and other to the bulb's metal side of the bulb.",
                "Ruwan collects a small bulb, a battery, and two wires."
            ],
            correctOrder: [4, 0, 2, 3, 1]
        },
        {
            id: 2,
            scenario: "Assist Ruwan in building a simple circuit with a switch.",
            steps: [
                "Ruwan connects the switch to the circuit.",
                "The circuit works, and the bulb lights up.",
                "Ruwan tests the switch to ensure it turns the bulb on and off.",
                "He connects the wire from the battery to the bulb.",
                "Ruwan gathers a bulb, battery, wires, and a switch."
            ],
            correctOrder: [4, 3, 0, 2, 1]
        },
        {
            id: 3,
            scenario: "Guide Ruwan to set up a series circuit.",
            steps: [
                "Ruwan connects the second bulb to the first bulb.",
                "The bulbs light up in sequence.",
                "He connects the battery to the first bulb.",
                "Ruwan checks all connections for tightness.",
                "Ruwan collects two bulbs, a battery, and wires."
            ],
            correctOrder: [4, 2, 0, 3, 1]
        },
        {
            id: 4,
            scenario: "Help Ruwan create a parallel circuit.",
            steps: [
                "Ruwan connects the second bulb parallel to the first.",
                "Both bulbs light up independently.",
                "He connects the battery to the first bulb.",
                "Ruwan ensures all wires are secure.",
                "Ruwan gathers two bulbs, a battery, and wires."
            ],
            correctOrder: [4, 2, 0, 3, 1]
        },
        {
            id: 5,
            scenario: "Assist Ruwan in troubleshooting a circuit.",
            steps: [
                "Ruwan replaces a broken wire.",
                "The bulb lights up after fixing.",
                "He checks for loose connections.",
                "Ruwan notices the bulb is not lighting.",
                "Ruwan gathers tools and inspects the circuit."
            ],
            correctOrder: [4, 3, 2, 0, 1]
        }
    ];

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
        setUser(userData.id || '');
        setUserId(userData.userId || '');
        setUsername(userData.userName || '');
        setEmail(userData.email || '');
    }, []);

    useEffect(() => {
        let timer;
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
        }
    };

    const handleOrderChange = (index, value) => {
        const newOrder = [...stepsOrder];
        const numValue = parseInt(value, 10);
        if (numValue >= 1 && numValue <= 5 && !newOrder.includes(value)) {
            newOrder[index] = value;
            setStepsOrder(newOrder);
        }
    };

    const calculateMarksForCurrent = () => {
        const userOrder = stepsOrder.map(val => parseInt(val) - 1).filter(val => !isNaN(val));
        const currentQuestion = questions[currentQuestionIndex];
        let correct = 0;
        for (let i = 0; i < 5; i++) {
            if (userOrder[i] === currentQuestion.correctOrder[i]) correct++;
        }
        return correct;
    };

    const handleNext = () => {
        if (!isTimerRunning) return;
        if (currentQuestionIndex < questions.length - 1 && !isSubmitted) {
            const newMarks = [...marks];
            newMarks[currentQuestionIndex] = calculateMarksForCurrent();
            setMarks(newMarks);
            setStepsOrder(Array(5).fill(''));
            setCurrentQuestionIndex(prev => prev + 1);
        } else if (!isSubmitted) {
            const newMarks = [...marks];
            newMarks[currentQuestionIndex] = calculateMarksForCurrent();
            setMarks(newMarks);
            const totalMarks = newMarks.reduce((sum, mark) => sum + mark, 0);
            setIsSubmitted(true);
            setShowResults(true);
            if (user && userId && username && email) {
                saveQuizResults(totalMarks, time);
            } else {
                setSaveStatus('Please log in to submit quiz results.');
            }
        }
    };

    const saveQuizResults = async (totalMarks, finalTime) => {
        try {
            const response = await axios.post('http://localhost:5000/api/v1/quizzes/saveQuizResults', {
                quizName: "READANDWRITE",
                user,
                userId,
                username,
                email,
                totalMarks: totalMarks,
                totalTime: finalTime,
                date: new Date().toISOString()
            });
            setSaveStatus('Quiz results saved successfully!');
            console.log('Quiz results saved:', response.data);
        } catch (error) {
            setSaveStatus('Error saving quiz results. Please try again.');
            console.error('Error saving quiz results:', error.response?.data || error.message);
        }
    };

    const resetQuiz = () => {
        setStepsOrder(Array(5).fill(''));
        setMarks(Array(5).fill(0));
        setIsSubmitted(false);
        setShowResults(false);
        setTime(0);
        setIsTimerRunning(false);
        setSaveStatus(null);
        setCurrentQuestionIndex(0);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getEncouragementMessage = () => {
        const totalPercentage = (marks.reduce((sum, mark) => sum + mark, 0) / (questions.length * 5)) * 100;
        if (totalPercentage === 100) return "🌟 Perfect! You're a sequencing master! 🌟";
        if (totalPercentage >= 80) return "🎉 Excellent work! Almost perfect! 🎉";
        if (totalPercentage >= 60) return "👍 Good job! Keep practicing! 👍";
        if (totalPercentage >= 40) return "😊 Nice try! Practice makes perfect! 😊";
        return "🌈 Don't worry! Learning is fun! Try again! 🌈";
    };

    const getScoreColor = () => {
        const totalPercentage = (marks.reduce((sum, mark) => sum + mark, 0) / (questions.length * 5)) * 100;
        if (totalPercentage >= 80) return "text-green-600";
        if (totalPercentage >= 60) return "text-yellow-600";
        return "text-red-500";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 relative overflow-hidden">
            <div className="absolute top-10 left-10 text-4xl animate-bounce">🌟</div>
            <div className="absolute top-20 right-20 text-3xl animate-ping">⭐</div>
            <div className="absolute bottom-20 left-20 text-4xl animate-pulse">🎈</div>

            <Header></Header>

            <div className="container mx-auto px-4 py-12">
                {saveStatus && (
                    <div className={`mb-4 p-4 rounded-lg ${saveStatus.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {saveStatus}
                    </div>
                )}
                {showResults && (
                    <div className="mb-8 bg-white/95 rounded-3xl p-6 border-4 border-green-400 shadow-2xl">
                        <h2 className="text-2xl font-bold text-green-800 mb-4">Quiz Results</h2>
                        <div className={`text-4xl font-bold mb-6 ${getScoreColor()}`}>
                            Total Score: {marks.reduce((sum, mark) => sum + mark, 0)} / {questions.length * 5}
                        </div>
                        <p className="text-2xl font-bold text-indigo-700 mb-4">
                            {getEncouragementMessage()}
                        </p>
                        {questions.map((question, index) => (
                            <div key={index} className="p-4 bg-gray-100 rounded-lg mb-2">
                                <p className="font-semibold">Question {index + 1}: {question.scenario}</p>
                                <p>Score: {marks[index]} / 5</p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mb-16">
                    <div className="relative">
                        <div className="text-6xl mb-4 animate-bounce">🧠</div>
                        <h1 className="text-6xl font-bold text-white mb-6 animate-pulse">
                            🪄 Test 1 - Read and Write
                        </h1>
                        <div className="absolute -top-8 -left-8 text-5xl animate-spin">⭐</div>
                        <div className="absolute -top-8 -right-8 text-5xl animate-spin">⭐</div>
                    </div>
                    <div className="bg-white/90 rounded-3xl p-6 max-w-4xl mx-auto border-4 border-yellow-400 shadow-2xl">
                        <p className="text-2xl text-purple-800 font-bold mb-4">
                            Hi {username || 'Student'}! 👋 {questions[currentQuestionIndex].scenario}
                        </p>
                        <p className="text-lg text-blue-700">
                            🌟 Put the steps in the correct order to help Ruwan succeed! 🌟
                        </p>
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border-4 border-yellow-300 flex-1 flex flex-col items-center">
                    {!showResults ? (
                        <div className="space-y-8 flex-1 w-full">
                            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 border-2 border-dashed border-blue-300">
                                <div className="mb-6 text-center">
                                    <h2 className="text-3xl font-bold text-purple-800 bg-yellow-200 p-4 rounded-lg inline-block">
                                        Scenario: {questions[currentQuestionIndex].scenario}
                                    </h2>
                                </div>
                                <div className="flex items-center mb-4 justify-center">
                                    <span className="text-4xl mr-4">📝</span>
                                    <p className="text-2xl font-bold text-purple-800 text-center">
                                        Put (1-5) Numbers in correct order to the given box
                                    </p>
                                </div>
                                <div className="mt-6 space-y-4">
                                    {questions[currentQuestionIndex].steps.map((step, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <input
                                                type="number"
                                                min="1"
                                                max="5"
                                                value={stepsOrder[index]}
                                                onChange={(e) => handleOrderChange(index, e.target.value)}
                                                className="w-16 p-2 border-2 border-yellow-400 rounded-lg text-center"
                                                disabled={isSubmitted}
                                            />
                                            <p className="text-lg text-gray-700">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="text-center mb-6 bg-blue-100 p-4 rounded-xl">
                                <span className="text-2xl mr-6 font-bold text-blue-800">
                                    ⏱️ Time: {formatTime(time)}
                                </span>
                                <button
                                    onClick={handleStartTimer}
                                    disabled={isTimerRunning}
                                    className="bg-green-500 text-white px-6 py-3 rounded-full disabled:opacity-50 disabled:bg-gray-300 hover:bg-green-600 transition-colors font-bold text-lg"
                                >
                                    {isTimerRunning ? "⏰ Timer Running..." : "🚀 Start Now"}
                                </button>
                            </div>

                            <div className="flex justify-center mt-10">
                                <button
                                    onClick={handleNext}
                                    disabled={!isTimerRunning || stepsOrder.filter(val => val).length !== 5 || isSubmitted}
                                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none border-4 border-white"
                                >
                                    {currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-8 flex-1 w-full max-w-3xl">
                            <div className="bg-gradient-to-r from-yellow-200 to-pink-200 rounded-2xl p-8 border-4 border-yellow-400">
                                <h2 className="text-5xl font-bold text-purple-800 mb-6">🎊 Quiz Results! 🎊</h2>
                                <div className={`text-8xl font-bold mb-6 ${getScoreColor()}`}>
                                    {marks.reduce((sum, mark) => sum + mark, 0)} / {questions.length * 5}
                                </div>
                                <div className="text-3xl font-bold text-indigo-700 mb-4">
                                    {getEncouragementMessage()}
                                </div>
                            </div>

                            <div className="space-y-6 flex-1 overflow-y-auto w-full">
                                {questions.map((question, index) => (
                                    <div key={index} className="p-6 rounded-xl border-2 bg-gray-100 text-center">
                                        <p className="font-semibold text-gray-800 text-xl mb-3">Question {index + 1}: {question.scenario}</p>
                                        <div className="grid grid-cols-1 gap-4 justify-items-center">
                                            {question.steps.map((step, stepIndex) => (
                                                <div key={stepIndex} className={`p-2 rounded ${question.correctOrder[stepIndex] === parseInt(stepsOrder[stepIndex]) - 1 ? 'bg-green-100' : 'bg-red-100'}`}>
                                                    <p>Step {stepIndex + 1}: {step}</p>
                                                    <p><strong>Your order:</strong> {stepsOrder[stepIndex] || 'No order'}</p>
                                                    <p><strong>Correct order:</strong> {question.correctOrder[stepIndex] + 1}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="mt-2">Score: {marks[index]} / 5</p>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={resetQuiz}
                                className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 border-4 border-white"
                            >
                                🔄 Try Again! 🔄
                            </button>
                        </div>
                    )}
                </div>

                <div className="text-center mt-8">
                    <Link to="/">
                        <button
                            className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            aria-label="Back to home"
                        >
                            <Home className="mr-3 h-5 w-5" />
                            🏠 Home
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ReadWrite;