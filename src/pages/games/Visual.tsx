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

// Define types for task structure
interface Task {
    id: number;
    questions: Question[];
    youtubeUrl: string;
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
    const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
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
    const [totalTimeSpent, setTotalTimeSpent] = useState(0);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [questionTimes, setQuestionTimes] = useState<number[]>([]);
    const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
    const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    // Flattened questions for correct indexing
    const [allQuestions, setAllQuestions] = useState<{ taskId: number; question: Question }[]>([]);

    // Initialize arrays and start time tracking
    useEffect(() => {
        const fetchQuizTasks = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/v1/quizzes/visual/questions");
                const data = response.data;

                if (!data.tasks || !Array.isArray(data.tasks)) {
                    throw new Error("Invalid API response format.");
                }

                setTasks(data.tasks);

                // Flatten questions for correct indexing
                const flattenedQuestions: { taskId: number; question: Question }[] = [];
                data.tasks.forEach((task: Task) => {
                    flattenedQuestions.push(...task.questions.map((q: Question) => ({ taskId: task.id, question: q })));
                });

                setAllQuestions(flattenedQuestions);
                setAnswers(new Array(flattenedQuestions.length).fill(''));
                setMarks(new Array(flattenedQuestions.length).fill(0));
                setQuestionTimes(new Array(flattenedQuestions.length).fill(0));
                setQuizStartTime(Date.now());
                setQuestionStartTime(Date.now());
            } catch (error) {
                console.error("Error fetching quiz data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizTasks();
    }, []);

    // Get user data from localStorage or authentication system
    useEffect(() => {
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

    // Extract YouTube video ID from URL
    const getYouTubeVideoId = (url: string): string => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : '';
    };

    const currentTask = tasks[currentTaskIndex];
    const youtubeVideoId = currentTask ? getYouTubeVideoId(currentTask.youtubeUrl) : '';
    const youtubeEmbedUrl = currentTask ? `https://www.youtube.com/embed/${youtubeVideoId}?enablejsapi=1&origin=${window.location.origin}` : '';

    // Video time tracking and pause logic
    useEffect(() => {
        if (isPlaying && !isSubmitted && currentTask) {
            const interval = setInterval(() => {
                setCurrentVideoTime(prev => {
                    const newTime = prev + 1;
                    const currentQuestion = currentTask.questions[currentQuestionIndex];

                    if (newTime >= currentQuestion.pauseAt) {
                        setIsPlaying(false);
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
    }, [isPlaying, currentTaskIndex, currentQuestionIndex, isSubmitted, currentTask]);

    const handleAnswerSelect = (questionIndex: number, value: string): void => {
        // Find global index based on flattened questions
        const globalIndex = allQuestions.findIndex(
            q => q.taskId === currentTask.id && q.question.id === currentTask.questions[questionIndex].id
        );
        const newAnswers = [...answers];
        newAnswers[globalIndex] = value.trim();
        setAnswers(newAnswers);

        // Record time spent on this question
        const currentTime = Date.now();
        const timeSpent = questionStartTime ? Math.floor((currentTime - questionStartTime) / 1000) : 0;
        const newQuestionTimes = [...questionTimes];
        newQuestionTimes[globalIndex] = timeSpent;
        setQuestionTimes(newQuestionTimes);

        console.log(`Answer selected for question ${globalIndex + 1}: ${value}`);
    };

    const handleLanguageChange = (value: string): void => {
        setLanguage(value);
    };

    const toggleSound = (): void => {
        setIsSoundEnabled(prev => !prev);
        if (videoRef.current) {
            videoRef.current.contentWindow?.postMessage(
                `{"event":"command","func":"${isSoundEnabled ? 'mute' : 'unMute'}","args":""}`,
                '*'
            );
        }
    };

    const handleStartVideo = (): void => {
        setVideoStarted(true);
        setIsPlaying(true);
        setCurrentVideoTime(0);
        setQuestionStartTime(Date.now());
        if (videoRef.current) {
            videoRef.current.contentWindow?.postMessage(
                '{"event":"command","func":"playVideo","args":""}',
                '*'
            );
        }
    };

    const handleNext = (): void => {
        // Reset question start time for next question
        setQuestionStartTime(Date.now());

        if (currentQuestionIndex < (currentTask?.questions.length || 0) - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setIsPlaying(true);
            if (videoRef.current) {
                videoRef.current.contentWindow?.postMessage(
                    '{"event":"command","func":"playVideo","args":""}',
                    '*'
                );
            }
        } else if (currentTaskIndex < (tasks.length || 0) - 1) {
            setCurrentTaskIndex(currentTaskIndex + 1);
            setCurrentQuestionIndex(0);
            setIsPlaying(true);
            setCurrentVideoTime(0);
            setVideoStarted(false);
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

        console.log('Calculating marks...');
        console.log('Current answers:', answers);

        const newMarks: number[] = [];
        // Calculate marks for each question in flattened list
        allQuestions.forEach((q, index) => {
            const userAnswer = answers[index]?.trim() || '';
            const correctAnswer = q.question.answer.trim();
            console.log(`Question ${index + 1}:`);
            console.log(`User answer: "${userAnswer}"`);
            console.log(`Correct answer: "${correctAnswer}"`);
            const isCorrect = userAnswer === correctAnswer;
            newMarks[index] = isCorrect ? 1 : 0;
            console.log(`Is correct: ${isCorrect}`);
        });

        const total = newMarks.reduce((sum, mark) => sum + mark, 0);
        const currentTime = Date.now();
        const totalTime = quizStartTime ? Math.floor((currentTime - quizStartTime) / 1000) : 0;

        setMarks(newMarks);
        setTotalMarks(total);
        setTotalTimeSpent(totalTime);

        console.log('Final marks:', newMarks);
        console.log('Total marks:', total);
        console.log('Total time:', totalTime);

        // Prepare data for API
        const quizData = {
            quizName,
            user,
            userId,
            username,
            email,
            totalMarks: total,
            totalTime: totalTime,
            date: new Date().toISOString()
        };

        console.log('Sending quiz data:', quizData);

        try {
            const response = await axios.post('http://localhost:5000/api/v1/quizzes/saveQuizResults', quizData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000
            });

            if (response.status === 200 || response.status === 201) {
                setSaveStatus('Quiz results saved successfully!');
                console.log('Quiz results saved:', response.data);
            } else {
                setSaveStatus('Quiz completed! (Unexpected response from server)');
            }
        } catch (error: any) {
            setSaveStatus('Error saving quiz results. Please try again.');
            console.error('Error saving quiz results:', error.response?.data || error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
        }
    };

    const resetQuiz = (): void => {
        setAnswers(new Array(allQuestions.length).fill(''));
        setMarks(new Array(allQuestions.length).fill(0));
        setQuestionTimes(new Array(allQuestions.length).fill(0));
        setTotalMarks(0);
        setTotalTimeSpent(0);
        setIsSubmitted(false);
        setCurrentTaskIndex(0);
        setCurrentQuestionIndex(0);
        setIsPlaying(false);
        setVideoStarted(false);
        setCurrentVideoTime(0);
        setSaveStatus(null);
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
        const percentage = (totalMarks / allQuestions.length) * 100;
        if (percentage === 100) return "🌟 Perfect! You're a visual genius! 🌟";
        if (percentage >= 80) return "🎉 Excellent work! Almost perfect! 🎉";
        if (percentage >= 60) return "👍 Good job! Keep learning! 👍";
        if (percentage >= 40) return "😊 Nice try! Practice makes perfect! 😊";
        return "🌈 Don't worry! Learning is fun! Try again! 🌈";
    };

    const getScoreColor = (): string => {
        const percentage = (totalMarks / allQuestions.length) * 100;
        if (percentage >= 80) return "text-green-600";
        if (percentage >= 60) return "text-yellow-600";
        return "text-red-500";
    };

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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

                {quizStartTime && !isSubmitted && (
                    <div className="bg-white/90 rounded-xl p-4 mb-4 text-center">
                        <p className="text-lg font-semibold text-purple-800">
                            ⏱️ Time Elapsed: {formatTime(Math.floor((Date.now() - quizStartTime) / 1000))}
                        </p>
                    </div>
                )}

                <div className="text-center mb-16">
                    <div className="relative">
                        <div className="text-6xl mb-4 animate-bounce"></div>
                        <h1 className="text-6xl font-bold text-white mb-6 animate-pulse">
                            🪄 Test 3 - Visual
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
                        {!videoStarted ? (
                            <div className="flex justify-center">
                                <button
                                    onClick={handleStartVideo}
                                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 border-4 border-white"
                                >
                                    Start Video
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                                    <iframe
                                        ref={videoRef}
                                        src={youtubeEmbedUrl}
                                        className="absolute top-0 left-0 w-full h-full rounded-xl"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title={`Visual Task ${currentTaskIndex + 1} Video`}
                                    ></iframe>
                                </div>
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-lg font-semibold text-blue-800 text-center">
                                        📺 Watch the video above and answer the questions that appear below!
                                    </p>
                                    <p className="text-sm text-blue-600 text-center mt-2">
                                        The video will pause automatically for each question.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {currentTask && currentQuestionIndex < currentTask.questions.length && (
                        <div className="space-y-8 w-full">
                            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 border-2 border-dashed border-blue-300 transform hover:scale-105 transition-all duration-300">
                                <div className="flex items-center mb-4 justify-center">
                                    <span className="text-4xl mr-4">📝</span>
                                    <p className="text-2xl font-bold text-purple-800 text-center">
                                        Question {currentQuestionIndex + 1} (Task {currentTask.id}): {currentTask.questions[currentQuestionIndex].text}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    {currentTask.questions[currentQuestionIndex].options.map((option, idx) => {
                                        const globalIndex = allQuestions.findIndex(
                                            q => q.taskId === currentTask.id && q.question.id === currentTask.questions[currentQuestionIndex].id
                                        );
                                        const isSelected = answers[globalIndex] === option;

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
                                                className={`bg-gradient-to-r from-pink-200 to-purple-200 px-6 py-4 rounded-full text-lg font-medium text-purple-800 border-2 border-purple-300 hover:from-pink-300 hover:to-purple-300 transition-all duration-200 ${isSelected ? 'from-purple-300 to-pink-300 ring-4 ring-purple-400' : ''}`}
                                                disabled={isSubmitted}
                                            >
                                                {option}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="flex justify-center mt-10">
                                <button
                                    onClick={handleNext}
                                    disabled={!answers[allQuestions.findIndex(q => q.taskId === currentTask.id && q.question.id === currentTask.questions[currentQuestionIndex].id)] || isSubmitted}
                                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none border-4 border-white"
                                >
                                    {currentQuestionIndex < currentTask.questions.length - 1 || currentTaskIndex < tasks.length - 1 ? 'Next!' : 'Submit My Answers!'}
                                </button>
                            </div>
                        </div>
                    )}

                    {isSubmitted && (
                        <div className="text-center space-y-8 w-full max-w-3xl">
                            <div className="bg-gradient-to-r from-yellow-200 to-pink-200 rounded-2xl p-8 border-4 border-yellow-400">
                                <h2 className="text-5xl font-bold text-purple-800 mb-6">🎊 Quiz Results! 🎊</h2>
                                <div className={`text-8xl font-bold mb-6 ${getScoreColor()}`}>
                                    {totalMarks} / {allQuestions.length}
                                </div>
                                <div className="text-3xl font-bold text-indigo-700 mb-4">
                                    {getEncouragementMessage()}
                                </div>
                                <div className="text-xl text-purple-700 mt-4">
                                    ⏱️ Total Time: {formatTime(totalTimeSpent)}
                                </div>
                            </div>
                            <div className="space-y-6 overflow-y-auto w-full">
                                {tasks.map((task, taskIdx) => (
                                    <div key={task.id}>
                                        <h3 className="text-2xl font-semibold text-purple-800 mb-4">Task {task.id} Results</h3>
                                        {task.questions.map((question, qIdx) => {
                                            const globalIndex = allQuestions.findIndex(
                                                q => q.taskId === task.id && q.question.id === question.id
                                            );
                                            const userAnswer = answers[globalIndex] || 'No answer';
                                            const correctAnswer = question.answer;
                                            const isCorrect = marks[globalIndex] === 1;
                                            const timeSpent = questionTimes[globalIndex] || 0;

                                            return (
                                                <div key={question.id} className={`p-6 rounded-xl border-2 ${isCorrect ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'} text-center mb-4`}>
                                                    <p className="font-semibold text-gray-800 text-xl mb-3">Q{qIdx + 1}: {question.text}</p>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
                                                        <div className="text-lg">
                                                            <strong>Your answer:</strong> {userAnswer}
                                                        </div>
                                                        <div className="text-lg">
                                                            <strong>Correct answer:</strong> {correctAnswer}
                                                        </div>
                                                        <div className="text-lg">
                                                            <strong>Time:</strong> {formatTime(timeSpent)}
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
                                        Home
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