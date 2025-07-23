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

// Define types for the question structure
interface Question {
    id: number;
    text: string;
    correctAnswer: string;
    options: string[];
}

// Define types for user data
interface UserData {
    id?: string;
    userId?: string;
    userName?: string;
    email?: string;
}

const DragAndDrop: React.FC = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<string[]>(Array(5).fill(''));
    const [marks, setMarks] = useState<number[]>(Array(5).fill(0));
    const [totalMarks, setTotalMarks] = useState<number>(0);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [user, setUser] = useState<string>('');
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [dragError, setDragError] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState<boolean>(false);
    const [language, setLanguage] = useState<string>("english");
    const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(false);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const questions: Question[] = [
        {
            id: 1,
            text: "A complete path for current to flow is called a:",
            correctAnswer: "Circuit",
            options: ["Break", "Wire", "Circuit", "Loop"]
        },
        {
            id: 2,
            text: "What device is used to protect a circuit from too much current?",
            correctAnswer: "Fuse",
            options: ["Switch", "Bulb", "Fuse", "Battery"]
        },
        {
            id: 3,
            text: "What does a resistor do in a circuit?",
            correctAnswer: "Resists the flow of current",
            options: ["Stores energy", "Allows free flow of current", "Resists the flow of current", "Changes voltage to current"]
        },
        {
            id: 4,
            text: "Which symbol is used for a battery in a circuit diagram?",
            correctAnswer: "A short and a long line",
            options: ["Circle with a cross", "A short and a long line", "Stores energy", "Allows free flow of current"]
        },
        {
            id: 5,
            text: "What kind of circuit has only one path for current to flow?",
            correctAnswer: "Series circuit",
            options: ["Parallel circuit", "Mixed circuit", "Series circuit", "Open circuit"]
        },
    ];

    useEffect(() => {
        const userData: UserData = JSON.parse(localStorage.getItem('currentUser') || '{}');
        setUser(userData.id || '');
        setUserId(userData.userId || '');
        setUsername(userData.userName || '');
        setEmail(userData.email || '');
    }, []);

    const handleLanguageChange = (value: string): void => {
        setLanguage(value);
    };

    const toggleSound = (): void => {
        setIsSoundEnabled(prev => !prev);
    };

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, option: string): void => {
        event.dataTransfer.setData('text/plain', option);
        setDraggedItem(option);
        setDragError(null);
        console.log('Drag started:', option);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        setDragOver(true);
        console.log('Dragging over drop zone');
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>): void => {
        setDragOver(false);
    };

    const handleDrop = (index: number, event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        setDragOver(false);
        const answer = event.dataTransfer.getData('text/plain');
        console.log('Dropped:', answer);

        // Validate that the dropped item is a valid option
        if (!questions[index].options.includes(answer)) {
            setDragError('Invalid drop item. Please try again.');
            setDraggedItem(null);
            console.error('Invalid drop item:', answer);
            return;
        }

        const newAnswers = [...answers];
        newAnswers[index] = answer;
        setAnswers(newAnswers);
        setDraggedItem(null);
        console.log('Answer set:', newAnswers);
    };

    const handleDragEnd = (): void => {
        setDraggedItem(null);
        setDragOver(false);
        console.log('Drag ended');
    };

    const handleNext = (): void => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setDragError(null);
        }
    };

    const handleSubmit = async (): Promise<void> => {
        if (!user || !userId || !username || !email) {
            setSaveStatus('Please log in to submit quiz results.');
            return;
        }

        const newMarks = answers.map((answer, index) =>
            answer === questions[index].correctAnswer ? 1 : 0
        );
        const total = newMarks.reduce((sum, mark) => sum + mark, 0);
        setMarks(newMarks);
        setTotalMarks(total);
        setIsSubmitted(true);

        try {
            const response = await axios.post('http://localhost:5000/api/v1/quizzes/saveQuizResults', {
                quizName:"DRAGANDDROP",
                user,
                userId,
                username,
                email,
                totalMarks: total,
                date: new Date().toISOString()
            });
            setSaveStatus('Quiz results saved successfully!');
            console.log('Quiz results saved:', response.data);
        } catch (error: any) {
            setSaveStatus('Error saving quiz results. Please try again.');
            console.error('Error saving quiz results:', error.response?.data || error.message);
        }
    };

    const resetQuiz = (): void => {
        setCurrentQuestionIndex(0);
        setAnswers(Array(5).fill(''));
        setMarks(Array(5).fill(0));
        setTotalMarks(0);
        setIsSubmitted(false);
        setSaveStatus(null);
        setDragError(null);
        setDragOver(false);
    };

    const getEncouragementMessage = (): string => {
        const percentage = (totalMarks / questions.length) * 100;
        if (percentage === 100) return "🌟 Perfect! You're a Sri Lanka expert! 🌟";
        if (percentage >= 80) return "🎉 Excellent work! Almost perfect! 🎉";
        if (percentage >= 60) return "👍 Good job! Keep learning! 👍";
        if (percentage >= 40) return "😊 Nice try! Practice makes perfect! 😊";
        return "🌈 Don't worry! Learning is fun! Try again! 🌈";
    };

    const getScoreColor = (): string => {
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
                {dragError && (
                    <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-700">
                        {dragError}
                    </div>
                )}
                <div className="text-center mb-16">
                    <div className="relative">
                        <div className="text-6xl mb-4 animate-bounce"></div>
                        <h1 className="text-6xl font-bold text-white mb-6 animate-pulse">
                            🪄 Test 3 - Drag & Drop 
                        </h1>
                        <div className="absolute -top-8 -left-8 text-5xl animate-spin">⭐</div>
                        <div className="absolute -top-8 -right-8 text-5xl animate-spin">⭐</div>
                    </div>
                    <div className="bg-white/90 rounded-3xl p-6 max-w-4xl mx-auto border-4 border-yellow-400 shadow-2xl">
                        <p className="text-2xl text-purple-800 font-bold mb-4">
                            Hi {username || 'Student'}! 👋 Drag and drop the correct answer!
                        </p>
                        <p className="text-lg text-blue-700">
                            🌟 Match the question with the right option! 🌟
                        </p>
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border-4 border-yellow-300 flex-1 flex flex-col items-center">
                    {!isSubmitted ? (
                        <div className="space-y-8 w-full">
                            <div className="text-center mb-4">
                                <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                                    Question {currentQuestionIndex + 1} of {questions.length}
                                </span>
                            </div>

                            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 border-2 border-dashed border-blue-300">
                                <p className="text-2xl font-bold text-purple-800 text-center mb-6">
                                    {questions[currentQuestionIndex].text}
                                </p>
                                <div
                                    className={`w-full h-20 border-4 border-dashed rounded-xl flex items-center justify-center text-xl font-semibold transition-all duration-300 ${
                                        answers[currentQuestionIndex]
                                            ? 'bg-green-100 border-green-400 text-green-800'
                                            : dragOver
                                                ? 'bg-blue-100 border-blue-500 text-blue-800'
                                                : 'bg-gray-50 border-gray-400 text-gray-500'
                                    } ${isSubmitted ? 'pointer-events-none opacity-50' : ''}`}
                                    onDrop={(e) => handleDrop(currentQuestionIndex, e)}
                                    onDragOver={handleDragOver}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                >
                                    {answers[currentQuestionIndex] || '📥 Drop your answer here'}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {questions[currentQuestionIndex].options.map((option, index) => (
                                    <div
                                        key={index}
                                        data-option={option}
                                        draggable={!isSubmitted && answers[currentQuestionIndex] !== option}
                                        onDragStart={(e) => handleDragStart(e, option)}
                                        onDragEnd={handleDragEnd}
                                        onTouchStart={(e) => {
                                            // Basic touch support
                                            e.preventDefault();
                                            handleDragStart(e as any, option);
                                        }}
                                        className={`bg-gradient-to-r from-pink-200 to-purple-200 rounded-2xl p-4 border-2 border-purple-300 text-center font-semibold select-none transition-all duration-300 ${
                                            draggedItem === option ? 'opacity-50 scale-95' : ''
                                        } ${
                                            answers[currentQuestionIndex] === option
                                                ? 'opacity-50 cursor-not-allowed'
                                                : isSubmitted
                                                    ? 'cursor-not-allowed'
                                                    : 'cursor-move hover:scale-105'
                                        }`}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>

                            {answers[currentQuestionIndex] && (
                                <div className="text-center">
                                    <Button
                                        onClick={() => {
                                            const newAnswers = [...answers];
                                            newAnswers[currentQuestionIndex] = '';
                                            setAnswers(newAnswers);
                                            setDragError(null);
                                        }}
                                        disabled={isSubmitted || !answers[currentQuestionIndex]}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        Clear Answer
                                    </Button>
                                </div>
                            )}

                            {currentQuestionIndex < questions.length - 1 ? (
                                <div className="flex justify-center mt-10">
                                    <Button
                                        onClick={handleNext}
                                        disabled={!answers[currentQuestionIndex] || isSubmitted}
                                        className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none border-4 border-white"
                                    >
                                        Next!
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex justify-center mt-10">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!answers[currentQuestionIndex] || isSubmitted}
                                        className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none border-4 border-white"
                                    >
                                        🚀 Submit My Answers! 🚀
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center space-y-8 w-full max-w-4xl">
                            <div className="bg-gradient-to-r from-yellow-200 to-pink-200 rounded-2xl p-8 border-4 border-yellow-400">
                                <h2 className="text-5xl font-bold text-purple-800 mb-6">🎊 Quiz Results! 🎊</h2>
                                <div className={`text-8xl font-bold mb-6 ${getScoreColor()}`}>
                                    {totalMarks} / {questions.length}
                                </div>
                                <div className="text-3xl font-bold text-indigo-700 mb-4">
                                    {getEncouragementMessage()}
                                </div>
                                <div className="text-lg text-gray-600">
                                    Score: {Math.round((totalMarks / questions.length) * 100)}%
                                </div>
                            </div>

                            <div className="space-y-6 max-h-96 overflow-y-auto">
                                {questions.map((question, index) => (
                                    <div key={question.id} className={`p-6 rounded-xl border-2 ${marks[index] === 1 ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'}`}>
                                        <p className="font-semibold text-gray-800 text-lg mb-4">Q{index + 1}: {question.text}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="text-center">
                                                <strong>Your answer:</strong><br/>
                                                <span className={marks[index] === 1 ? 'text-green-700' : 'text-red-700'}>
                                                    {answers[index] || 'No answer'}
                                                </span>
                                            </div>
                                            <div className="text-center">
                                                <strong>Correct answer:</strong><br/>
                                                <span className="text-green-700">{question.correctAnswer}</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 text-center">
                                            {marks[index] === 1 ? (
                                                <span className="text-green-600 font-bold text-xl">✅ Correct!</span>
                                            ) : (
                                                <span className="text-red-600 font-bold text-xl">❌ Incorrect</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    onClick={resetQuiz}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                >
                                    🔄 Try Again
                                </Button>
                                <Link to="/">
                                    <Button
                                        className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                    >
                                        <Home className="mr-3 h-5 w-5" />
                                        🏠 Home
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DragAndDrop;