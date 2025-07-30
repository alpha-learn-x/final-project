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
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import UserAllResults from "./UserAllResults";

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
    const [userQuizError, setUserQuizError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Number of results per page
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userName = currentUser.userName || 'User';
    const isTeacher = currentUser.role === 'TEACHER';
    const isStudent = currentUser.role === 'STUDENT' || currentUser.role === 'USER';

    const toggleSound = () => {
        setIsSoundEnabled(!isSoundEnabled);
    };

    // New data based on the Teacher Dashboard image
    const teacherMetrics = {
        totalStudents: 128,
        activeLearners: 45,
        averageProgress: 84,
        needAttention: 7
    };

    const sidebarItems = [
        { name: "Overview", icon: Home, active: true },
        { name: "Reports", icon: FileText, path: "/reports" },
        { name: "Students", icon: FileText, path: "/students" },
        ...(isTeacher ? [
            { name: "Add New Activity", icon: MessageSquare, path: "/add-activity" },
            { name: "Save Visual Quiz", icon: MessageSquare, path: "/save-visual-quiz" },
            { name: "Save Auditory Quiz", icon: MessageSquare, path: "/save-auditory-quiz" },
            { name: "Save Drag & Drop Quiz", icon: MessageSquare, path: "/save-drag-and-drop-quiz" },
            { name: "Save Read & Write Quiz", icon: MessageSquare, path: "/save-read-write-quiz" },
            { name: "Save Kinesthetic Quiz", icon: MessageSquare, path: "/save-kinesthetic-quiz" },
        ] : [])
    ];

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        navigate('/signin');
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        console.log('Auth Token:', token);

        const fetchQuizResults = async () => {
            setLoading(true);
            setError(null);
            if (!token) {
                setError('No authentication token found. Please sign in.');
                console.error('No token for quiz results');
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get('http://localhost:5000/api/v1/quizzes/get-all-quiz-results', {
                    params: isTeacher ? {} : { searchText: userName },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setQuizResults(response.data.data);
            } catch (error: any) {
                console.error('Error fetching quiz results:', error.response?.data || error.message);
                setError(error.response?.data?.message || 'Failed to load quiz results. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        const fetchUserQuizTotals = async () => {
            setUserQuizError(null);
            if (!token) {
                setUserQuizError('No authentication token found. Please sign in.');
                console.error('No token for user quiz totals');
                return;
            }
            try {
                const response = await axios.get('http://localhost:5000/api/v1/quizzes/user-quiz-totals', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('User quiz totals response:', response.data);
            } catch (error: any) {
                console.error('Error fetching user quiz totals:', error.response?.data || error.message);
                setUserQuizError(error.response?.data?.message || 'Failed to load quiz totals. Please try again later.');
            }
        };

        if (isTeacher || userName !== 'User') {
            fetchQuizResults();
        } else {
            setError('No user logged in. Please sign in to view quiz results.');
            setLoading(false);
        }

        if (isStudent) {
            fetchUserQuizTotals();
        }
    }, [userName, isTeacher, isStudent]);

    const filteredQuizResults = quizResults.filter((result) =>
        result.quizName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const { totalPages, currentResults, indexOfFirstItem, indexOfLastItem } = useMemo(() => {
        const totalPages = Math.ceil(filteredQuizResults.length / itemsPerPage);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentResults = filteredQuizResults.slice(indexOfFirstItem, indexOfLastItem);
        return { totalPages, currentResults, indexOfFirstItem, indexOfLastItem };
    }, [filteredQuizResults, currentPage, itemsPerPage]);

    // Handle page change
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Handle Previous/Next buttons
    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex flex-col">
            <div className="flex flex-1">
                {/* Sidebar */}
                <div className="w-80 bg-gradient-to-b from-blue-100 via-blue-300 to-blue-600 p-6 flex flex-col">
                    <div className="text-center mb-8">
                        <div
                            className="w-24 h-24 bg-pink-300 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white">
                            <img src="/Uploads/00d4cb2f-56bd-4d1f-955b-70e4a28236e0.png" alt="Student"
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
                                        : 'text-gray-700 hover:bg-white'
                                }`}
                            >
                                <item.icon className="h-5 w-5"/>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </nav>
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
                                    <h3 className="text-xl font-bold text-pink-800 mb-2">{isTeacher ? "Teacher" : "Student"} Dashboard</h3>
                                    <p className="text-pink-600">Welcome back! Here's what's happening today.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Error Message for Students */}
                    {isStudent && userQuizError && (
                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <div className="text-center text-red-600">{userQuizError}</div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Metrics Cards - Only for Teachers */}
                    {isTeacher && (
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
                    )}

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
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setCurrentPage(1); // Reset to first page on search
                                            }}
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
                                    <>
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
                                                {currentResults.map((result) => (
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
                                        {/* Pagination Controls */}
                                        {totalPages > 1 && (
                                            <div className="mt-6 flex items-center justify-between">
                                                <div className="text-sm text-gray-600">
                                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredQuizResults.length)} of {filteredQuizResults.length} results
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={handlePrevious}
                                                        disabled={currentPage === 1}
                                                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                                                            currentPage === 1
                                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                                        }`}
                                                        aria-label="Previous page"
                                                    >
                                                        Previous
                                                    </button>
                                                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                                        <button
                                                            key={page}
                                                            onClick={() => handlePageChange(page)}
                                                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                                                                currentPage === page
                                                                    ? 'bg-blue-600 text-white'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                                                            }`}
                                                            aria-label={`Go to page ${page}`}
                                                        >
                                                            {page}
                                                        </button>
                                                    ))}
                                                    <button
                                                        onClick={handleNext}
                                                        disabled={currentPage === totalPages}
                                                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                                                            currentPage === totalPages
                                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                                        }`}
                                                        aria-label="Next page"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )}
                    <div>
                        {!isTeacher && (
                            <div className="border">
                                <UserAllResults/>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Dashboard;