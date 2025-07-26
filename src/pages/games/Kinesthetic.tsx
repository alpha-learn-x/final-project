import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import axios from 'axios';

const Kinesthetic = () => {
    const tasks = [
        {
            id: 1,
            images: [
                { id: "open", src: "https://via.placeholder.com/50?text=Open" },
                { id: "closed", src: "https://via.placeholder.com/50?text=Closed" },
                { id: "parallel", src: "https://via.placeholder.com/50?text=Parallel" },
                { id: "series", src: "https://via.placeholder.com/50?text=Series" },
                { id: "short", src: "https://via.placeholder.com/50?text=Short" }
            ],
            options: [
                "Open Circuit",
                "Closed Circuit",
                "Parallel circuit",
                "Series Circuit",
                "Short Circuit"
            ]
        },
        {
            id: 2,
            images: [
                { id: "resistor", src: "https://via.placeholder.com/50?text=Resistor" },
                { id: "bulb", src: "https://via.placeholder.com/50?text=Bulb" },
                { id: "battery", src: "https://via.placeholder.com/50?text=Battery" },
                { id: "switch", src: "https://via.placeholder.com/50?text=Switch" },
                { id: "wire", src: "https://via.placeholder.com/50?text=Wire" }
            ],
            options: [
                "Battery",
                "Wire",
                "Resistor",
                "Bulb",
                "Switch"
            ]
        },
        {
            id: 3,
            images: [
                { id: "fan", src: "https://via.placeholder.com/50?text=Fan" },
                { id: "motor", src: "https://via.placeholder.com/50?text=Motor" },
                { id: "buzzer", src: "https://via.placeholder.com/50?text=Buzzer" },
                { id: "speaker", src: "https://via.placeholder.com/50?text=Speaker" },
                { id: "led", src: "https://via.placeholder.com/50?text=LED" }
            ],
            options: [
                "LED",
                "Motor",
                "Fan",
                "Buzzer",
                "Speaker"
            ]
        },
        {
            id: 4,
            images: [
                { id: "dc", src: "https://via.placeholder.com/50?text=DC" },
                { id: "ac", src: "https://via.placeholder.com/50?text=AC" },
                { id: "solar", src: "https://via.placeholder.com/50?text=Solar" },
                { id: "wind", src: "https://via.placeholder.com/50?text=Wind" },
                { id: "hydro", src: "https://via.placeholder.com/50?text=Hydro" }
            ],
            options: [
                "AC Power",
                "DC Power",
                "Solar Energy",
                "Wind Energy",
                "Hydro Power"
            ]
        },
        {
            id: 5,
            images: [
                { id: "lamp", src: "https://via.placeholder.com/50?text=Lamp" },
                { id: "heater", src: "https://via.placeholder.com/50?text=Heater" },
                { id: "fridge", src: "https://via.placeholder.com/50?text=Fridge" },
                { id: "tv", src: "https://via.placeholder.com/50?text=TV" },
                { id: "charger", src: "https://via.placeholder.com/50?text=Charger" }
            ],
            options: [
                "Fridge",
                "TV",
                "Lamp",
                "Heater",
                "Charger"
            ]
        }
    ];

    const correctAnswersMap = {
        1: {
            "Open Circuit": "open",
            "Closed Circuit": "closed",
            "Parallel circuit": "parallel",
            "Series Circuit": "series",
            "Short Circuit": "short"
        },
        2: {
            "Battery": "battery",
            "Wire": "wire",
            "Resistor": "resistor",
            "Bulb": "bulb",
            "Switch": "switch"
        },
        3: {
            "LED": "led",
            "Motor": "motor",
            "Fan": "fan",
            "Buzzer": "buzzer",
            "Speaker": "speaker"
        },
        4: {
            "AC Power": "ac",
            "DC Power": "dc",
            "Solar Energy": "solar",
            "Wind Energy": "wind",
            "Hydro Power": "hydro"
        },
        5: {
            "Fridge": "fridge",
            "TV": "tv",
            "Lamp": "lamp",
            "Heater": "heater",
            "Charger": "charger"
        }
    };

    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [time, setTime] = useState(0);
    const [draggedImage, setDraggedImage] = useState(null);
    const [droppedItems, setDroppedItems] = useState({});
    const [startTime, setStartTime] = useState(null);
    const [results, setResults] = useState([]);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [totalTime, setTotalTime] = useState(0);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    // User data states
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [user, setUser] = useState('');

    const task = tasks[currentTaskIndex];

    // Load user data on component mount
    useEffect(() => {
        const userDataStr = localStorage.getItem('currentUser');
        if (!userDataStr) {
            console.warn("No currentUser found in localStorage");
            setSaveStatus('Please log in to start the quiz.');
            return;
        }
        try {
            const userData = JSON.parse(userDataStr);
            console.log("Loaded user data:", userData);
            setUser(userData.id || '');
            setUserId(userData.userId || '');
            setUsername(userData.userName || '');
            setEmail(userData.email || '');
        } catch (err) {
            console.error("Failed to parse user data from localStorage", err);
            setSaveStatus('Error loading user data. Please log in again.');
        }
    }, []);

    // Timer effect
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

    const handleDragStart = (e, imageId) => {
        setDraggedImage(imageId);
        e.dataTransfer.setData("text/plain", imageId);
    };

    const handleDrop = (e, option) => {
        e.preventDefault();
        const imageId = draggedImage || e.dataTransfer.getData("text/plain");
        if (imageId && !droppedItems[option]) {
            setDroppedItems(prev => ({
                ...prev,
                [option]: imageId
            }));
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    const calculateMarks = () => {
        const correctAnswers = correctAnswersMap[task.id];
        let correct = 0;

        task.options.forEach(option => {
            const userAnswer = droppedItems[option];
            const correctAnswer = correctAnswers[option];
            const isCorrect = userAnswer === correctAnswer;

            console.log(`${option}: User answered "${userAnswer || 'none'}", Correct answer is "${correctAnswer}" - ${isCorrect ? 'CORRECT (+1 mark)' : 'WRONG (0 marks)'}`);

            if (isCorrect) {
                correct++;
            }
        });

        console.log(`Task ${task.id} Marks: ${correct}/${task.options.length}`);
        return correct;
    };

    const isComplete = Object.keys(droppedItems).length === task.options.length;

    // When task is completed, add marks for that task to results
    useEffect(() => {
        if (isComplete && isTimerRunning) {
            const marks = calculateMarks();
            const taskResult = {
                taskId: task.id,
                timeTaken: time,
                marks: marks
            };

            setResults(prev => {
                if (prev.some(r => r.taskId === task.id)) return prev;
                const newResults = [...prev, taskResult];
                console.log("Updated results:", newResults);
                return newResults;
            });
        }
    }, [isComplete, isTimerRunning, time, task.id]);

    const saveQuizResults = async (finalResults, finalTotalTime) => {
        if (!user || !userId || !username || !email) {
            setSaveStatus('Error: Please log in to submit quiz results.');
            console.warn("User data missing", { user, userId, username, email });
            return;
        }

        const totalMarks = finalResults.reduce((acc, r) => acc + r.marks, 0);

        console.log("Preparing to save quiz results:", {
            quizName: "KINESTHETIC",
            user,
            userId,
            username,
            email,
            totalMarks,
            totalTime: finalTotalTime,
            date: new Date().toISOString(),
            taskResults: finalResults
        });

        try {
            const response = await axios.post('http://localhost:5000/api/v1/quizzes/saveQuizResults', {
                quizName: "KINESTHETIC",
                user,
                userId,
                username,
                email,
                totalMarks,
                totalTime: finalTotalTime,
                date: new Date().toISOString(),
                taskResults: finalResults
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setSaveStatus('Quiz results saved successfully!');
            console.log('Quiz results saved:', response.data);
        } catch (error) {
            setSaveStatus('Error saving quiz results. Please try again.');
            console.error('Error saving quiz results:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
        }
    };

    const handleNextActivity = () => {
        if (!isComplete) return;

        setResults(prev => {
            if (prev.some(r => r.taskId === task.id)) return prev;

            const currentMarks = calculateMarks();
            const currentTaskResult = {
                taskId: task.id,
                timeTaken: time,
                marks: currentMarks
            };

            const updatedResults = [...prev, currentTaskResult];
            return updatedResults;
        });

        if (currentTaskIndex < tasks.length - 1) {
            setCurrentTaskIndex(prev => prev + 1);
            setTime(0);
            setDroppedItems({});
        } else {
            setIsTimerRunning(false);
            setIsQuizCompleted(true);

            setResults(prev => {
                const finalResults = prev.some(r => r.taskId === task.id)
                    ? prev
                    : [...prev, {
                        taskId: task.id,
                        timeTaken: time,
                        marks: calculateMarks()
                    }];

                const totalMarks = finalResults.reduce((acc, r) => acc + r.marks, 0);
                const maxPossibleMarks = tasks.length * 5;
                finalResults.forEach(result => {
                    console.log(`Task ${result.taskId}: ${result.marks}/5 marks (Time: ${result.timeTaken}s)`);
                });

                saveQuizResults(finalResults, totalTime);

                alert(`All activities completed!\nTotal Score: ${totalMarks}/${maxPossibleMarks} marks\nTotal Time: ${Math.floor(totalTime / 60)}:${(totalTime % 60).toString().padStart(2, '0')}`);

                return finalResults;
            });
        }
    };

    const resetQuiz = () => {
        setCurrentTaskIndex(0);
        setTime(0);
        setTotalTime(0);
        setStartTime(null);
        setDroppedItems({});
        setResults([]);
        setIsTimerRunning(false);
        setIsQuizCompleted(false);
        setSaveStatus(null);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

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
                        <div className="text-6xl mb-4 animate-bounce">🧠</div>
                        <h1 className="text-6xl font-bold text-white mb-6 animate-pulse">
                            🪄 Test 2 - Kinesthetic Learning
                        </h1>
                    </div>
                    <div className="bg-white/90 rounded-3xl p-6 max-w-4xl mx-auto border-4 border-yellow-400 shadow-2xl">
                        <p className="text-2xl text-purple-800 font-bold mb-4">
                            Hi {username || 'Student'}! 👋 Let's test your drag and drop skills!
                        </p>
                        <p className="text-lg text-blue-700">
                            🌟 Drag the images to their correct positions! 🌟
                        </p>
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border-4 border-yellow-300">
                    {!isQuizCompleted ? (
                        <>
                            <h2 className="text-3xl font-semibold text-center mb-2 text-purple-800">
                                Kinesthetic Test {task.id} of {tasks.length}
                            </h2>
                            <h3 className="text-xl font-medium text-center mb-6 text-blue-700">
                                Drag and Drop to correct Position
                            </h3>

                            <div className="border border-gray-400 grid grid-cols-5 gap-4 p-4 mb-6 bg-gray-50 rounded-xl">
                                {task.images.map((img) => (
                                    <div
                                        key={img.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, img.id)}
                                        className="bg-white w-24 h-24 flex items-center justify-center cursor-move hover:bg-blue-50 transition-colors border-2 border-gray-300 rounded-lg shadow-md hover:shadow-lg"
                                    >
                                        <img src={img.src} alt={img.id} className="w-12 h-12" />
                                    </div>
                                ))}
                            </div>

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
                                {task.options.map((option, index) => (
                                    <div
                                        key={index}
                                        onDrop={(e) => handleDrop(e, option)}
                                        onDragOver={handleDragOver}
                                        className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 flex justify-between items-center rounded-xl border-2 border-dashed border-blue-300 hover:border-purple-400 transition-colors"
                                    >
                                        <span className="font-bold text-lg text-gray-800">
                                            {index + 1}. {option}
                                        </span>
                                        <div className="w-28 h-20 bg-white rounded-lg border border-gray-300 shadow-inner flex items-center justify-center">
                                            {droppedItems[option] ? (
                                                <img
                                                    src={task.images.find(img => img.id === droppedItems[option])?.src}
                                                    alt={droppedItems[option]}
                                                    className="w-16 h-16"
                                                />
                                            ) : (
                                                <span className="text-gray-400 italic">Drop here</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleNextActivity}
                                disabled={!isComplete}
                                className={`w-full py-4 text-xl font-bold rounded-full transition-colors
                                    ${isComplete ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-400 cursor-not-allowed text-gray-200'}`}
                            >
                                {currentTaskIndex < tasks.length - 1 ? "Next Activity" : "Finish Test"}
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
                                    Total Marks: {results.reduce((acc, r) => acc + r.marks, 0)} / {tasks.length * 5}
                                </p>
                            </div>
                            <div className="space-y-2 mb-8 max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg border-2 border-green-400">
                                {results.map(r => (
                                    <p key={r.taskId} className="text-lg text-gray-700">
                                        Task {r.taskId}: {r.marks} / 5 marks (Time: {formatTime(r.timeTaken)})
                                    </p>
                                ))}
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

export default Kinesthetic;