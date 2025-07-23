import { Link, useNavigate } from "react-router-dom";
import {
    Trophy,
    Users,
    Award,
    Home,
    ChevronRight,
    User,
    FileText,
    MessageSquare,
    LogOut,
    Bell,
    Search,
    Volume2,
    VolumeX,
    Bot,
    Target,
    HelpCircle,
    BookOpen,
    ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import axios from "axios";

interface QuizResult {
    _id: string;
    quizName: string;
    totalMarks: number;
    date: string;
    username: string;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const [isSoundEnabled, setIsSoundEnabled] = useState(false);
    const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userName = currentUser.userName || 'User';
    const isTeacher = currentUser.role === 'TEACHER';

    const toggleSound = () => {
        setIsSoundEnabled(!isSoundEnabled);
    };

    const studentProgress = [
        { activity: "Simple Electric Circuit", progress: 100, completed: true },
        { activity: "Building a Simple Motor", progress: 75, completed: false },
        { activity: "Traffic Light Automation", progress: 30, completed: false },
        { activity: "Building a Simple Robot", progress: 0, completed: false }
    ];

    const chartData = [
        { activity: "Activity 1", performance: 850, hours: 12 },
        { activity: "Activity 2", performance: 750, hours: 8 },
        { activity: "Activity 3", performance: 300, hours: 4 },
        { activity: "Activity 4", performance: 0, hours: 0 },
    ];

    const performanceData = [
        { name: "Completed", value: 25, color: "#22c55e" },
        { name: "In Progress", value: 50, color: "#3b82f6" },
        { name: "Not Started", value: 25, color: "#e5e7eb" }
    ];

    // New data based on the Teacher Dashboard image
    const teacherMetrics = {
        totalStudents: 128,
        activeLearners: 45,
        averageProgress: 84,
        needAttention: 7
    };

    const learningModalities = [
        { name: "Visual", value: 75 },
        { name: "Auditory", value: 65 },
        { name: "Kinesthetic", value: 70 },
        { name: "Reading", value: 60 }
    ];

    const weakestAreas = [
        { name: "Math Concepts", value: 30 },
        { name: "Reading Comprehension", value: 25 },
        { name: "Science Experiments", value: 20 },
        { name: "Creative Writing", value: 25 }
    ];

    const sidebarItems = [
        { name: "Overview", icon: Home, active: true },
        { name: "Reports", icon: FileText, path: "/reports" },
        { name: "Students", icon: FileText, path: "/students" },
        ...(isTeacher ? [{ name: "Add New Activity", icon: MessageSquare, path: "/add-activity" }] : [])
    ];

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        navigate('/signin');
    };

    useEffect(() => {
        const fetchQuizResults = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:5000/api/v1/quizzes/get-all-quiz-results', {
                    params: isTeacher ? {} : { searchText: userName }
                });
                setQuizResults(response.data.data);
            } catch (error: any) {
                console.error('Error fetching quiz results:', error.response?.data || error.message);
                setError('Failed to load quiz results. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (isTeacher || userName !== 'User') {
            fetchQuizResults();
        } else {
            setError('No user logged in. Please sign in to view quiz results.');
            setLoading(false);
        }
    }, [userName, isTeacher]);

    const filteredQuizResults = quizResults.filter((result) =>
        result.quizName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex flex-col">
            <div className="flex flex-1">
                {/* Sidebar */}
                <div className="w-80 bg-gradient-to-b from-yellow-200 via-yellow-300 to-yellow-400 p-6 flex flex-col">
                    <div className="text-center mb-8">
                        <div
                            className="w-24 h-24 bg-pink-300 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white">
                            <img src="/uploads/00d4cb2f-56bd-4d1f-955b-70e4a28236e0.png" alt="Student"
                                 className="w-20 h-20 rounded-full object-cover"/>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Hello {userName}! 👋</h2>
                        <p className="text-sm text-gray-600">Let's check your progress</p>
                    </div>
                    <nav className="flex-1 space-y-2">
                        {sidebarItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path || "#"}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    item.active
                                        ? 'bg-white text-gray-800 shadow-md'
                                        : 'text-gray-700 hover:bg-yellow-300'
                                }`}
                            >
                                <item.icon className="h-5 w-5"/>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-10">
                        <div
                            className="w-20 h-20 bg-blue-300 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white">
                            <img src="/Uploads/00d4cb2f-56bd-4d1f-955b-70e4a28236e0.png" alt="Student"
                                 className="w-20 h-20 rounded-full object-cover border-white"/>
                            <User className="w-12 h-12 text-blue-600"/>
                        </div>
                        <Button
                            onClick={handleLogout}
                            className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
                        >
                            <LogOut className="w-4 h-4 mr-2"/>
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-6">
                            <Link to="/" className="text-blue-800 font-bold border-b-2 border-blue-400 flex items-center">
                                <Home className="mr-1 h-4 w-4" />
                                Home
                            </Link>
                            <Link to="/subjects" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                                <BookOpen className="mr-1 h-4 w-4" />
                                Subjects
                            </Link>
                            <Link to="/activities" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                                <Target className="mr-1 h-4 w-4" />
                                Activities
                            </Link>
                            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                                <BookOpen className="mr-1 h-4 w-4" />
                                Dashboard
                            </Link>
                            <Link to="/certificates" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                                <Award className="mr-1 h-4 w-4" />
                                Certificates
                            </Link>
                            <Link to="/help" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                                <HelpCircle className="mr-1 h-4 w-4" />
                                Help
                            </Link>
                            <Link to="/game-context" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                                <Target className="mr-1 h-4 w-4" />
                                Games
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button
                                onClick={handleLogout}
                                className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
                            >
                                <LogOut className="w-4 h-4 mr-2"/>
                                Logout
                            </Button>
                        </div>
                    </div>

                    {/* Welcome Card */}
                    <Card className="bg-gradient-to-r from-pink-100 to-pink-200 mb-8 border-pink-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-pink-800 mb-2">Teacher Dashboard</h3>
                                    <p className="text-pink-600">Welcome back! Here's what's happening with your students today.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card className="bg-purple-100 border-purple-200">
                            <CardContent className="p-6 text-center">
                                <p className="text-purple-800">Total Students</p>
                                <h3 className="text-2xl font-bold text-purple-900">{teacherMetrics.totalStudents}</h3>
                                <p className="text-sm text-purple-600">Active learners: {teacherMetrics.activeLearners}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-green-100 border-green-200">
                            <CardContent className="p-6 text-center">
                                <p className="text-green-800">Activities Assigned</p>
                                <h3 className="text-2xl font-bold text-green-900">{teacherMetrics.activeLearners}</h3>
                                <p className="text-sm text-green-600">+12% from last week</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-blue-100 border-blue-200">
                            <CardContent className="p-6 text-center">
                                <p className="text-blue-800">Average Progress</p>
                                <h3 className="text-2xl font-bold text-blue-900">{teacherMetrics.averageProgress}%</h3>
                                <p className="text-sm text-blue-600">Class completion rate +3% from last week</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-yellow-100 border-yellow-200">
                            <CardContent className="p-6 text-center">
                                <p className="text-yellow-800">Need Attention</p>
                                <h3 className="text-2xl font-bold text-yellow-900">{teacherMetrics.needAttention}</h3>
                                <p className="text-sm text-yellow-600">Students struggling +2% from last week</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-white border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-blue-800">Learning Modalities Distribution</CardTitle>
                                <p className="text-gray-600">Student performance across different learning styles</p>
                            </CardHeader>
                            <CardContent>
                                {/* Bar Chart for Learning Modalities */}
                                {/*<chartjs type="bar" data={{*/}
                                {/*    labels: learningModalities.map(item => item.name),*/}
                                {/*    datasets: [{*/}
                                {/*        label: 'Performance',*/}
                                {/*        data: learningModalities.map(item => item.value),*/}
                                {/*        backgroundColor: '#8B5CF6',*/}
                                {/*        borderColor: '#7C3AED',*/}
                                {/*        borderWidth: 1*/}
                                {/*    }]*/}
                                {/*}} options={{*/}
                                {/*    scales: {y: {beginAtZero: true, max: 100}},*/}
                                {/*    plugins: { legend: { display: false } }*/}
                                {/*}} />*/}
                            </CardContent>
                        </Card>
                        <Card className="bg-white border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-blue-800">Weakest Learning Areas</CardTitle>
                                <p className="text-gray-600">Areas where students need more support</p>
                            </CardHeader>
                            <CardContent>
                                {/* Pie Chart for Weakest Learning Areas */}
                                {/*<chartjs type="pie" data={{*/}
                                {/*    labels: weakestAreas.map(item => item.name),*/}
                                {/*    datasets: [{*/}
                                {/*        data: weakestAreas.map(item => item.value),*/}
                                {/*        backgroundColor: ['#60A5FA', '#F472B6', '#34D399', '#FBBF24'],*/}
                                {/*        borderColor: ['#3B82F6', '#EC4899', '#10B981', '#F59E0B'],*/}
                                {/*        borderWidth: 1*/}
                                {/*    }]*/}
                                {/*}} options={{ plugins: { legend: { position: 'bottom' } } }} />*/}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quiz Results Table - Only for Teachers */}
                    {isTeacher && (
                        <Card className="mb-8 mt-8">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-blue-800">All Students Quiz Results</CardTitle>
                                    <div className="relative w-64">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"/>
                                        <Input
                                            type="text"
                                            placeholder="Search by quiz name..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 border-blue-300 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="text-center text-gray-600">Loading quiz results...</div>
                                ) : error ? (
                                    <div className="text-center text-red-600">{error}</div>
                                ) : filteredQuizResults.length === 0 ? (
                                    <div className="text-center text-gray-600">
                                        {searchQuery
                                            ? "No quiz results match your search."
                                            : "No quiz results found."}
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                            <tr className="bg-gradient-to-r from-blue-100 to-purple-100">
                                                <th className="p-4 font-bold text-blue-800 border-b-2 border-blue-200">Quiz Name</th>
                                                <th className="p-4 font-bold text-blue-800 border-b-2 border-blue-200">Student Name</th>
                                                <th className="p-4 font-bold text-blue-800 border-b-2 border-blue-200">Score</th>
                                                <th className="p-4 font-bold text-blue-800 border-b-2 border-blue-200">Date</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {filteredQuizResults.map((result) => (
                                                <tr
                                                    key={result._id}
                                                    className="hover:bg-blue-50 transition-colors duration-200"
                                                >
                                                    <td className="p-4 border-b border-blue-100">{result.quizName}</td>
                                                    <td className="p-4 border-b border-blue-100">{result.username}</td>
                                                    <td className="p-4 border-b border-blue-100">{result.totalMarks}</td>
                                                    <td className="p-4 border-b border-blue-100">
                                                        {new Date(result.date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Dashboard;