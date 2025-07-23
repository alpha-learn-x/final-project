import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircuitBoard, Home, BookOpen, Target, Award, HelpCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "@/components/Footer";
import Header from "@/components/Header.tsx";

interface ActivityForm {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    difficulty: string;
    duration: string;
    path: string;
    emoji: string;
    reward: string;
    story: string;
    videoUrl: string;
}

const AddActivity = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<ActivityForm>({
        id: "",
        title: "",
        description: "",
        icon: "",
        color: "",
        difficulty: "",
        duration: "",
        path: "",
        emoji: "",
        reward: "",
        story: "",
        videoUrl: ""
    });
    const [error, setError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSelectChange = (name: string) => (value: string) => {
        setFormData({ ...formData, [name]: value });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        setSuccessMessage("");

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch("http://localhost:5000/api/v1/activities", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    id: parseInt(formData.id)
                })
            });

            if (!response.ok) {
                throw new Error("Failed to create activity. Please check your input and try again.");
            }

            const data = await response.json();
            setSuccessMessage("Activity created successfully! Redirecting to activities...");
            setTimeout(() => {
                navigate('/activities');
            }, 2000);
        } catch (err) {
            setError(err.message || "An error occurred while creating the activity");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900/80 via-purple-900/80 to-green-900/80">
            {/* Navigation Bar */}
            <Header></Header>
            {/* Navigation Bar */}

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-4">Create New Activity</h1>
                        <p className="text-xl text-white/90">Add a new learning adventure for students!</p>
                    </div>

                    {/* Form */}
                    <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-blue-200">
                        <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                            <CardTitle className="text-2xl flex items-center justify-center">
                                <CircuitBoard className="mr-2 h-6 w-6" />
                                Add Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="text-center text-red-600 font-semibold">{error}</div>
                                )}
                                {successMessage && (
                                    <div className="text-center text-green-600 font-semibold">{successMessage}</div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="id" className="text-lg font-semibold text-gray-700">Activity ID</Label>
                                    <Input
                                        id="id"
                                        name="id"
                                        type="number"
                                        placeholder="Enter unique activity ID"
                                        value={formData.id}
                                        onChange={handleInputChange}
                                        className="h-12 text-lg border-2 border-gray-300 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-lg font-semibold text-gray-700">Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        type="text"
                                        placeholder="Enter activity title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="h-12 text-lg border-2 border-gray-300 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-lg font-semibold text-gray-700">Description</Label>
                                    <Input
                                        id="description"
                                        name="description"
                                        type="text"
                                        placeholder="Enter activity description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="h-12 text-lg border-2 border-gray-300 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="icon" className="text-lg font-semibold text-gray-700">Icon</Label>
                                    <Select onValueChange={handleSelectChange("icon")} value={formData.icon} required>
                                        <SelectTrigger className="h-12 text-lg border-2 border-gray-300 focus:border-blue-500">
                                            <SelectValue placeholder="Select icon" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CircuitBoard">CircuitBoard</SelectItem>
                                            <SelectItem value="Zap">Zap</SelectItem>
                                            <SelectItem value="Car">Car</SelectItem>
                                            <SelectItem value="Bot">Bot</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="color" className="text-lg font-semibold text-gray-700">Color</Label>
                                    <Select onValueChange={handleSelectChange("color")} value={formData.color} required>
                                        <SelectTrigger className="h-12 text-lg border-2 border-gray-300 focus:border-blue-500">
                                            <SelectValue placeholder="Select color" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="red">Red</SelectItem>
                                            <SelectItem value="yellow">Yellow</SelectItem>
                                            <SelectItem value="green">Green</SelectItem>
                                            <SelectItem value="purple">Purple</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="difficulty" className="text-lg font-semibold text-gray-700">Difficulty</Label>
                                    <Select onValueChange={handleSelectChange("difficulty")} value={formData.difficulty} required>
                                        <SelectTrigger className="h-12 text-lg border-2 border-gray-300 focus:border-blue-500">
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration" className="text-lg font-semibold text-gray-700">Duration</Label>
                                    <Input
                                        id="duration"
                                        name="duration"
                                        type="text"
                                        placeholder="e.g., 30 min"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        className="h-12 text-lg border-2 border-gray-300 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="path" className="text-lg font-semibold text-gray-700">Path</Label>
                                    <Input
                                        id="path"
                                        name="path"
                                        type="text"
                                        placeholder="e.g., /activity/circuit"
                                        value={formData.path}
                                        onChange={handleInputChange}
                                        className="h-12 text-lg border-2 border-gray-300 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="emoji" className="text-lg font-semibold text-gray-700">Emoji</Label>
                                    <Input
                                        id="emoji"
                                        name="emoji"
                                        type="text"
                                        placeholder="e.g., ⚡"
                                        value={formData.emoji}
                                        onChange={handleInputChange}
                                        className="h-12 text-lg border-2 border-gray-300 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reward" className="text-lg font-semibold text-gray-700">Reward</Label>
                                    <Input
                                        id="reward"
                                        name="reward"
                                        type="text"
                                        placeholder="e.g., Lightning Badge"
                                        value={formData.reward}
                                        onChange={handleInputChange}
                                        className="h-12 text-lg border-2 border-gray-300 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="story" className="text-lg font-semibold text-gray-700">Story</Label>
                                    <Input
                                        id="story"
                                        name="story"
                                        type="text"
                                        placeholder="Enter activity story"
                                        value={formData.story}
                                        onChange={handleInputChange}
                                        className="h-12 text-lg border-2 border-gray-300 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="videoUrl" className="text-lg font-semibold text-gray-700">Video URL</Label>
                                    <Input
                                        id="videoUrl"
                                        name="videoUrl"
                                        type="url"
                                        placeholder="e.g., https://example.com/video"
                                        value={formData.videoUrl}
                                        onChange={handleInputChange}
                                        className="h-12 text-lg border-2 border-gray-300 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl py-4 h-14 font-bold"
                                >
                                    {isSubmitting ? "Creating Activity..." : "Create Activity"}
                                </Button>
                            </form>
                            <div className="mt-6 text-center">
                                <Link to="/activities" className="text-blue-600 hover:text-blue-800 font-semibold">
                                    Back to Activities
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AddActivity;