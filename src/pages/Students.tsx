import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "@/components/Header.tsx";

interface Student {
    id: string;
    userId: string;
    email: string;
    userName: string;
    age: number;
    // Optional fields if you plan to extend backend later
    name?: string;
    grade?: string;
    visual?: number;
    auditory?: number;
    kinesthetic?: number;
    reading?: number;
    overall?: number;
    weakestArea?: string;
    status?: string;
}

const Students = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/v1/users/get-all-students");
                setStudents(response.data.students || []);
                setError(null);
            } catch (err: any) {
                setError("Failed to load students. Please try again later.");
                console.error(err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const filteredStudents = students.filter((student) =>
        student.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch ((status || "").toLowerCase()) {
            case "active":
                return "bg-green-100 text-green-800";
            case "needs attention":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Students</h2>
                        <p className="text-gray-600">Monitor student progress across all learning modalities</p>
                    </div>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full">
                        <Users className="mr-2 h-4 w-4" /> Add Student
                    </Button>
                </div>

                <div className="flex justify-between mb-6">
                    <Input
                        type="text"
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-1/3 pl-10 border-gray-300 focus:border-purple-500"
                    />
                    <div className="flex space-x-4">
                        <select className="border-gray-300 rounded-md p-2">
                            <option>All Grades</option>
                        </select>
                        <select className="border-gray-300 rounded-md p-2">
                            <option>All Status</option>
                        </select>
                        <button className="text-purple-600 hover:text-purple-800">More Filters</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <Card className="bg-purple-100 border-purple-200">
                        <CardContent className="p-6 text-center">
                            <p className="text-purple-800">Total Students</p>
                            <h3 className="text-2xl font-bold text-purple-900">{students.length}</h3>
                        </CardContent>
                    </Card>
                    <Card className="bg-green-100 border-green-200">
                        <CardContent className="p-6 text-center">
                            <p className="text-green-800">Active Today</p>
                            <h3 className="text-2xl font-bold text-green-900">--</h3>
                        </CardContent>
                    </Card>
                    <Card className="bg-yellow-100 border-yellow-200">
                        <CardContent className="p-6 text-center">
                            <p className="text-yellow-800">Need Attention</p>
                            <h3 className="text-2xl font-bold text-yellow-900">--</h3>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-100 border-blue-200">
                        <CardContent className="p-6 text-center">
                            <p className="text-blue-800">Excelling</p>
                            <h3 className="text-2xl font-bold text-blue-900">--</h3>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-white border-gray-200">
                    <CardContent>
                        {loading ? (
                            <div className="text-center text-gray-600">Loading students...</div>
                        ) : error ? (
                            <div className="text-center text-red-600">{error}</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                    <tr className="bg-gray-50">
                                        <th className="p-4 font-bold text-gray-700">Student</th>
                                        <th className="p-4 font-bold text-gray-700">Email</th>
                                        <th className="p-4 font-bold text-gray-700">Age</th>
                                        <th className="p-4 font-bold text-gray-700">Latest Quiz</th>
                                        <th className="p-4 font-bold text-gray-700">Marks</th>
                                        <th className="p-4 font-bold text-gray-700">Date</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredStudents.map((student) => {
                                        const latestQuiz = student.quizResults?.[0];
                                        return (
                                            <tr key={student.id} className="hover:bg-gray-50">
                                                <td className="p-4">
                                                    <div className="font-medium">{student.userName}</div>
                                                    <div className="text-sm text-gray-500">{student.userId}</div>
                                                </td>
                                                <td className="p-4">{student.email}</td>
                                                <td className="p-4">{student.age}</td>
                                                <td className="p-4">{latestQuiz ? latestQuiz.quizName : "—"}</td>
                                                <td className="p-4">{latestQuiz ? `${latestQuiz.totalMarks}` : "—"}</td>
                                                <td className="p-4">{latestQuiz ? new Date(latestQuiz.date).toLocaleDateString() : "—"}</td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>

                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default Students;
