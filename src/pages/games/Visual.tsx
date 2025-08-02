import React, {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import {
    Home,
    Volume2,
    VolumeX
} from 'lucide-react';
import axios from 'axios';
import Header from "@/components/Header.tsx";

// Define types for the visual quiz structure
interface VisualQuiz {
    _id: string;
    quizName: string;
    question: string;
    answer1: string;
    answer2: string;
    answer3: string;
    answer4: string;
    correctAnswer: string;
    youtubeUrl?: string;
    pauseAt?: number;
    createdAt: string;
}

// Define types for user data
interface UserData {
    id?: string;
    userId?: string;
    userName?: string;
    email?: string;
}

// Define types for quiz results
interface QuizResult {
    taskId: string;
    timeTaken: number;
    marks: number;
    userAnswer: string;
    correctAnswer: string;
}

const Visual: React.FC = () => {
    const videoRef = useRef<HTMLIFrameElement>(null);

    // Quiz data state
    const [quizzes, setQuizzes] = useState<VisualQuiz[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Current quiz state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [results, setResults] = useState<QuizResult[]>([]);
    const [totalMarks, setTotalMarks] = useState<number>(0);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    // Video state
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentVideoTime, setCurrentVideoTime] = useState<number>(0);
    const [videoStarted, setVideoStarted] = useState<boolean>(false);
    const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
    const [showAnswers, setShowAnswers] = useState<boolean>(false);

    // User state
    const [userId, setUserId] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [user, setUser] = useState<string>('');

    // Timer state
    const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
    const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
    const [totalTimeSpent, setTotalTimeSpent] = useState(0);

    // Status state
    const [saveStatus, setSaveStatus] = useState<string | null>(null);
    const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
    const [showCurrentResult, setShowCurrentResult] = useState(false);

    // Fetch quiz data
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/quizzes/visual/get-all');
                const quizzesData = response.data;

                if (!quizzesData || !Array.isArray(quizzesData)) {
                    throw new Error("Invalid data format: Expected an array of quizzes");
                }

                if (quizzesData.length === 0) {
                    throw new Error("No quiz questions found");
                }

                setQuizzes(quizzesData);
                setAnswers(Array(quizzesData.length).fill(''));
                setIsLoading(false);
                setQuizStartTime(Date.now());
                setQuestionStartTime(Date.now());
            } catch (err: any) {
                console.error("Error fetching quiz data:", err);
                setLoadError(err.message || 'Failed to load quiz questions. Please try again later.');
                setIsLoading(false);
            }
        };
        fetchQuizzes();

        // Load user data
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

    const getYouTubeVideoId = (url: string | undefined): string => {
        if (!url || typeof url !== 'string') {
            return '';
        }
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2] && match[2].length === 11 ? match[2] : '';
    };

    const currentQuiz = quizzes[currentQuestionIndex];
    const youtubeVideoId = currentQuiz ? getYouTubeVideoId(currentQuiz.youtubeUrl) : '';
    const youtubeEmbedUrl = youtubeVideoId ? `https://www.youtube.com/embed/${youtubeVideoId}?enablejsapi=1&origin=${window.location.origin}` : '';

    // Create options array from answer fields
    const currentOptions = currentQuiz ? [
        currentQuiz.answer1,
        currentQuiz.answer2,
        currentQuiz.answer3,
        currentQuiz.answer4
    ].filter(Boolean) : [];

