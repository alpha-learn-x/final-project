import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Home,
    BookOpen,
    Target,
    Award,
    HelpCircle,
    ShoppingCart,
    Eye,
    Globe,
    Volume2,
    VolumeX
} from 'lucide-react';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header.tsx";

const ReadWrite = () => {
    const [language, setLanguage] = useState("english");
    const [isSoundEnabled, setIsSoundEnabled] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [saveStatus, setSaveStatus] = useState(null);

      const questions = [
        {
            id: 1,
            text: "What does the symbol 'V' represent in an electric circuit?",
            answer: "Voltage",
            options: ["Velocity", "Volume", "Voltage", "Vacuum"]
        },
        {
            id: 2,
            text: "What device converts electrical energy into light energy?",
            answer: "Light bulb",
            options: ["Motor", "Switch", "Light bulb", "Resistor"]
        },
        {
            id: 3,
            text: "Which of these is not a source of electricity?",
            answer: "Bulb",
            options: ["Battery", "Generator", "Solar panel", "Bulb"]
        },
        {
            id: 4,
            text: "What happens when a circuit is open?",
            answer: "Current does not flow",
            options: ["Current flows easily", "Light turns on", "Current does not flow", "Battery gets charged"]
        },
        {
            id: 5,
            text: "In which type of circuit does the current have more than one path to flow?",
            answer: "Parallel circuit",
            options: ["Open circuit", "Closed circuit", "Series circuit", "Parallel circuit"]
        },
    ];

    const [answers, setAnswers] = useState(Array(questions.length).fill(''));
    const [marks, setMarks] = useState(Array(questions.length).fill(0));
    const [totalMarks, setTotalMarks] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [user, setUser] = useState('');

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
        setUser(userData.id || '');
        setUserId(userData.userId || '');
        setUsername(userData.userName || '');
        setEmail(userData.email || '');
    }, []);

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else if (!isSubmitted) {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (!user || !userId || !username || !email) {
            setSaveStatus('Please log in to submit quiz results.');
            return;
        }

        const newMarks = answers.map((answer, index) =>
            answer.toLowerCase().trim() === questions[index].answer.toLowerCase() ? 1 : 0
        );
        const total = newMarks.reduce((sum, mark) => sum + mark, 0);
        setMarks(newMarks);
        setTotalMarks(total);
        setIsSubmitted(true);
        setShowResults(true);

        try {
            const response = await axios.post('http://localhost:5000/api/v1/quizzes/saveQuizResults', {
                quizName:"READANDWRITE",
                user,
                userId,
                username,
                email,
                totalMarks: total,
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
        setAnswers(Array(questions.length).fill(''));
        setMarks(Array(questions.length).fill(0));
        setTotalMarks(0);
        setIsSubmitted(false);
        setShowResults(false);
        setCurrentQuestionIndex(0);
        setSaveStatus(null);
    };

    const toggleSound = (): void => {
        console.log('toggleSound called');
        setIsSoundEnabled(prev => !prev);
    };

    const getEncouragementMessage = () => {
        const percentage = (totalMarks / questions.length) * 100;
        if (percentage === 100) return "🌟 Perfect! You're a Sri Lanka expert! 🌟";
        if (percentage >= 80) return "🎉 Excellent work! Almost perfect! 🎉";
        if (percentage >= 60) return "👍 Good job! Keep learning! 👍";
        if (percentage >= 40) return "😊 Nice try! Practice makes perfect! 😊";
        return "🌈 Don't worry! Learning is fun! Try again! 🌈";
    };

    const getScoreColor = () => {
        const percentage = (totalMarks / questions.length) * 100;
        if (percentage >= 80) return "text-green-600";
        if (percentage >= 60) return "text-yellow-600";
        return "text-red-500";
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 relative overflow-hidden">
            <div className="absolute top-10 left-10 text-4xl animate-bounce">🌟</div>
            <div className="absolute top-20 right-20 text-3xl animate-ping">⭐</div>
            <div className="absolute bottom-20 left-20 text-4xl animate-pulse">🎈</div>

            {/* Navigation Bar */}
            <Header></Header>
            {/* Navigation Bar */}

            <div className="container mx-auto px-4 py-12">
                {saveStatus && (
                    <div className={`mb-4 p-4 rounded-lg ${saveStatus.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {saveStatus}
                    </div>
                )}
                {showResults && (
                    <div className="mb-8 bg-white/95 rounded-3xl p-6 border-4 border-green-400 shadow-2xl">
                        <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                            <Eye className="mr-2 h-6 w-6" />
                            Quiz Results Dashboard
                        </h2>
                        {totalMarks === 0 ? (
                            <p className="text-gray-600">No results yet. Submit your answers to see your progress!</p>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-2 border-blue-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg text-purple-800">Sri Lanka Quiz Adventure</h3>
                                            <p className="text-sm text-gray-600">
                                                {new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-2xl font-bold ${getScoreColor()}`}>
                                                Score: {totalMarks} / {questions.length}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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
                            Hi {username || 'Student'}! 👋 Let's test your knowledge about Basic Electronics!
                        </p>
                        <p className="text-lg text-blue-700">
                            🌟 Answer the questions below and submit to see your score! 🌟
                        </p>
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border-4 border-yellow-300 flex-1 flex flex-col items-center">
                    {!showResults ? (
                        <div className="space-y-8 flex-1 w-full">
                            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 border-2 border-dashed border-blue-300 transform hover:scale-105 transition-all duration-300">
                                <div className="flex items-center mb-4 justify-center">
                                    <span className="text-4xl mr-4">📝</span>
                                    <p className="text-2xl font-bold text-purple-800 text-center">
                                        Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex].text}
                                    </p>
                                </div>
                                <input
                                    type="text"
                                    value={answers[currentQuestionIndex]}
                                    onChange={(e) => handleAnswerChange(currentQuestionIndex, e.target.value)}
                                    className="w-full p-6 border-3 border-yellow-400 rounded-xl text-2xl bg-gradient-to-r from-yellow-100 to-orange-100 focus:outline-none focus:ring-4 focus:ring-pink-400 focus:border-pink-400 text-center font-semibold placeholder-gray-500 transition-all duration-300"
                                    placeholder="✨ Type your answer here! ✨"
                                    disabled={isSubmitted}
                                />
                                <div className="mt-6 bg-white/70 rounded-lg p-6 border-2 border-dashed border-blue-300">
                                    <p className="text-lg font-bold text-indigo-700 mb-4 text-center">
                                        💡 Choose from these options:
                                    </p>
                                    <div className="flex flex-wrap gap-3 justify-center">
                                        {questions[currentQuestionIndex].options.map((option, optionIndex) => (
                                            <span
                                                key={optionIndex}
                                                className="bg-gradient-to-r from-pink-200 to-purple-200 px-4 py-2 rounded-full text-lg font-medium text-purple-800 border-2 border-purple-300"
                                            >
                                                {option}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-base text-gray-600 mt-4 text-center">
                                        ✍️ Look at the options and type your answer above!
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-center mt-10">
                                <button
                                    onClick={handleNext}
                                    disabled={!answers[currentQuestionIndex] || isSubmitted}
                                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none border-4 border-white"
                                >
                                    {currentQuestionIndex < questions.length - 1 ? ' Next! ' : ' Submit My Answers! '}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-8 flex-1 w-full max-w-3xl">
                            <div className="bg-gradient-to-r from-yellow-200 to-pink-200 rounded-2xl p-8 border-4 border-yellow-400">
                                <h2 className="text-5xl font-bold text-purple-800 mb-6">🎊 Quiz Results! 🎊</h2>
                                <div className={`text-8xl font-bold mb-6 ${getScoreColor()}`}>
                                    {totalMarks} / {questions.length}
                                </div>
                                <div className="text-3xl font-bold text-indigo-700 mb-4">
                                    {getEncouragementMessage()}
                                </div>
                            </div>

                            <div className="space-y-6 flex-1 overflow-y-auto w-full">
                                {questions.map((question, index) => (
                                    <div key={question.id} className={`p-6 rounded-xl border-2 ${marks[index] === 1 ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'} text-center`}>
                                        <p className="font-semibold text-gray-800 text-xl mb-3">Q{index + 1}: {question.text}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
                                            <div className="text-lg">
                                                <strong>Your answer:</strong> {answers[index] || 'No answer'}
                                            </div>
                                            <div className="text-lg">
                                                <strong>Correct answer:</strong> {question.answer}
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            {marks[index] === 1 ? (
                                                <span className="text-green-600 font-bold text-xl">✅ Correct!</span>
                                            ) : (
                                                <span className="text-red-600 font-bold text-xl">❌ Incorrect</span>
                                            )}
                                        </div>
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