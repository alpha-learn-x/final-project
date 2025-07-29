import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { Play, Pause, Home } from 'lucide-react';
import axios from 'axios';

const Auditory = () => {
    const audioRef = useRef<HTMLAudioElement>(null);

    const [quizzes, setQuizzes] = useState<{ _id: string; quizName?: string; audioUrl?: string; questions: any[] }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [user, setUser] = useState('');

    const [startTime, setStartTime] = useState<number | null>(null);
    const [time, setTime] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [answerFeedback, setAnswerFeedback] = useState<boolean[]>([]);

    // Flatten questions and track quiz boundaries
    const [allQuestions, setAllQuestions] = useState<{ quizId: string; question: any }[]>([]);
    const [quizIndexMap, setQuizIndexMap] = useState<{ quizId: string; startIndex: number; endIndex: number }[]>([]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/quizzes/auditory/questions');
                const quizzesData = response.data;

                if (!quizzesData || !Array.isArray(quizzesData)) {
                    throw new Error("Invalid data format: Expected an array of quizzes");
                }

                // Validate each quiz
                const validQuizzes = quizzesData.filter((quiz: any) => quiz && Array.isArray(quiz.questions));
                if (validQuizzes.length === 0) {
                    throw new Error("No valid quizzes with questions found");
                }

                setQuizzes(validQuizzes);

                // Flatten questions and create index map
                let questionIndex = 0;
                const flattenedQuestions: { quizId: string; question: any }[] = [];
                const indexMap: { quizId: string; startIndex: number; endIndex: number }[] = [];

                validQuizzes.forEach((quiz: any) => {
                    const quizQuestions = quiz.questions || [];
                    flattenedQuestions.push(...quizQuestions.map((q: any) => ({ quizId: quiz._id, question: q })));
                    indexMap.push({
                        quizId: quiz._id,
                        startIndex: questionIndex,
                        endIndex: questionIndex + quizQuestions.length - 1
                    });
                    questionIndex += quizQuestions.length;
                });

                setAllQuestions(flattenedQuestions);
                setQuizIndexMap(indexMap);
                setAnswers(Array(flattenedQuestions.length).fill(''));
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching or processing quiz data:", err);
                setLoadError('Failed to load quiz tasks. Please try again later.');
                setIsLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    useEffect(() => {
        const userDataStr = localStorage.getItem('currentUser');
        if (!userDataStr) {
            setSaveStatus('Please log in to start the quiz.');
            return;
        }
        try {
            const userData = JSON.parse(userDataStr);
            setUser(userData.id || '');
            setUserId(userData.userId || '');
            setUsername(userData.userName || '');
            setEmail(userData.email || '');
        } catch (err) {
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
        if (!isTimerRunning) {
            setStartTime(new Date().getTime());
            setIsTimerRunning(true);
            playAudio();
        }
    };

    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const pauseAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleAnswerSelect = (value: string) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = value;
        setAnswers(newAnswers);
        setSaveStatus(null);
    };

    const handleNext = () => {
        if (currentQuestionIndex < allQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        pauseAudio();
        if (!user || !userId || !username || !email) {
            setSaveStatus('Please log in to submit quiz results.');
            return;
        }

        const marks = allQuestions.map((q, idx) =>
            answers[idx] === q.question.correctAnswer ? 1 : 0
        );

        const feedback = allQuestions.map((q, idx) =>
            answers[idx] === q.question.correctAnswer
        );

        setAnswerFeedback(feedback);

        const totalMarks = marks.reduce((sum, mark) => sum + mark, 0);
        if (startTime) {
            setTotalTime(Math.floor((new Date().getTime() - startTime) / 1000));
        }

        setIsSubmitted(true);
        saveQuizResults(totalMarks, totalTime);
    };

    const saveQuizResults = async (totalMarks: number, finalTotalTime: number) => {
        try {
            // Save results for each quiz
            for (const quiz of quizzes) {
                const quizMarks = allQuestions
                    .filter(q => q.quizId === quiz._id)
                    .map((q, idx) => answers[idx] === q.question.correctAnswer ? 1 : 0)
                    .reduce((sum, mark) => sum + mark, 0);

                await axios.post('http://localhost:5000/api/v1/quizzes/saveQuizResults', {
                    quizName: quiz.quizName || "AUDITORY",
                    user,
                    userId,
                    username,
                    email,
                    totalMarks: quizMarks,
                    date: new Date().toISOString(),
                    time: finalTotalTime
                });
            }
            setSaveStatus('Quiz results saved successfully!');
        } catch (error) {
            setSaveStatus('Error saving quiz results. Please try again.');
        }
    };

    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setTime(0);
        setTotalTime(0);
        setStartTime(null);
        setAnswers(Array(allQuestions.length).fill(''));
        setIsTimerRunning(false);
        setIsSubmitted(false);
        setAnswerFeedback([]);
        setSaveStatus(null);
        pauseAudio();
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Find the quiz for the current question
    const currentQuiz = quizzes.find(quiz => {
        const map = quizIndexMap.find(m => m.quizId === quiz._id);
        return map && currentQuestionIndex >= map.startIndex && currentQuestionIndex <= map.endIndex;
    });

    if (isLoading) {
        return <div className="text-center mt-10 text-lg text-blue-700">Loading quiz...</div>;
    }

    if (loadError) {
        return <div className="text-center mt-10 text-lg text-red-600">{loadError}</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
                <h1 className="text-3xl font-bold mb-4 text-purple-800 text-center">🎧 Auditory Quiz</h1>

                {!isSubmitted ? (
                    <>
                        <div className="text-xl font-semibold text-blue-800 text-center mb-2">
                            Question {currentQuestionIndex + 1} of {allQuestions.length}
                        </div>
                        <div className="text-lg mb-4 text-center">
                            {allQuestions[currentQuestionIndex]?.question.text}
                        </div>

                        <audio ref={audioRef} src={currentQuiz?.audioUrl || ''} />

                        <div className="flex justify-center gap-4 mb-4">
                            <button
                                onClick={playAudio}
                                className="bg-blue-500 text-white px-4 py-2 rounded-full"
                                disabled={isPlaying || !currentQuiz?.audioUrl}
                            >
                                <Play className="inline-block mr-2" size={20} /> Play
                            </button>
                            <button
                                onClick={pauseAudio}
                                className="bg-red-500 text-white px-4 py-2 rounded-full"
                                disabled={!isPlaying}
                            >
                                <Pause className="inline-block mr-2" size={20} /> Pause
                            </button>
                            <button
                                onClick={handleStartTimer}
                                className="bg-green-500 text-white px-4 py-2 rounded-full"
                                disabled={isTimerRunning}
                            >
                                Start Quiz
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 mb-6">
                            {allQuestions[currentQuestionIndex]?.question.options.map((option: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswerSelect(option[0])}
                                    className={`w-full px-4 py-3 rounded-xl text-left border ${
                                        answers[currentQuestionIndex] === option[0]
                                            ? 'bg-purple-500 text-white border-purple-600'
                                            : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                                    }`}
                                    disabled={!isTimerRunning}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between mb-4">
                            <button
                                onClick={handlePrev}
                                className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400"
                                disabled={currentQuestionIndex === 0}
                            >
                                Previous
                            </button>
                            {currentQuestionIndex === allQuestions.length - 1 ? (
                                <button
                                    onClick={handleSubmit}
                                    className={`px-4 py-2 rounded-xl font-bold ${
                                        isTimerRunning ? 'bg-indigo-600 text-white' : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    }`}
                                    disabled={!isTimerRunning}
                                >
                                    Submit
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className={`px-4 py-2 rounded-xl font-bold ${
                                        isTimerRunning ? 'bg-indigo-600 text-white' : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    }`}
                                    disabled={!isTimerRunning}
                                >
                                    Next
                                </button>
                            )}
                        </div>

                        {saveStatus && (
                            <p className={`text-center mt-4 ${saveStatus.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                                {saveStatus}
                            </p>
                        )}

                        <div className="text-center mt-4">
                            Time: {formatTime(time)}
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-green-700 text-center mb-4">✅ Quiz Completed!</h2>
                        <p className="text-center mb-2">Total Time: {formatTime(totalTime)}</p>
                        <p className="text-center mb-6">
                            Total Marks: {answers.filter((ans, idx) => ans === allQuestions[idx].question.correctAnswer).length} / {allQuestions.length}
                        </p>
                        <button
                            onClick={resetQuiz}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl mb-4"
                        >
                            <Home className="inline-block mr-2" size={20} /> Restart
                        </button>
                        <Link to="/" className="block text-center text-indigo-600 underline">
                            Back to Home
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Auditory;