// Video time tracking and pause logic
    useEffect(() => {
        if (isPlaying && !isSubmitted && currentQuiz && videoStarted && youtubeVideoId) {
            const interval = setInterval(() => {
                setCurrentVideoTime(prev => {
                    const newTime = prev + 1;
                    const pauseAt = currentQuiz.pauseAt || 30; // Default pause at 30 seconds if not specified

                    if (newTime >= pauseAt) {
                        setIsPlaying(false);
                        setShowAnswers(true);
                        if (videoRef.current) {
                            videoRef.current.contentWindow?.postMessage(
                                '{"event":"command","func":"pauseVideo","args":""}',
                                '*'
                            );
                        }
                        return newTime;
                    }

                    return newTime;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isPlaying, currentQuestionIndex, isSubmitted, currentQuiz, videoStarted, youtubeVideoId]);

    const handleAnswerSelect = (value: string): void => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = value.trim();
        setAnswers(newAnswers);
        setSaveStatus(null);
    };

    const toggleSound = (): void => {
        setIsSoundEnabled(prev => !prev);
        if (videoRef.current && youtubeVideoId) {
            videoRef.current.contentWindow?.postMessage(
                `{"event":"command","func":"${isSoundEnabled ? 'mute' : 'unMute'}","args":""}`,
                '*'
            );
        }
    };

    const handleStartVideo = (): void => {
        if (!youtubeVideoId && currentQuiz?.youtubeUrl) {
            setSaveStatus('Error: Invalid video URL for this question.');
            setShowAnswers(true); // Show answers even if video is invalid
            setVideoStarted(true);
            setQuestionStartTime(Date.now());
            return;
        }
        setVideoStarted(true);
        setIsPlaying(true);
        setCurrentVideoTime(0);
        setQuestionStartTime(Date.now());
        setShowAnswers(false);
        if (videoRef.current && youtubeVideoId) {
            videoRef.current.contentWindow?.postMessage(
                '{"event":"command","func":"playVideo","args":""}',
                '*'
            );
        } else {
            setShowAnswers(true); // Show answers immediately if no video
        }
    };

    const checkAnswerWithBackend = async (quizId: string, selectedAnswer: string): Promise<boolean> => {
        try {
            const response = await axios.post('http://localhost:5000/api/v1/quizzes/visual/check-answer', {
                quizId,
                selectedAnswer
            });
            return response.data.correct;
        } catch (error) {
            console.error('Error checking answer with backend:', error);
            return currentQuiz.correctAnswer === selectedAnswer;
        }
    };

    const handleCheckAnswer = async () => {
        if (!answers[currentQuestionIndex] || isCheckingAnswer || !currentQuiz) return;

        setIsCheckingAnswer(true);

        try {
            const userAnswer = answers[currentQuestionIndex];
            const currentTime = Date.now();
            const timeSpent = questionStartTime ? Math.floor((currentTime - questionStartTime) / 1000) : 0;

            const isCorrect = await checkAnswerWithBackend(currentQuiz._id, userAnswer);
            const marks = isCorrect ? 1 : 0;

            const questionResult: QuizResult = {
                taskId: currentQuiz._id,
                timeTaken: timeSpent,
                marks,
                userAnswer,
                correctAnswer: currentQuiz.correctAnswer
            };

            setResults(prev => {
                const existingResultIndex = prev.findIndex(r => r.taskId === questionResult.taskId);
                if (existingResultIndex !== -1) {
                    const updatedResults = [...prev];
                    updatedResults[existingResultIndex] = questionResult;
                    return updatedResults;
                }
                return [...prev, questionResult];
            });

            setShowCurrentResult(true);
            setIsPlaying(false);
            if (videoRef.current) {
                videoRef.current.contentWindow?.postMessage(
                    '{"event":"command","func":"pauseVideo","args":""}',
                    '*'
                );
            }
        } catch (error) {
            console.error('Error checking answer:', error);
            setSaveStatus('Error checking answer. Please try again.');
        } finally {
            setIsCheckingAnswer(false);
        }
    };

    const handleNext = async (): Promise<void> => {
        if (!showCurrentResult || !currentQuiz) return;

        setQuestionStartTime(Date.now());

        if (currentQuestionIndex < quizzes.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setIsPlaying(false);
            setCurrentVideoTime(0);
            setVideoStarted(false);
            setShowCurrentResult(false);
            setShowAnswers(false);
        } else {
            setIsSubmitted(true);

            const finalResults = [...results];
            const existingResultIndex = finalResults.findIndex(r => r.taskId === currentQuiz._id);

            if (existingResultIndex === -1) {
                try {
                    const userAnswer = answers[currentQuestionIndex];
                    const currentTime = Date.now();
                    const timeSpent = questionStartTime ? Math.floor((currentTime - questionStartTime) / 1000) : 0;
                    const isCorrect = await checkAnswerWithBackend(currentQuiz._id, userAnswer);
                    const marks = isCorrect ? 1 : 0;

                    const finalResult: QuizResult = {
                        taskId: currentQuiz._id,
                        timeTaken: timeSpent,
                        marks,
                        userAnswer,
                        correctAnswer: currentQuiz.correctAnswer
                    };

                    finalResults.push(finalResult);
                } catch (error) {
                    console.error('Error checking final answer:', error);
                }
            }

            const currentTime = Date.now();
            const totalTime = quizStartTime ? Math.floor((currentTime - quizStartTime) / 1000) : 0;
            setTotalTimeSpent(totalTime);

            await saveQuizResults(finalResults, totalTime);
        }
    };

    const saveQuizResults = async (finalResults: QuizResult[], finalTotalTime: number) => {
        if (!user || !userId || !username || !email) {
            setSaveStatus('Error: Please log in to submit quiz results.');
            return;
        }

        const totalMarks = finalResults.reduce((acc, r) => acc + r.marks, 0);
        setTotalMarks(totalMarks);

        const payload = {
            quizName: "VISUAL",
            user,
            userId,
            username,
            email,
            totalMarks,
            participatedQuestions: quizzes.length,
            totalTime: finalTotalTime,
            date: new Date().toISOString()
        };

        try {
            const response = await axios.post('http://localhost:5000/api/v1/quizzes/results', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setSaveStatus('✅ Quiz results saved successfully!');
            console.log('Quiz results saved:', response.data);
        } catch (error: any ) {
            setSaveStatus('❌ Error saving quiz results. Please try again.');
            console.error('Error saving quiz results:', error.response?.data || error.message);
        }
    };

    const resetQuiz = (): void => {
        setAnswers(Array(quizzes.length).fill(''));
        setResults([]);
        setTotalMarks(0);
        setTotalTimeSpent(0);
        setIsSubmitted(false);
        setCurrentQuestionIndex(0);
        setIsPlaying(false);
        setVideoStarted(false);
        setCurrentVideoTime(0);
        setShowCurrentResult(false);
        setShowAnswers(false);
        setSaveStatus(null);
        setIsCheckingAnswer(false);
        setQuizStartTime(Date.now());
        setQuestionStartTime(Date.now());

        if (videoRef.current) {
            videoRef.current.contentWindow?.postMessage(
                '{"event":"command","func":"stopVideo","args":""}',
                '*'
            );
        }
    };

    const getEncouragementMessage = (): string => {
        const percentage = (totalMarks / quizzes.length) * 100;
        if (percentage === 100) return "🌟 Perfect! You're a visual genius! 🌟";
        if (percentage >= 80) return "🎉 Excellent work! Almost perfect! 🎉";
        if (percentage >= 60) return "👍 Good job! Keep learning! 👍";
        if (percentage >= 40) return "😊 Nice try! Practice makes perfect! 😊";
        return "🌈 Don't worry! Learning is fun! Try again! 🌈";
    };

    const getScoreColor = (): string => {
        const percentage = (totalMarks / quizzes.length) * 100;
        if (percentage >= 80) return "text-green-600";
        if (percentage >= 60) return "text-yellow-600";
        return "text-red-500";
    };

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">🧠</div>
                    <p className="text-3xl text-white font-bold">Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center">
                <div className="text-center bg-white/90 rounded-3xl p-8 border-4 border-red-400">
                    <div className="text-6xl mb-4">❌</div>
                    <p className="text-2xl text-red-600 font-bold mb-4">{loadError}</p>
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
            <div
                className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center">
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

    const currentResult = results.find(r => r.taskId === currentQuiz?._id);

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 relative overflow-hidden">
            <div className="absolute top-10 left-10 text-4xl animate-bounce">🌟</div>
            <div className="absolute top-20 right-20 text-3xl animate-ping">⭐</div>
            <div className="absolute bottom-20 left-20 text-4xl animate-pulse">🎈</div>

            <Header/>

            <div className="container mx-auto px-4 py-12">
                {saveStatus && (
                    <div
                        className={`mb-4 p-4 rounded-lg ${saveStatus.includes('Error') || saveStatus.includes('❌') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {saveStatus}
                    </div>
                )}

                {quizStartTime && !isSubmitted && (
                    <div className="bg-white/90 rounded-xl p-4 mb-4 text-center">
                        <p className="text-lg font-semibold text-purple-800">
                            ⏱️ Time Elapsed: {formatTime(Math.floor((Date.now() - quizStartTime) / 1000))}
                        </p>
                        <p className="text-md text-gray-600">
                            Question {currentQuestionIndex + 1} of {quizzes.length}
                        </p>
                    </div>
                )}

                <div className="text-center mb-16">
                    <div className="relative">
                        <div className="text-6xl mb-4 animate-bounce">🧠</div>
                        <h1 className="text-6xl font-bold text-white mb-6 animate-pulse">
                            🪄 Test 2 - Visual Learning
                        </h1>
                        <div className="absolute -top-8 -left-8 text-5xl animate-spin">⭐</div>
                        <div className="absolute -top-8 -right-8 text-5xl animate-spin">⭐</div>
                    </div>
                    <div
                        className="bg-white/90 rounded-3xl p-6 max-w-4xl mx-auto border-4 border-yellow-400 shadow-2xl">
                        <p className="text-2xl text-purple-800 font-bold mb-4">
                            Hi {username || 'Student'}! 👋 Watch the video and answer the questions!
                        </p>
                        <p className="text-lg text-blue-700">
                            🌟 Watch carefully and select your answer! 🌟
                        </p>
                        {!isSubmitted && (
                            <p className="text-lg font-bold mt-2">
                                Current Score: <span className={getScoreColor()}>
                                    {results.reduce((acc, r) => acc + r.marks, 0)} / {quizzes.length}
                                </span>
                            </p>
                        )}
                    </div>
                </div>

                <div
                    className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border-4 border-yellow-300 flex-1 flex flex-col items-center">
                    {!isSubmitted ? (
                        <>
                            <div className="bg-white p-4 rounded-xl border-2 border-purple-300 mb-6 w-full max-w-4xl">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-lg font-bold text-purple-800">Progress</span>
                                    <span className="text-lg font-bold text-purple-800">
                                        {currentQuestionIndex + 1} / {quizzes.length}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-300"
                                        style={{width: `${((currentQuestionIndex + 1) / quizzes.length) * 100}%`}}
                                    ></div>
                                </div>
                            </div>

                            <div className="w-full max-w-4xl mb-6">
                                {!videoStarted ? (
                                    <div className="flex flex-col items-center space-y-4">
                                        <div
                                            className="text-center bg-blue-100 p-6 rounded-xl border-2 border-blue-300">
                                            <h2 className="text-2xl font-bold text-blue-800 mb-2">
                                                Question {currentQuestionIndex + 1}: {currentQuiz?.question || 'Loading...'}
                                            </h2>
                                            <p className="text-lg text-blue-600 mb-4">
                                                {youtubeVideoId ? 'Click Start Video to begin watching the video for this question.' : 'No video available. Click Start to view the question.'}
                                            </p>
                                            {youtubeVideoId && currentQuiz?.pauseAt && (
                                                <p className="text-sm text-gray-600">
                                                    The video will pause automatically at {currentQuiz.pauseAt} seconds
                                                    for you to answer.
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={handleStartVideo}
                                            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 border-4 border-white"
                                        >
                                            🎬 Start {youtubeVideoId ? 'Video' : 'Question'}
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {youtubeVideoId ? (
                                            <div className="relative" style={{paddingBottom: '56.25%', height: 0}}>
                                                <iframe
                                                    ref={videoRef}
                                                    src={youtubeEmbedUrl}
                                                    className="absolute top-0 left-0 w-full h-full rounded-xl"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    title={`Visual Question ${currentQuestionIndex + 1} Video`}
                                                ></iframe>
                                            </div>
                                        ) : (
                                            <div
                                                className="text-center bg-yellow-100 p-6 rounded-xl border-2 border-yellow-300">
                                                <p className="text-lg text-yellow-800 font-semibold">
                                                    No video available for this question. Please answer the question
                                                    below.
                                                </p>
                                            </div>
                                        )}
                                        {youtubeVideoId && (
                                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                <p className="text-lg font-semibold text-blue-800 text-center">
                                                    📺 Video will pause at {currentQuiz?.pauseAt || 30} seconds for you
                                                    to answer!
                                                </p>
                                                <p className="text-sm text-blue-600 text-center mt-2">
                                                    Current time: {formatTime(currentVideoTime)}
                                                </p>
                                                <div className="flex justify-center mt-2">
                                                    <button
                                                        onClick={toggleSound}
                                                        disabled={!youtubeVideoId}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                    >
                                                        {isSoundEnabled ?
                                                            <Volume2 className="inline-block mr-2" size={16}/> :
                                                            <VolumeX className="inline-block mr-2" size={16}/>}
                                                        {isSoundEnabled ? 'Mute' : 'Unmute'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {currentQuiz && (showAnswers || !youtubeVideoId) && (
                                <div className="space-y-8 w-full max-w-4xl">
                                    <div
                                        className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 border-2 border-dashed border-blue-300 transform hover:scale-105 transition-all duration-300">
                                        <div className="flex items-center mb-4 justify-center">
                                            <span className="text-4xl mr-4">📝</span>
                                            <p className="text-2xl font-bold text-purple-800 text-center">
                                                {currentQuiz.question}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                            {currentOptions.map((option, idx) => {
                                                const isSelected = answers[currentQuestionIndex] === option;

                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleAnswerSelect(option)}
                                                        className={`bg-gradient-to-r from-pink-200 to-purple-200 px-6 py-4 rounded-full text-lg font-medium text-purple-800 border-2 border-purple-300 hover:from-pink-300 hover:to-purple-300 transition-all duration-200 ${
                                                            isSelected ? 'from-purple-300 to-pink-300 ring-4 ring-purple-400' : ''
                                                        }`}
                                                        disabled={isCheckingAnswer}
                                                    >
                                                        {String.fromCharCode(65 + idx)}. {option}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {showCurrentResult && currentResult && (
                                        <div className="mt-6 p-6 rounded-xl border-2 bg-green-100 border-green-400">
                                            <p className="text-2xl font-bold text-green-800 mb-4">
                                                Question {currentQuestionIndex + 1} Result
                                            </p>
                                            <p className={`text-xl font-bold ${currentResult.marks > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                Score: {currentResult.marks} / 1
                                            </p>
                                            <p className="text-lg text-gray-700">
                                                Time: {formatTime(currentResult.timeTaken)}
                                            </p>
                                            <div className="mt-4">
                                                <div className={`p-4 rounded mb-2 ${
                                                    currentResult.marks > 0
                                                        ? 'bg-green-200'
                                                        : 'bg-red-200'
                                                }`}>
                                                    <p className="font-semibold">{currentQuiz.question}</p>
                                                    <p className="mt-2">
                                                        <strong>Your
                                                            Answer:</strong> {currentResult.userAnswer || 'No answer'}
                                                    </p>
                                                    <p>
                                                        <strong>Correct Answer:</strong> {currentResult.correctAnswer}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-center mt-10">
                                        {showCurrentResult ? (
                                            <button
                                                onClick={handleNext}
                                                className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 border-4 border-white"
                                            >
                                                {currentQuestionIndex < quizzes.length - 1 ? "Next Question ➡️" : "Finish Quiz 🎯"}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleCheckAnswer}
                                                disabled={!answers[currentQuestionIndex] || isCheckingAnswer}
                                                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none border-4 border-white"
                                            >
                                                {isCheckingAnswer ? "Checking... ⏳" : "Check Answer ➡️"}
                                            </button>
                                        )}
                                    </div>

                                    <div
                                        className="mt-6 text-center bg-yellow-100 p-4 rounded-xl border-2 border-yellow-300">
                                        <p className="text-lg text-yellow-800 font-semibold">
                                            💡 Select your answer to check your response
                                        </p>
                                        {currentQuestionIndex === quizzes.length - 1 && !showCurrentResult && (
                                            <p className="text-lg text-green-800 font-bold mt-2">
                                                🎯 This is the final question. Check your answer before finishing!
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center space-y-8 w-full max-w-4xl">
                            <div
                                className="bg-gradient-to-r from-yellow-200 to-pink-200 rounded-2xl p-8 border-4 border-yellow-400">
                                <h2 className="text-5xl font-bold text-purple-800 mb-6">🎊 Quiz Results! 🎊</h2>
                                <div className={`text-8xl font-bold mb-6 ${getScoreColor()}`}>
                                    {totalMarks} / {quizzes.length}
                                </div>
                                <div className="text-3xl font-bold text-indigo-700 mb-4">
                                    {getEncouragementMessage()}
                                </div>
                                <div className="text-xl text-purple-700 mt-4">
                                    ⏱️ Total Time: {formatTime(totalTimeSpent)}
                                </div>
                            </div>

                            <div className="space-y-6 overflow-y-auto w-full">
                                <h3 className="text-2xl font-semibold text-purple-800 mb-4">Detailed Results</h3>
                                {results.map((result, idx) => {
                                    const quiz = quizzes.find(q => q._id === result.taskId);
                                    const isCorrect = result.marks === 1;

                                    return (
                                        <div key={result.taskId} className={`p-6 rounded-xl border-2 ${
                                            isCorrect ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'
                                        } text-center mb-4`}>
                                            <p className="font-semibold text-gray-800 text-xl mb-3">
                                                Q{idx + 1}: {quiz?.question || 'Question not found'}
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
                                                <div className="text-lg">
                                                    <strong>Your answer:</strong> {result.userAnswer}
                                                </div>
                                                <div className="text-lg">
                                                    <strong>Correct answer:</strong> {result.correctAnswer}
                                                </div>
                                                <div className="text-lg">
                                                    <strong>Time:</strong> {formatTime(result.timeTaken)}
                                                </div>
                                            </div>
                                            <div className="mt-4">
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
                                        <Home className="mr-3 h-5 w-5 inline"/>
                                        🏠 Home
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};

export default Visual;
