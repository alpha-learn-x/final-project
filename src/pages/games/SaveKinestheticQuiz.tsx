import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Save } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header.tsx";

interface Image {
    id: string;
    src: string;
}

interface Task {
    question: string;
    images: Image[];
    options: string[];
    correctAnswers: { [key: string]: string };
}

const SaveKinestheticQuiz: React.FC = () => {
    const [quizName, setQuizName] = useState("KINESTHETIC");
    const [task, setTask] = useState<Task>({
        question: "",
        images: Array(5).fill({ id: "", src: "" }),
        options: Array(5).fill(""),
        correctAnswers: {},
    });
    const [saveStatus, setSaveStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const isValidUrl = (url: string) => {
        if (!url) return true;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleQuestionChange = (value: string) => {
        setTask((prev) => ({ ...prev, question: value }));
    };

    const handleImageChange = (index: number, field: keyof Image, value: string) => {
        setTask((prev) => {
            const newImages = [...prev.images];
            newImages[index] = { ...newImages[index], [field]: value };
            return { ...prev, images: newImages };
        });
    };

    const handleOptionChange = (index: number, value: string) => {
        setTask((prev) => {
            const newOptions = [...prev.options];
            newOptions[index] = value;

            // Update correctAnswers keys if option keys change
            const newCorrectAnswers: { [key: string]: string } = {};
            newOptions.forEach((opt, i) => {
                const oldKey = Object.keys(prev.correctAnswers)[i];
                const oldVal = prev.correctAnswers[oldKey] || "";
                newCorrectAnswers[opt || `Option${i + 1}`] = oldVal;
            });

            return { ...prev, options: newOptions, correctAnswers: newCorrectAnswers };
        });
    };

    const handleCorrectAnswerChange = (key: string, value: string) => {
        setTask((prev) => ({
            ...prev,
            correctAnswers: { ...prev.correctAnswers, [key]: value },
        }));
    };

    const validateTask = () => {
        if (!task.question.trim()) {
            return "Task question is required";
        }
        if (task.images.length !== 5 || task.options.length !== 5) {
            return "Exactly 5 images and 5 options are required";
        }
        if (Object.keys(task.correctAnswers).length !== 5) {
            return "5 correct answers are required";
        }
        if (task.images.some((img) => !img.id.trim() || !img.src.trim() || !isValidUrl(img.src))) {
            return "All images must have valid IDs and valid URL sources";
        }
        if (task.options.some((opt) => !opt.trim())) {
            return "All options must be filled";
        }
        if (Object.values(task.correctAnswers).some((ans) => !ans.trim())) {
            return "All correct answers must be filled";
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSaveStatus(null);

        const validationError = validateTask();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const matchItems = task.images.map((img, i) => ({
                id: img.id,
                text: task.options[i],
                imageUrl: img.src,
            }));

            const payload = {
                quizName,
                question: task.question,
                matchItems,
                correctPairs: task.correctAnswers,
            };

            const response = await axios.post(
                "http://localhost:5000/api/v1/quizzes/kinesthetic/create",
                payload
            );

            setSaveStatus("✅ Kinesthetic quiz saved successfully!");
            console.log("Saved:", response.data);

            // Reset form
            setTask({
                question: "",
                images: Array(5).fill({ id: "", src: "" }),
                options: Array(5).fill(""),
                correctAnswers: {},
            });
        } catch (err: any) {
            setError("❌ Failed to save quiz: " + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-300 to-indigo-400 relative overflow-hidden">
            <div className="absolute top-10 left-10 text-4xl animate-bounce">🎯</div>
            <div className="absolute top-20 right-20 text-3xl animate-ping">🌀</div>
            <div className="absolute bottom-20 left-20 text-4xl animate-pulse">✨</div>

            <Header />

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {saveStatus && (
                    <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-700">{saveStatus}</div>
                )}
                {error && <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-700">{error}</div>}

                <div className="text-center mb-16">
                    <div className="relative">
                        <h1 className="text-6xl font-bold text-white mb-6 animate-pulse">
                            🧩 Create Kinesthetic Quiz
                        </h1>
                        <div className="bg-white/90 rounded-3xl p-6 max-w-4xl mx-auto border-4 border-green-400 shadow-2xl">
                            <p className="text-2xl text-blue-800 font-bold mb-4">
                                Task with a question, 5 images (ID & URL), 5 options, and 5 correct answers
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border-4 border-blue-300"
                >
                    <div className="mb-8">
                        <label className="block font-medium mb-2">Question</label>
                        <input
                            type="text"
                            value={task.question}
                            onChange={(e) => handleQuestionChange(e.target.value)}
                            className="w-full mb-4 p-3 border rounded-lg border-blue-300 focus:outline-none focus:border-blue-500"
                            placeholder="Enter task question"
                            required
                        />
                    </div>

                    <label className="block font-medium mb-2">Images (ID & URL)</label>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="grid grid-cols-2 gap-4 mb-2">
                            <input
                                type="text"
                                value={task.images[i]?.id || ""}
                                onChange={(e) => handleImageChange(i, "id", e.target.value)}
                                className="p-2 border rounded"
                                placeholder={`Image ${i + 1} ID`}
                                required
                            />
                            <input
                                type="url"
                                value={task.images[i]?.src || ""}
                                onChange={(e) => handleImageChange(i, "src", e.target.value)}
                                className="p-2 border rounded"
                                placeholder={`Image ${i + 1} URL (https://...)`}
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
                            onChange={(e) => handleOptionChange(i, e.target.value)}
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
                                value={task.correctAnswers[option || `Option${i + 1}`] || ""}
                                onChange={(e) =>
                                    handleCorrectAnswerChange(option || `Option${i + 1}`, e.target.value)
                                }
                                className="w-full p-2 border rounded"
                                placeholder={`Correct answer for ${option || `Option ${i + 1}`}`}
                                required
                            />
                        </div>
                    ))}

                    <div className="flex justify-end mt-8">
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-12 py-3 rounded-full"
                        >
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
