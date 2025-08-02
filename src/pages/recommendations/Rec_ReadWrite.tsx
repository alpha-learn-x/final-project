import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import axios from 'axios';
import Header from "@/components/Header.tsx";

interface Question {
    _id: string;
    quizName: string;
    question: string;
    answer1: string;
    answer2: string;
    answer3: string;
    answer4: string;
    correctAnswerOrder: string[]; // Array of strings
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
    userAnswer: string[];
    correctAnswer: string[];
}

const Rec_ReadWrite: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Current question state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<string[][]>([]); // Array of selected answer indices
    const [typedAnswers, setTypedAnswers] = useState<string[]>([]); // New state for typed order
    const [results, setResults] = useState<QuizResult[]>([]);
    const [totalMarks, setTotalMarks] = useState<number>(0);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [showCurrentResult, setShowCurrentResult] = useState(false);
    const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);

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

    // Fetch quiz data
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/quizzes/rec-readandwrite/get-all');
                const quizzesData = response.data;

                if (!quizzesData || !Array.isArray(quizzesData)) {
                    throw new Error("Invalid data format: Expected an array of quizzes");
                }

                if (quizzesData.length === 0) {
                    throw new Error("No quiz questions found");
                }

                // Check if correctAnswerOrder is a string, and split it only if needed
                const validQuizzes = quizzesData.map(q => ({
                    ...q,
                    correctAnswerOrder: typeof q.correctAnswerOrder === 'string'
                        ? q.correctAnswerOrder.split('') // Split string into an array of strings
                        : q.correctAnswerOrder // If it's already an array, keep it as it is
                })).filter(q =>
                    q.question &&
                    q.answer1 && q.answer2 && q.answer3 && q.answer4 &&
                    q.correctAnswerOrder && Array.isArray(q.correctAnswerOrder)
                );

                if (validQuizzes.length === 0) {
                    throw new Error("No valid quiz questions found");
                }

                setQuestions(validQuizzes);
                setAnswers(Array(validQuizzes.length).fill([])); // Initialize as empty arrays
                setTypedAnswers(Array(validQuizzes.length).fill('')); // Initialize typed answers
                setIsLoading(false);
                setQuizStartTime(Date.now());
                setQuestionStartTime(Date.now());
            } catch (err: any) {
                setLoadError(err.message || 'Failed to load quiz questions. Please try again later.');
                setIsLoading(false);
            }
        };

        fetchQuestions();

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
            setSaveStatus('Error loading user data. Please log in again.');
        }
    }, []);

    // Create options array from answer fields
    const currentQuestion = questions[currentQuestionIndex];
    const currentOptions = currentQuestion ? [
        currentQuestion.answer1,
        currentQuestion.answer2,
        currentQuestion.answer3,
        currentQuestion.answer4
    ].filter(Boolean) : [];

    const handleAnswerSelect = (value: string, index: number): void => {
        const newAnswers = [...answers];
        const currentAnswer = newAnswers[currentQuestionIndex] || [];
        if (currentAnswer.includes(value)) {
            newAnswers[currentQuestionIndex] = currentAnswer.filter(ans => ans !== value);
        } else {
            newAnswers[currentQuestionIndex] = [...currentAnswer, String(index + 1)]; // Store index as string
        }
        setAnswers(newAnswers);
        setSaveStatus(null);
    };

    const handleTypedAnswerChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newTypedAnswers = [...typedAnswers];
        newTypedAnswers[currentQuestionIndex] = e.target.value.replace(/[^1-4]/g, ''); // Only allow 1-4
        setTypedAnswers(newTypedAnswers);
    };

    const checkAnswerWithBackend = async (quizId: string, selectedAnswer: string[]): Promise<boolean> => {
        try {
            const response = await axios.post('http://localhost:5000/api/v1/quizzes/rec-readandwrite/check-answer', {
                quizId,
                selectedOrder: selectedAnswer
            });
            return response.data.correct;
        } catch (error) {
            const correctOrder = currentQuestion?.correctAnswerOrder || [];
            return JSON.stringify(correctOrder.sort()) === JSON.stringify(selectedAnswer.sort());
        }
    };

    const handleCheckAnswer = async () => {
        if (!currentQuestion) return;

        setIsCheckingAnswer(true);

        try {
            const userAnswer = typedAnswers[currentQuestionIndex]
                ? typedAnswers[currentQuestionIndex].split('') // Convert typed string to array
                : answers[currentQuestionIndex] || []; // Fallback to selected answers
            const currentTime = Date.now();
            const timeSpent = questionStartTime ? Math.floor((currentTime - questionStartTime) / 1000) : 0;

            const isCorrect = await checkAnswerWithBackend(currentQuestion._id, userAnswer);
            const marks = isCorrect ? 1 : 0;

            const questionResult: QuizResult = {
                taskId: currentQuestion._id,
                timeTaken: timeSpent,
                marks,
                userAnswer,
                correctAnswer: currentQuestion.correctAnswerOrder
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
            setSaveStatus('Error checking answer. Please try again.');
        } finally {
            setIsCheckingAnswer(false);
        }
    };

    const handleNext = async (): void => {
        if (!showCurrentResult || !currentQuestion) return;

        setQuestionStartTime(Date.now());

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setShowCurrentResult(false);
        } else {
            setIsSubmitted(true);

            const finalResults = [...results];
            const existingResultIndex = finalResults.findIndex(r => r.taskId === currentQuestion._id);

            if (existingResultIndex === -1) {
                try {
                    const userAnswer = typedAnswers[currentQuestionIndex]
                        ? typedAnswers[currentQuestionIndex].split('')
                        : answers[currentQuestionIndex] || [];
                    const currentTime = Date.now();
                    const timeSpent = questionStartTime ? Math.floor((currentTime - questionStartTime) / 1000) : 0;
                    const isCorrect = await checkAnswerWithBackend(currentQuestion._id, userAnswer);
                    const marks = isCorrect ? 1 : 0;

                    const finalResult: QuizResult = {
                        taskId: currentQuestion._id,
                        timeTaken: timeSpent,
                        marks,
                        userAnswer,
                        correctAnswer: currentQuestion.correctAnswerOrder
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
            quizName: "Rec_READWRITE",
            user,
            userId,
            username,
            email,
            totalMarks,
            participatedQuestions: questions.length,
            totalTime: finalTotalTime,
            date: new Date().toISOString()
        };

        try {
            const response = await axios.post('http://localhost:5000/api/v1/rec-quizzes/results', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setSaveStatus('✅ Quiz results saved successfully!');
        } catch (error: any) {
            setSaveStatus('❌ Error saving quiz results. Please try again.');
        }
    };

    const resetQuiz = (): void => {
        setAnswers(Array(questions.length).fill([]));
        setTypedAnswers(Array(questions.length).fill(''));
        setResults([]);
        setTotalMarks(0);
        setTotalTimeSpent(0);
        setIsSubmitted(false);
        setCurrentQuestionIndex(0);
        setShowCurrentResult(false);
        setSaveStatus(null);
        setIsCheckingAnswer(false);
        setQuizStartTime(Date.now());
        setQuestionStartTime(Date.now());
    };

    const getEncouragementMessage = (): string => {
        const percentage = (totalMarks / questions.length) * 100;
        if (percentage === 100) return "🌟 Perfect! You're a read-write genius! 🌟";
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

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">📚</div>
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

    const currentResult = results.find(r => r.taskId === currentQuestion?._id);

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
                        <p className="text-md text-gray-600">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </p>
                    </div>
                )}

                <div className="text-center mb-16">
                    <div className="relative">
                        <div className="text-6xl mb-4 animate-bounce">🧠</div>
                        <h1 className="text-6xl font-bold text-white mb-6 animate-pulse">
                            🪄 Read and Write Quiz
                        </h1>
                        <div className="absolute -top-8 -left-8 text-5xl animate-spin">⭐</div>
                        <div className="absolute -top-8 -right-8 text-5xl animate-spin">⭐</div>
                    </div>
                    <div className="bg-white/90 rounded-3xl p-6 max-w-4xl mx-auto border-4 border-yellow-400 shadow-2xl">
                        <p className="text-2xl text-purple-800 font-bold mb-4">
                            Hi {username || 'Student'}! 👋 Welcome to the Read and Write Quiz!
                        </p>
                        <p className="text-lg text-blue-700">
                            🌟 Select the correct answer order or type it (e.g., 1342)! 🌟
                        </p>
                        {!isSubmitted && (
                            <p className="text-lg font-bold mt-2">
                                Current Score: <span className={getScoreColor()}>
                                    {results.reduce((acc, r) => acc + r.marks, 0)} / {questions.length}
                                </span>
                            </p>
                        )}
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border-4 border-yellow-300 flex-1 flex flex-col items-center">
                    {!isSubmitted ? (
                        <>
                            <div className="bg-white p-4 rounded-xl border-2 border-purple-300 mb-6 w-full max-w-4xl">
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

                            <div className="space-y-8 w-full max-w-4xl">
                                <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 border-2 border-dashed border-blue-300 transform hover:scale-105 transition-all duration-300">
                                    <div className="flex items-center mb-4 justify-center">
                                        <span className="text-4xl mr-4">📝</span>
                                        <p className="text-2xl font-bold text-purple-800 text-center">
                                            {currentQuestion.question}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        {currentOptions.map((option, idx) => {
                                            const isSelected = answers[currentQuestionIndex]?.includes(String(idx + 1));

                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleAnswerSelect(option, idx)}
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
                                    <div className="mt-6">
                                        <label htmlFor="answerOrder" className="block text-lg font-semibold text-purple-800 mb-2">
                                            Type Answer Order (e.g., 1342):
                                        </label>
                                        <input
                                            id="answerOrder"
                                            type="text"
                                            value={typedAnswers[currentQuestionIndex] || ''}
                                            onChange={handleTypedAnswerChange}
                                            className="w-full p-3 rounded-lg border-2 border-purple-300 focus:outline-none focus:border-purple-500"
                                            placeholder="Enter order (e.g., 1342)"
                                            disabled={isCheckingAnswer}
                                        />
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
                                                <p className="font-semibold">{currentQuestion.question}</p>
                                                <p className="mt-2">
                                                    <strong>Your Answer:</strong> {currentResult.userAnswer.join(', ') || 'No answer'}
                                                </p>
                                                <p>
                                                    <strong>Correct Answer:</strong> {currentQuestion.correctAnswerOrder.join(', ')}
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
                                            {currentQuestionIndex < questions.length - 1 ? "Next Question ➡️" : "Finish Quiz 🎯"}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleCheckAnswer} // Changed from onChange to onClick
                                            disabled={!answers[currentQuestionIndex]?.length && !typedAnswers[currentQuestionIndex] || isCheckingAnswer}
                                            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-110 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none border-4 border-white"
                                        >
                                            {isCheckingAnswer ? "Checking... ⏳" : "Check Answer ➡️"}
                                        </button>
                                    )}
                                </div>

                                <div className="mt-6 text-center bg-yellow-100 p-4 rounded-xl border-2 border-yellow-300">
                                    <p className="text-lg text-yellow-800 font-semibold">
                                        💡 Select or type the correct answer order to check your response
                                    </p>
                                    {currentQuestionIndex === questions.length - 1 && !showCurrentResult && (
                                        <p className="text-lg text-green-800 font-bold mt-2">
                                            🎯 This is the final question. Check your answer before finishing!
                                        </p>
                                    )}
                                </div>
                            </div>
                        </>
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
                                <div className="text-xl text-purple-700 mt-4">
                                    ⏱️ Total Time: {formatTime(totalTimeSpent)}
                                </div>
                            </div>

                            <div className="space-y-6 overflow-y-auto w-full">
                                <h3 className="text-2xl font-semibold text-purple-800 mb-4">Detailed Results</h3>
                                {results.map((result, idx) => {
                                    const quiz = questions.find(q => q._id === result.taskId);
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
                                                    <strong>Your answer:</strong> {result.userAnswer.join(', ') || 'No answer'}
                                                </div>
                                                <div className="text-lg">
                                                    <strong>Correct answer:</strong> {quiz?.correctAnswerOrder.join(', ') || 'N/A'}
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

export default Rec_ReadWrite;