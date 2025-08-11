import Header from "@/components/Header.tsx";
import axios from 'axios';
import { Home, Pause, Play } from 'lucide-react';
import React, { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';

interface AuditoryQuiz {
    _id: string;
    quizName: string;
    question: string;
    answer1: string;
    answer2: string;
    answer3: string;
    answer4: string;
    correctAnswer: string;
    createdAt: string;
}

interface UserData {
    id?: string;
    userId?: string;
    userName?: string;
    email?: string;
}

interface QuizResult {
    taskId: string;
    timeTaken: number;
    marks: number;
    userAnswer: string;
    correctAnswer: string;
}

const AUDIO_SRC = "/what_does_a_battery_do.mp3";

// 19s total -> 5 segments (~3.8s each) - Updated to be sequential
const MANUAL_SEGMENTS: Array<{ start: number; end: number }> = [
    { start: 0, end: 4 },      // Q1: 0-3.8s
    { start: 4, end: 8 },    // Q2: 3.8-7.6s  
    { start: 8, end: 12 },   // Q3: 7.6-11.4s
    { start: 12, end: 15 },  // Q4: 11.4-15.2s
    { start: 15, end: 19 }   // Q5: 15.2-19.0s (end of audio)
];

const Auditory: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement>(null);

    const [quizzes, setQuizzes] = useState<AuditoryQuiz[]>([]);
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
    const [showCurrentResult, setShowCurrentResult] = useState(false);
    const [results, setResults] = useState<QuizResult[]>([]);
    const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);

    // Active segments for this quiz set
    const [segments, setSegments] = useState<Array<{ start: number; end: number }>>([]);

    // Convenience getter: use MANUAL_SEGMENTS if ready, else state `segments`
    const getSeg = (idx: number) => {
        const manualReady = MANUAL_SEGMENTS.length === quizzes.length;
        const source = manualReady ? MANUAL_SEGMENTS : segments;
        return source[idx];
    };

    // Load quizzes + user
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/quizzes/auditory/get-all');
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
            } catch (err) {
                console.error("Error fetching quiz data:", err);
                setLoadError('Failed to load quiz questions. Please try again later.');
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

    // As soon as quizzes are known, set segments if manual length matches
    useEffect(() => {
        if (quizzes.length > 0 && MANUAL_SEGMENTS.length === quizzes.length) {
            setSegments(MANUAL_SEGMENTS);
        }
    }, [quizzes.length]);

    // Also build segments after metadata if we need auto-split fallback
    const handleAudioLoadedMetadata = () => {
        const audio = audioRef.current;
        if (!audio || quizzes.length === 0) return;

        // If manual matches, we already set above; skip
        if (MANUAL_SEGMENTS.length === quizzes.length) return;

        const duration = audio.duration || 0;
        if (duration > 0) {
            const segSize = duration / quizzes.length;
            const autoSegments = quizzes.map((_, idx) => {
                const start = segSize * idx;
                const end = idx === quizzes.length - 1 ? duration : segSize * (idx + 1);
                return { start, end };
            });
            setSegments(autoSegments);
        }
    };

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

    // Auto-pause when current segment ends
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onTimeUpdate = () => {
            const seg = getSeg(currentQuestionIndex);
            if (!seg || !isPlaying) return;
            
            // Add small tolerance for timing precision (0.1s)
            if (audio.currentTime >= seg.end - 0.1) {
                audio.pause();
                setIsPlaying(false);
                console.log(`Audio paused at ${audio.currentTime}s, segment end: ${seg.end}s`);
            }
        };

        const onEnded = () => {
            setIsPlaying(false);
        };

        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("ended", onEnded);
        
        return () => {
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("ended", onEnded);
        };
    }, [currentQuestionIndex, quizzes.length, isPlaying]);

    // Helpers that accept an explicit index (fixes stale closure issues)
    const seekToSegmentStart = (index?: number) => {
        const audio = audioRef.current;
        if (!audio) return;
        const idx = index ?? currentQuestionIndex;
        const seg = getSeg(idx);
        if (!seg) return;
        audio.currentTime = seg.start;
    };

    const playSegment = (index?: number) => {
        const audio = audioRef.current;
        if (!audio) return;
        const idx = index ?? currentQuestionIndex;
        const seg = getSeg(idx);
        if (!seg) return;

        // Always start from the beginning of the current segment
        audio.currentTime = seg.start;
        console.log(`Playing segment ${idx + 1}: ${seg.start}s - ${seg.end}s`);
        
        audio.play()
            .then(() => setIsPlaying(true))
            .catch(err => {
                console.error("Audio play failed:", err);
                setIsPlaying(false);
            });
    };

    const pauseAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleStartTimer = () => {
        if (!isTimerRunning) {
            setStartTime(new Date().getTime());
            setIsTimerRunning(true);
            seekToSegmentStart(currentQuestionIndex);
            playSegment(currentQuestionIndex);
        }
    };

    const handleAnswerSelect = (value: string) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = value;
        setAnswers(newAnswers);
        setSaveStatus(null);
    };

    const checkAnswerWithBackend = async (quizId: string, selectedAnswer: string): Promise<boolean> => {
        try {
            const response = await axios.post('http://localhost:5000/api/v1/quizzes/auditory/check-answer', {
                quizId,
                selectedAnswer
            });
            return response.data.correct;
        } catch (error) {
            console.error('Error checking answer with backend:', error);
            const currentQuestion = quizzes[currentQuestionIndex];
            return currentQuestion.correctAnswer === selectedAnswer;
        }
    };

    const handleCheckAnswer = async () => {
        if (!answers[currentQuestionIndex] || !isTimerRunning || isCheckingAnswer) return;

        setIsCheckingAnswer(true);
        pauseAudio();

        const currentQuestion = quizzes[currentQuestionIndex];
        const userAnswer = answers[currentQuestionIndex];

        try {
            const isCorrect = await checkAnswerWithBackend(currentQuestion._id, userAnswer);
            const marks = isCorrect ? 1 : 0;

            const questionResult: QuizResult = {
                taskId: currentQuestion._id,
                timeTaken: Number(time),
                marks: Number(marks),
                userAnswer,
                correctAnswer: currentQuestion.correctAnswer
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
        } catch (error) {
            console.error('Error checking answer:', error);
            setSaveStatus('Error checking answer. Please try again.');
        } finally {
            setIsCheckingAnswer(false);
        }
    };

    const handleNextQuestion = async () => {
        if (!showCurrentResult) return;

        if (currentQuestionIndex < quizzes.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            setTime(0);
            setShowCurrentResult(false);

            // Wait a bit for state to update, then seek and play next segment
            setTimeout(() => {
                seekToSegmentStart(nextIndex);
                playSegment(nextIndex);
            }, 100);
        } else {
            setIsTimerRunning(false);
            setIsSubmitted(true);

            // Ensure final result is included before saving
            const currentQuestion = quizzes[currentQuestionIndex];
            const userAnswer = answers[currentQuestionIndex];

            const finalResults = [...results];
            const existingResultIndex = finalResults.findIndex(r => r.taskId === currentQuestion._id);

            if (existingResultIndex === -1) {
                try {
                    const isCorrect = await checkAnswerWithBackend(currentQuestion._id, userAnswer);
                    const marks = isCorrect ? 1 : 0;

                    const finalResult: QuizResult = {
                        taskId: currentQuestion._id,
                        timeTaken: Number(time),
                        marks: Number(marks),
                        userAnswer,
                        correctAnswer: currentQuestion.correctAnswer
                    };

                    finalResults.push(finalResult);
                } catch (error) {
                    console.error('Error checking final answer:', error);
                }
            }

            await saveQuizResults(finalResults, totalTime);
        }
    };

    const saveQuizResults = async (finalResults: QuizResult[], finalTotalTime: number) => {
        if (!user || !userId || !username || !email) {
            setSaveStatus('Error: Please log in to submit quiz results.');
            return;
        }

        const totalMarks = finalResults.reduce((acc, r) => acc + r.marks, 0);
        const totalQuizzes = quizzes.length;

        const payload = {
            quizName: "AUDITORY",
            user,
            userId,
            username,
            email,
            totalMarks,
            participatedQuestions: totalQuizzes,
            totalTime: finalTotalTime,
            date: new Date().toISOString()
        };

        try {
            await axios.post('http://localhost:5000/api/v1/quizzes/results', payload, {
                headers: { 'Content-Type': 'application/json' }
            });
            setSaveStatus('✅ Quiz results saved successfully!');
        } catch (error: any) {
            setSaveStatus('❌ Error saving quiz results. Please try again.');
            console.error('Error saving quiz results:', error.response?.data || error.message);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setTime(0);
        setTotalTime(0);
        setStartTime(null);
        setAnswers(Array(quizzes.length).fill(''));
        setIsTimerRunning(false);
        setIsSubmitted(false);
        setShowCurrentResult(false);
        setResults([]);
        setSaveStatus(null);
        setIsCheckingAnswer(false);
        pauseAudio();
        // Reset to first segment
        setTimeout(() => seekToSegmentStart(0), 100);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getScoreColor = (score: number) => {
        const totalPossibleMarks = quizzes.length;
        const percentage = (score / totalPossibleMarks) * 100;
        if (percentage >= 80) return "text-green-600";
        if (percentage >= 60) return "text-yellow-600";
        return "text-red-500";
    };

    // Current quiz
    const currentQuiz = quizzes[currentQuestionIndex];

    const currentOptions = currentQuiz ? [
        currentQuiz.answer1,
        currentQuiz.answer2,
        currentQuiz.answer3,
        currentQuiz.answer4
    ].filter(Boolean) : [];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">🎧</div>
                    <p className="text-3xl text-white font-bold">Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center">
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

    const currentResult = results.find(r => r.taskId === currentQuiz?._id);
    const totalMarks = results.reduce((acc, r) => acc + r.marks, 0);

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
                        <div className="text-6xl mb-4 animate-bounce">🎧</div>
                        <h1 className="text-6xl font-bold text-white mb-6 animate-pulse">
                            🎵 Test 1 - Auditory Learning
                        </h1>
                    </div>
                    <div className="bg-white/90 rounded-3xl p-6 max-w-4xl mx-auto border-4 border-yellow-400 shadow-2xl">
                        <p className="text-2xl text-purple-800 font-bold mb-4">
                            Hi {username || 'Student'}! 👋 Let's test your listening skills!
                        </p>
                        <p className="text-lg text-blue-700">
                            🌟 Listen carefully and answer the questions! 🌟
                        </p>
                        <p className="text-md text-gray-600">
                            Question {currentQuestionIndex + 1} of {quizzes.length}
                            {isSubmitted && " - Quiz Completed!"}
                        </p>
                        {!isSubmitted && (
                            <p className="text-lg font-bold mt-2">
                                Current Score: <span className={getScoreColor(totalMarks)}>
                  {totalMarks} / {quizzes.length}
                </span>
                            </p>
                        )}
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border-4 border-yellow-300">
                    {!isSubmitted ? (
                        <>
                            <div className="bg-white p-4 rounded-xl border-2 border-purple-300 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-lg font-bold text-purple-800">Progress</span>
                                    <span className="text-lg font-bold text-purple-800">
                    {currentQuestionIndex + 1} / {quizzes.length}
                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-300"
                                        style={{ width: `${((currentQuestionIndex + 1) / quizzes.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <h2 className="text-3xl font-semibold text-center mb-2 text-purple-800">
                                Auditory Question {currentQuestionIndex + 1}
                            </h2>
                            <h3 className="text-xl font-medium text-center mb-6 text-blue-700">
                                {currentQuiz?.question}
                            </h3>

                            {/* Shared audio player */}
                            <audio
                                ref={audioRef}
                                src={AUDIO_SRC}
                                controls
                                preload="auto"
                                onLoadedMetadata={handleAudioLoadedMetadata}
                                style={{ width: "100%", marginBottom: "1rem" }}
                            >
                                Your browser does not support the audio element.
                            </audio>

                            <div className="text-center mb-6 bg-blue-100 p-4 rounded-xl">
                <span className="text-2xl mr-6 font-bold text-blue-800">
                  ⏱️ Total Time: {formatTime(totalTime)}
                </span>
                                <span className="text-lg mr-6 text-gray-600">
                  Current Question: {formatTime(time)}
                </span>
                                <div className="flex justify-center gap-4 mt-4">
                                    <button
                                        onClick={handleStartTimer}
                                        disabled={isTimerRunning}
                                        className="bg-green-500 text-white px-6 py-3 rounded-full disabled:opacity-50 disabled:bg-gray-300 hover:bg-green-600 transition-colors font-bold text-lg"
                                    >
                                        {isTimerRunning ? "⏰ Timer Running..." : "🚀 Start Now"}
                                    </button>
                                    <button
                                        onClick={() => playSegment()}
                                        className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors font-bold"
                                        disabled={!isTimerRunning}
                                    >
                                        <Play className="inline-block mr-2" size={20} />
                                        {isPlaying ? "Playing..." : "Play Audio"}
                                    </button>
                                    <button
                                        onClick={pauseAudio}
                                        className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors font-bold"
                                        disabled={!isPlaying}
                                    >
                                        <Pause className="inline-block mr-2" size={20} />
                                        Pause
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                {currentOptions.map((option: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswerSelect(option)}
                                        className={`w-full px-6 py-4 rounded-xl text-left border-2 font-semibold text-lg transition-all duration-300 ${
                                            answers[currentQuestionIndex] === option
                                                ? 'bg-purple-500 text-white border-purple-600 shadow-lg transform scale-105'
                                                : 'bg-gray-100 hover:bg-gray-200 border-gray-300 hover:border-purple-300'
                                        }`}
                                        disabled={!isTimerRunning}
                                    >
                                        {String.fromCharCode(65 + idx)}. {option}
                                    </button>
                                ))}
                            </div>

                            {showCurrentResult && currentResult && (
                                <div className="mt-6 p-6 rounded-xl border-2 bg-green-100 border-green-400">
                                    <p className="text-2xl font-bold text-green-800 mb-4">
                                        Question {currentQuestionIndex + 1} Result
                                    </p>
                                    <p className={`text-xl font-bold ${getScoreColor(currentResult.marks)}`}>
                                        Score: {currentResult.marks} / 1
                                    </p>
                                    <p className="text-lg text-gray-700">
                                        Time: {formatTime(currentResult.timeTaken)}
                                    </p>
                                    <div className="mt-4">
                                        <div className={`p-4 rounded mb-2 ${
                                            currentResult.marks > 0 ? 'bg-green-200' : 'bg-red-200'
                                        }`}>
                                            <p className="font-semibold">{currentQuiz?.question}</p>
                                            <p className="mt-2">
                                                <strong>Your Answer:</strong> {currentResult.userAnswer || 'No answer'}
                                            </p>
                                            <p>
                                                <strong>Correct Answer:</strong> {currentResult.correctAnswer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-center gap-4 mt-10">
                                {showCurrentResult ? (
                                    <button
                                        onClick={handleNextQuestion}
                                        className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 border-4 border-white"
                                    >
                                        {currentQuestionIndex < quizzes.length - 1 ? "Next Question ➡️" : "Finish Quiz 🎯"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleCheckAnswer}
                                        disabled={!answers[currentQuestionIndex] || !isTimerRunning || isCheckingAnswer}
                                        className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none border-4 border-white"
                                    >
                                        {isCheckingAnswer ? "Checking... ⏳" : "Check Answer ➡️"}
                                    </button>
                                )}
                            </div>

                            <div className="mt-6 text-center bg-yellow-100 p-4 rounded-xl border-2 border-yellow-300">
                                <p className="text-lg text-yellow-800 font-semibold">
                                    💡 Listen to the audio and select your answer to check your response
                                </p>
                                {currentQuestionIndex === quizzes.length - 1 && !showCurrentResult && (
                                    <p className="text-lg text-green-800 font-bold mt-2">
                                        🎯 This is the final question. Check your answer before finishing!
                                    </p>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-4xl font-bold text-center text-purple-900 mb-4">
                                🎉 Congratulations! You completed all questions!
                            </h2>
                            <div className="text-center mb-6">
                                <p className="text-xl font-semibold mb-2 text-green-800">
                                    Total Time Taken: {formatTime(totalTime)}
                                </p>
                                <p className={`text-2xl font-bold ${getScoreColor(totalMarks)}`}>
                                    Total Marks: {totalMarks} / {quizzes.length}
                                </p>
                            </div>
                            <div className="mb-8 bg-white p-6 rounded-xl border-2 border-purple-300">
                                <h3 className="text-2xl font-bold text-purple-800 mb-4">Detailed Results</h3>
                                <div className="space-y-4">
                                    {results.map((result, idx) => (
                                        <div key={idx} className={`p-4 rounded-lg border ${
                                            result.marks > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                                        }`}>
                                            <p className="font-bold">Question {idx + 1}</p>
                                            <p>Your Answer: {result.userAnswer}</p>
                                            <p>Correct Answer: {result.correctAnswer}</p>
                                            <p>Time Taken: {formatTime(result.timeTaken)}</p>
                                            <p className="font-semibold">Marks: {result.marks}/1</p>
                                        </div>
                                    ))}
                                </div>
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
export default Auditory;
