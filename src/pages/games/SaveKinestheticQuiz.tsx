import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Save } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.tsx';

interface Image {
    id: string;
    src: string;
}

interface Task {
    id: number;
    images: Image[];
    options: string[];
    correctAnswers: { [key: string]: string };
}

const SaveKinestheticQuiz: React.FC = () => {
    const [quizName, setQuizName] = useState('KINESTHETIC');
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: 1,
            images: Array(5).fill({ id: '', src: '' }),
            options: Array(5).fill(''),
            correctAnswers: {},
        },
    ]);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Optional: Validate URL format
    const isValidUrl = (url: string) => {
        if (!url) return true; // Allow empty for now, validate on submit
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleImageChange = (taskIndex: number, imageIndex: number, field: keyof Image, value: string) => {
        const updated = [...tasks];
        updated[taskIndex].images[imageIndex] = {
            ...updated[taskIndex].images[imageIndex],
            [field]: value,
        };
        setTasks(updated);
    };

    const handleOptionChange = (taskIndex: number, optionIndex: number, value: string) => {
        const updated = [...tasks];
        updated[taskIndex].options[optionIndex] = value;
        // Update correctAnswers keys to match options
        const newCorrectAnswers: { [key: string]: string } = {};
        updated[taskIndex].options.forEach((opt, i) => {
            const key = opt || `Option${i + 1}`;
            newCorrectAnswers[key] = updated[taskIndex].correctAnswers[updated[taskIndex].options[i] || `Option${i + 1}`] || '';
        });
        updated[taskIndex].correctAnswers = newCorrectAnswers;
        setTasks(updated);
    };

    const handleCorrectAnswerChange = (taskIndex: number, key: string, value: string) => {
        const updated = [...tasks];
        updated[taskIndex].correctAnswers[key] = value;
        setTasks(updated);
    };

    const addTask = () => {
        setTasks(prev => [
            ...prev,
            {
                id: prev.length + 1,
                images: Array(5).fill({ id: '', src: '' }),
                options: Array(5).fill(''),
                correctAnswers: {},
            },
        ]);
    };

    const removeTask = (index: number) => {
        const filtered = tasks.filter((_, i) => i !== index).map((t, i) => ({ ...t, id: i + 1 }));
        setTasks(filtered);
    };

    const validateTasks = () => {
        for (let task of tasks) {
            if (!task.id || task.images.length !== 5 || task.options.length !== 5 || Object.keys(task.correctAnswers).length !== 5) {
                return 'Each task must have 5 images, 5 options, and 5 correct answers';
            }
            if (task.images.some(img => !img.id || !img.src || !isValidUrl(img.src))) {
                return 'All images must have valid IDs and URL sources';
            }
            if (task.options.some(opt => !opt)) {
                return 'All options must be filled';
            }
            if (Object.values(task.correctAnswers).some(ans => !ans)) {
                return 'All correct answers must be filled';
            }
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSaveStatus(null);

        const validationError = validateTasks();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/v1/quizzes/kinesthetic/tasks', {
                quizName,
                tasks,
            });
            setSaveStatus('✅ Kinesthetic quiz saved successfully!');
            console.log('Saved:', response.data);
        } catch (err: any) {
            setError('❌ Failed to save quiz: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-300 to-indigo-400 relative overflow-hidden">
            <div className="absolute top-10 left-10 text-4xl animate-bounce">🎯</div>
            <div className="absolute top-20 right-20 text-3xl animate-ping">🌀</div>
            <div className="absolute bottom-20 left-20 text-4xl animate-pulse">✨</div>

            <Header />

            <div className="container mx-auto px-4 py-12">
                {saveStatus && <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-700">{saveStatus}</div>}
                {error && <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-700">{error}</div>}

                <div className="text-center mb-16">
                    <div className="relative">
                        <h1 className="text-6xl font-bold text-white mb-6 animate-pulse">🧩 Create Kinesthetic Quiz</h1>
                        <div className="bg-white/90 rounded-3xl p-6 max-w-4xl mx-auto border-4 border-green-400 shadow-2xl">
                            <p className="text-2xl text-blue-800 font-bold mb-4">
                                Each task has 5 images (with IDs and URLs), 5 options, and 5 correct answers
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border-4 border-blue-300">
                    <div className="mb-8">
                        <label className="block text-lg font-bold text-blue-800 mb-2">Quiz Name</label>
                        <input
                            type="text"
                            value={quizName}
                            onChange={(e) => setQuizName(e.target.value)}
                            className="w-full p-3 rounded-lg border-2 border-blue-300 focus:outline-none focus:border-blue-500"
                            placeholder="Quiz Name"
                            required
                        />
                    </div>

                    {tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
                            <h3 className="text-xl font-bold text-blue-800 mb-4">Task {task.id}</h3>
                            <label className="block font-medium mb-2">Images</label>
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="grid grid-cols-2 gap-4 mb-2">
                                    <input
                                        type="text"
                                        value={task.images[i]?.id || ''}
                                        onChange={(e) => handleImageChange(taskIndex, i, 'id', e.target.value)}
                                        className="p-2 border rounded"
                                        placeholder={`Image ${i + 1} ID`}
                                        required
                                    />
                                    <input
                                        type="url"
                                        value={task.images[i]?.src || ''}
                                        onChange={(e) => handleImageChange(taskIndex, i, 'src', e.target.value)}
                                        className="p-2 border rounded"
                                        placeholder={`Image ${i + 1} URL (e.g., https://example.com/image.jpg)`}
                                        required
                                    />
                                </div>
                            ))}

                            <label className="block font-medium mt-4 mb-2">Options</label>
                            {task.options.map((opt, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    value={opt}
                                    onChange={(e) => handleOptionChange(taskIndex, i, e.target.value)}
                                    className="w-full mb-2 p-2 border rounded"
                                    placeholder={`Option ${i + 1}`}
                                    required
                                />
                            ))}

                            <label className="block font-medium mt-4 mb-2">Correct Answers</label>
                            {task.options.map((option, i) => (
                                <div key={i} className="mb-2">
                                    <label className="text-sm text-gray-600">{option || `Option ${i + 1}`}</label>
                                    <input
                                        type="text"
                                        value={task.correctAnswers[option || `Option${i + 1}`] || ''}
                                        onChange={(e) => handleCorrectAnswerChange(taskIndex, option || `Option${i + 1}`, e.target.value)}
                                        className="w-full p-2 border rounded"
                                        placeholder={`Correct Answer for ${option || `Option ${i + 1}`}`}
                                        required
                                    />
                                </div>
                            ))}

                            {tasks.length > 1 && (
                                <Button type="button" onClick={() => removeTask(taskIndex)} className="bg-red-500 text-white mt-4">
                                    Remove Task
                                </Button>
                            )}
                        </div>
                    ))}

                    <div className="flex justify-between mb-8">
                        <Button type="button" onClick={addTask} className="bg-green-500 text-white px-6 py-3 rounded-lg">
                            + Add Task
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-12 py-3 rounded-full">
                            <Save className="inline mr-2" /> Save Quiz
                        </Button>
                    </div>
                </form>

                <div className="flex justify-center mt-8">
                    <Link to="/">
                        <Button className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-8 py-4 rounded-full">
                            <Home className="mr-3 h-5 w-5" /> Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SaveKinestheticQuiz;