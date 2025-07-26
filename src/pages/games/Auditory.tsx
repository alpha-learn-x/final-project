import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { Play, Pause, Home, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const Auditory = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [user, setUser] = useState('');
    const [audioError, setAudioError] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [time, setTime] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [answerFeedback, setAnswerFeedback] = useState<boolean[]>([]);

    const [tasks] = useState([
        {
            id: 1,
            questions: [
                { id: 1, text: "1. What is energy?", correctAnswer: "b", options: ["a) Something you eat for breakfast", "b) The ability to do work", "c) A type of machine", "d) Another word for electricity"] },
                { id: 2, text: "2. Which two main types of energy are shown first?", correctAnswer: "c", options: ["a) Hot and cold energy", "b) Big and small energy", "c) Stored energy and moving energy", "d) Light and sound energy"] },
                { id: 3, text: "3. A stretched rubber band has", correctAnswer: "b", options: ["a) Kinetic energy", "b) Potential energy", "c) Sound energy", "d) Nuclear energy"] },
                { id: 4, text: "4. What energy does a rolling ball have?", correctAnswer: "c", options: ["a) Sleeping energy", "b) Potential energy", "c) Kinetic energy", "d) Elastic energy"] },
                { id: 5, text: "5. How do scientists measure energy?", correctAnswer: "d", options: ["a) With thermometers", "b) In kilograms", "c) Using rulers", "d) In joules"] }
            ]
        },
        {
            id: 2,
            questions: [
                { id: 1, text: "1. What is heat?", correctAnswer: "b", options: ["a) A type of light", "b) Energy transferred by temperature", "c) A form of sound", "d) A type of motion"] },
                { id: 2, text: "2. Which source produces heat?", correctAnswer: "c", options: ["a) Wind", "b) Water", "c) Sun", "d) Ice"] },
                { id: 3, text: "3. What happens when heat is applied to water?", correctAnswer: "b", options: ["a) It freezes", "b) It boils", "c) It shrinks", "d) It disappears"] },
                { id: 4, text: "4. Which material conducts heat well?", correctAnswer: "c", options: ["a) Wood", "b) Plastic", "c) Metal", "d) Cotton"] },
                { id: 5, text: "5. How is heat measured?", correctAnswer: "d", options: ["a) In meters", "b) In liters", "c) In grams", "d) In degrees"] }
            ]
        },
        {
            id: 3,
            questions: [
                { id: 1, text: "1. What is light?", correctAnswer: "b", options: ["a) A type of sound", "b) Energy we can see", "c) A form of heat", "d) A type of water"] },
                { id: 2, text: "2. Which object reflects light?", correctAnswer: "c", options: ["a) Black paper", "b) Dark cloth", "c) Mirror", "d) Rough stone"] },
                { id: 3, text: "3. What creates light?", correctAnswer: "b", options: ["a) Cold air", "b) A bulb", "c) Ice", "d) Water"] },
                { id: 4, text: "4. Which color absorbs light?", correctAnswer: "c", options: ["a) White", "b) Yellow", "c) Black", "d) Red"] },
                { id: 5, text: "5. How does light travel?", correctAnswer: "d", options: ["a) Through sound", "b) In curves", "c) Through water", "d) In straight lines"] }
            ]
        },
        {
            id: 4,
            questions: [
                { id: 1, text: "1. What is sound?", correctAnswer: "b", options: ["a) A type of light", "b) Vibration we can hear", "c) A form of heat", "d) A type of energy"] },
                { id: 2, text: "2. What makes sound?", correctAnswer: "c", options: ["a) Silence", "b) Light", "c) Vibration", "d) Still air"] },
                { id: 3, text: "3. Which object produces sound?", correctAnswer: "b", options: ["a) A stone", "b) A drum", "c) Water", "d) A mirror"] },
                { id: 4, text: "4. How does sound travel?", correctAnswer: "c", options: ["a) Through light", "b) In water only", "c) Through air", "d) Through heat"] },
                { id: 5, text: "5. What affects sound loudness?", correctAnswer: "d", options: ["a) Color", "b) Size", "c) Shape", "d) Amplitude"] }
            ]
        },
        {
            id: 5,
            questions: [
                { id: 1, text: "1. What is motion?", correctAnswer: "b", options: ["a) A type of sound", "b) Movement of objects", "c) A form of light", "d) A type of heat"] },
                { id: 2, text: "2. What causes motion?", correctAnswer: "c", options: ["a) Stillness", "b) Silence", "c) Force", "d) Light"] },
                { id: 3, text: "3. Which object is in motion?", correctAnswer: "b", options: ["a) A parked car", "b) A rolling ball", "c) A closed door", "d) A still book"] },
                { id: 4, text: "4. What stops motion?", correctAnswer: "c", options: ["a) Speed", "b) Light", "c) Friction", "d) Sound"] },
                { id: 5, text: "5. How is motion measured?", correctAnswer: "d", options: ["a) In degrees", "b) In joules", "c) In liters", "d) In meters per second"] }
            ]
        }
    ]);

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
        let timer;
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
            setStartTime(new Date());
            setIsTimerRunning(true);
        }
    };

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.onstart = () => setIsPlaying(true);
            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = () => {
                setIsPlaying(false);
                setAudioError(true);
            };
            window.speechSynthesis.speak(utterance);
            setAudioError(false);
        } else {
            setAudioError(true);
        }
    };

    const stopSpeech = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        if (tasks.length > 0 && tasks[currentTaskIndex].questions.length > 0) {
            speakText(tasks[currentTaskIndex].questions[currentQuestionIndex].text);
        }
    }, [currentTaskIndex, currentQuestionIndex]);

    const handleAnswerSelect = (value) => {
        const newAnswers = [...answers];
        newAnswers[currentTaskIndex * 5 + currentQuestionIndex] = value;
        setAnswers(newAnswers);
        setSaveStatus(null);
    };

    const handleNext = () => {
        stopSpeech();
        if (currentQuestionIndex < tasks[currentTaskIndex].questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            if (currentTaskIndex < tasks.length - 1) {
                setCurrentTaskIndex(currentTaskIndex + 1);
                setCurrentQuestionIndex(0);
            }
        }
    };

    const handleSubmit = () => {
        stopSpeech();
        if (!user || !userId || !username || !email) {
            setSaveStatus('Please log in to submit quiz results.');
            return;
        }

        const marks = answers.map((answer, index) => {
            const taskIdx = Math.floor(index / 5);
            const qIdx = index % 5;
            return answer === tasks[taskIdx].questions[qIdx].correctAnswer ? 1 : 0;
        });

        const feedback = answers.map((answer, index) => {
            const taskIdx = Math.floor(index / 5);
            const qIdx = index % 5;
            return answer === tasks[taskIdx].questions[qIdx].correctAnswer;
        });

        setAnswerFeedback(feedback);

        const totalMarks = marks.reduce((sum, mark) => sum + mark, 0);
        if (startTime) {
            setTotalTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
        }

        setIsSubmitted(true);
        saveQuizResults(totalMarks, totalTime);
    };

    const saveQuizResults = async (totalMarks, finalTotalTime) => {
        try {
            const response = await axios.post('http://localhost:5000/api/v1/quizzes/saveQuizResults', {
                quizName: "AUDITORY",
                user,
                userId,
                username,
                email,
                totalMarks,
                totalTime: finalTotalTime,
                date: new Date().toISOString()
            });
            setSaveStatus('Quiz results saved successfully!');
        } catch (error) {
            setSaveStatus('Error saving quiz results. Please try again.');
        }
    };

    const resetQuiz = () => {
        setCurrentTaskIndex(0);
        setCurrentQuestionIndex(0);
        setTime(0);
        setTotalTime(0);
        setStartTime(null);
        setAnswers(Array(tasks.length * 5).fill(''));
        setIsTimerRunning(false);
        setIsSubmitted(false);
        setAnswerFeedback([]);
        setSaveStatus(null);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const allQuestionsAnswered = answers.length === tasks.length * 5 && answers.every(ans => ans);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 relative overflow-hidden">
            <div className="absolute top-10 left-10 text-4xl animate-bounce">🌟</div>
            <div className="absolute top-20 right-20 text-3xl animate-ping">⭐</div>
            <div className="absolute bottom-20 left-20 text-4xl animate-pulse">🎈</div>

            <div className="container mx-auto px-4 py-12">
                {saveStatus && (
                    <div className={`mb-4 p-4 rounded-lg ${saveStatus.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {saveStatus}
                    </div>
                )}

                <div className="text-center mb-8">
                    <div className="relative">
                        <div className="text-6xl mb-4 animate-bounce">🎧</div>
                        <h1 className="text-6xl font-bold text-white mb-6 animate-pulse">
                            🪄 Test 1 - Auditory Learning
                        </h1>
                    </div>
                    <div className="bg-white/90 rounded-3xl p-6 max-w-4xl mx-auto border-4 border-yellow-400 shadow-2xl">
                        <p className="text-2xl text-purple-800 font-bold mb-4">
                            Hi {username || 'Student'}! 👋 Listen to the audio and answer the questions!
                        </p>
                        <p className="text-lg text-blue-700">
                            🌟 Audio will play automatically - listen carefully! 🌟
                        </p>
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border-4 border-yellow-300">
                    {!isSubmitted ? (
                        <>
                            <h2 className="text-3xl font-semibold text-center mb-2 text-purple-800">
                                Auditory Test {tasks[currentTaskIndex].id} of {tasks.length}
                            </h2>
                            <h3 className="text-xl font-medium text-center mb-6 text-blue-700">
                                Listen and Select the Correct Answer
                            </h3>

                            <div className="text-center mb-6 bg-blue-100 p-4 rounded-xl">
                                <span className="text-2xl mr-6 font-bold text-blue-800">
                                    ⏱️ Time: {formatTime(totalTime)}
                                </span>
                                <span className="text-lg mr-6 text-gray-600">
                                    Current Task: {formatTime(time)}
                                </span>
                                <button
                                    onClick={handleStartTimer}
                                    disabled={isTimerRunning}
                                    className="bg-green-500 text-white px-6 py-3 rounded-full disabled:opacity-50 disabled:bg-gray-300 hover:bg-green-600 transition-colors font-bold text-lg"
                                >
                                    {isTimerRunning ? "⏰ Timer Running..." : "🚀 Start Now"}
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-dashed border-blue-300 hover:border-purple-400 transition-colors">
                                    <div className="flex items-center mb-4 justify-center">
                                        <span className="text-4xl mr-4">🎙️</span>
                                        <p className="text-2xl font-bold text-purple-800 text-center">
                                            {tasks[currentTaskIndex].questions[currentQuestionIndex].text}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {tasks[currentTaskIndex].questions[currentQuestionIndex].options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswerSelect(option[0])}
                                                className={`px-6 py-4 rounded-xl text-lg font-medium border-2 transition-all duration-300 ${answers[currentTaskIndex * 5 + currentQuestionIndex] === option[0] ? 'bg-purple-500 text-white border-purple-600 shadow-lg' : 'bg-gradient-to-r from-pink-200 to-purple-200 text-purple-800 border-purple-300 hover:from-pink-300 hover:to-purple-300'}`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-center mt-4">
                                        <button
                                            onClick={() => speakText(tasks[currentTaskIndex].questions[currentQuestionIndex].text)}
                                            disabled={isPlaying}
                                            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${isPlaying ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'}`}
                                        >
                                            {isPlaying ? (
                                                <>
                                                    <Play className="h-5 w-5 animate-pulse" />
                                                    <span>Playing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="h-5 w-5" />
                                                    <span>🔊 Replay Audio</span>
                                                </>
                                            )}
                                        </button>
                                        {isPlaying && (
                                            <button
                                                onClick={stopSpeech}
                                                className="flex items-center space-x-2 px-6 py-3 rounded-full font-bold bg-red-500 hover:bg-red-600 text-white transition-all duration-300 hover:scale-105 ml-4"
                                            >
                                                <Pause className="h-5 w-5" />
                                                <span>Stop</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={currentQuestionIndex === tasks[currentTaskIndex].questions.length - 1 && currentTaskIndex === tasks.length - 1 ? handleSubmit : handleNext}
                                disabled={!answers[currentTaskIndex * 5 + currentQuestionIndex] && currentQuestionIndex < tasks[currentTaskIndex].questions.length - 1}
                                className={`w-full py-4 text-xl font-bold rounded-full transition-colors ${currentQuestionIndex === tasks[currentTaskIndex].questions.length - 1 && currentTaskIndex === tasks.length - 1 ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                            >
                                {currentQuestionIndex < tasks[currentTaskIndex].questions.length - 1 ? 'Next' : currentTaskIndex < tasks.length - 1 ? 'Next Task' : 'Submit'}
                            </button>
                        </>
                    ) : (
                        <>
                            <h2 className="text-4xl font-bold text-center text-purple-900 mb-4">
                                🎉 Congratulations! You completed all activities!
                            </h2>
                            <div className="text-center mb-6">
                                <p className="text-xl font-semibold mb-2 text-green-800">
                                    Total Time Taken: {formatTime(totalTime)}
                                </p>
                                <p className="text-xl font-semibold text-green-800">
                                    Total Marks: {answers.filter((answer, index) => answer === tasks[Math.floor(index / 5)].questions[index % 5].correctAnswer).length} / {tasks.length * 5}
                                </p>
                            </div>
                            <div className="space-y-2 mb-8 max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg border-2 border-green-400">
                                {tasks.map(task => {
                                    const taskAnswers = answers.slice((task.id - 1) * 5, task.id * 5);
                                    const taskMarks = taskAnswers.filter((answer, idx) => answer === task.questions[idx].correctAnswer).length;
                                    return (
                                        <p key={task.id} className="text-lg text-gray-700">
                                            Task {task.id}: {taskMarks} / 5 marks
                                        </p>
                                    );
                                })}
                            </div>
                            <button
                                onClick={resetQuiz}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full text-xl transition-colors"
                            >
                                Restart Quiz
                            </button>
                            <div className="mt-6 text-center">
                                <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold">
                                    <Home size={24} /> Back to Home
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
