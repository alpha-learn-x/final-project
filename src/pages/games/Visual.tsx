import React, { useState, useEffect, useRef } from 'react';
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
import Header from "@/components/Header.tsx";

// Define types for the question structure
interface Question {
    id: number;
    text: string;
    pauseAt: number;
    answer: string;
    options: string[];
}

// Define types for user data
interface UserData {
    id?: string;
    userId?: string;
    userName?: string;
    email?: string;
}

const Visual: React.FC = () => {
    const videoRef = useRef<HTMLIFrameElement>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [marks, setMarks] = useState<number[]>([]);
    const [totalMarks, setTotalMarks] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [quizName, setQuizName] = useState<string>('VISUAL');
    const [user, setUser] = useState<string>('');
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [language, setLanguage] = useState<string>("english");
    const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(false);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);
    const [currentVideoTime, setCurrentVideoTime] = useState<number>(0);
    const [videoStarted, setVideoStarted] = useState<boolean>(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [youtubeUrl, setYoutubeUrl] = useState<string>('');

    // Extract YouTube video ID from URL
    const getYouTubeVideoId = (url: string): string => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : '';
    };

    // Load quiz questions from backend
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/quizzes/visual/questions');
                console.log(response)
                setQuestions(response.data.questions);
                setYoutubeUrl(response.data.youtubeUrl);
                setAnswers(Array(response.data.questions.length).fill(''));
                setMarks(Array(response.data.questions.length).fill(0));
            } catch (error) {
                console.error('Error fetching quiz:', error);
                setSaveStatus('Failed to load quiz questions');
            }
        };

        fetchQuiz();

        // Set user data (same as before)
        setUser('demo-user');
        setUserId('demo-user-id');
        setUsername('Demo Student');
        setEmail('demo@example.com');
    }, []);

    const youtubeVideoId = getYouTubeVideoId(youtubeUrl);
    const youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?enablejsapi=1&origin=${window.location.origin}`;

    // Simulate video time tracking
    useEffect(() => {
        if (isPlaying && !isSubmitted && questions.length > 0) {
            const interval = setInterval(() => {
                setCurrentVideoTime(prev => {
                    const newTime = prev + 1;
                    const currentQuestion = questions[currentQuestionIndex];

                    if (newTime >= currentQuestion.pauseAt && newTime < currentQuestion.pauseAt + 1) {
                        setIsPlaying(false);
                        return newTime;
                    }

                    return newTime;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isPlaying, currentQuestionIndex, isSubmitted, questions]);

    const handleAnswerSelect = (index: number, value: string): void => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleLanguageChange = (value: string): void => {
        setLanguage(value);
    };

    const toggleSound = (): void => {
        setIsSoundEnabled(prev => !prev);
    };

    const handleStartVideo = (): void => {
        setVideoStarted(true);
        setIsPlaying(true);
        setCurrentVideoTime(0);
    };

    const handleNext = (): void => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setIsPlaying(true);
        } else if (!isSubmitted) {
            calculateMarks();
            setIsSubmitted(true);
        }
    };

    const calculateMarks = async (): Promise<void> => {
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

        try {
            const response = await axios.post('http://localhost:5000/api/v1/quizzes/saveQuizResults', {
                quizName,
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
            setSaveStatus('Quiz completed! (Error saving results)');
            console.error('Error saving results:', error);
        }
    };

    const resetQuiz = (): void => {
        setAnswers(Array(questions.length).fill(''));
        setMarks(Array(questions.length).fill(0));
        setTotalMarks(0);
        setIsSubmitted(false);
        setCurrentQuestionIndex(0);
        setIsPlaying(false);
        setVideoStarted(false);
        setCurrentVideoTime(0);
        setSaveStatus(null);
    };

    const getEncouragementMessage = (): string => {
        const percentage = (totalMarks / questions.length) * 100;
        if (percentage === 100) return "🌟 Perfect! You're a traffic expert! 🌟";
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

            <Header />

            <div className="container mx-auto px-4 py-12">
                {saveStatus && (
                    <div className={`mb-4 p-4 rounded-lg ${saveStatus.includes('Error') || saveStatus.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {saveStatus}
                    </div>
                )}
                <div className="text-center mb-16">
                    <div className="relative">
                        <div className="text-6xl mb-4 animate-bounce">🧠</div>
                        <h1 className="text-6xl font-bold text-white mb-6 animate-pulse">
                            🪄 Test 2 - Visual
                        </h1>
                        <div className="absolute -top-8 -left-8 text-5xl animate-spin">⭐</div>
                        <div className="absolute -top-8 -right-8 text-5xl animate-spin">⭐</div>
                    </div>
                    <div className="bg-white/90 rounded-3xl p-6 max-w-4xl mx-auto border-4 border-yellow-400 shadow-2xl">
                        <p className="text-2xl text-purple-800 font-bold mb-4">
                            Hi {username || 'Student'}! 👋 Watch the video and answer the questions!
                        </p>
                        <p className="text-lg text-blue-700">
                            🌟 Select an answer and click Next to proceed! 🌟
                        </p>
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border-4 border-yellow-300 flex-1 flex flex-col items-center">
                    <div className="w-full max-w-4xl mb-6">
                        <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                            <iframe
                                ref={videoRef}
                                src={youtubeEmbedUrl}
                                className="absolute top-0 left-0 w-full h-full rounded-xl"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Basic Electronics Video"
                            ></iframe>
                        </div>

                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-lg font-semibold text-blue-800 text-center">
                                📺 Watch the video above and answer the questions that appear below!
                            </p>
                            <p className="text-sm text-blue-600 text-center mt-2">
                                Note: In a real implementation, the video would pause automatically at specific times for each question.
                            </p>
                        </div>
                    </div>

                    {questions.length > 0 && currentQuestionIndex < questions.length && (
                        <div className="space-y-8 w-full">
                            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 border-2 border-dashed border-blue-300 transform hover:scale-105 transition-all duration-300">
                                <div className="flex items-center mb-4 justify-center">
                                    <span className="text-4xl mr-4">📝</span>
                                    <p className="text-2xl font-bold text-purple-800 text-center">
                                        Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex].text}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    {questions[currentQuestionIndex].options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
                                            className={`bg-gradient-to-r from-pink-200 to-purple-200 px-6 py-4 rounded-full text-lg font-medium text-purple-800 border-2 border-purple-300 hover:from-pink-300 hover:to-purple-300 transition-all duration-200 ${answers[currentQuestionIndex] === option ? 'from-purple-300 to-pink-300 ring-4 ring-purple-400' : ''}`}
                                            disabled={isSubmitted}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-center mt-10">
                                <button
                                    onClick={handleNext}
                                    disabled={!answers[currentQuestionIndex] || isSubmitted}
                                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none border-4 border-white"
                                >
                                    {currentQuestionIndex < questions.length - 1 ? ' Next! ' : 'Submit My Answers!'}
                                </button>
                            </div>
                        </div>
                    )}

                    {isSubmitted && (
                        <div className="text-center space-y-8 w-full max-w-3xl">
                            <div className="bg-gradient-to-r from-yellow-200 to-pink-200 rounded-2xl p-8 border-4 border-yellow-400">
                                <h2 className="text-5xl font-bold text-purple-800 mb-6">🎊 Quiz Results! 🎊</h2>
                                <div className={`text-8xl font-bold mb-6 ${getScoreColor()}`}>
                                    {totalMarks} / {questions.length}
                                </div>
                                <div className="text-3xl font-bold text-indigo-700 mb-4">
                                    {getEncouragementMessage()}
                                </div>
                            </div>
                            <div className="space-y-6 overflow-y-auto w-full">
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
                                        <Home className="mr-3 h-5 w-5" />
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

export default Visual;