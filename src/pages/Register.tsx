import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Home, UserPlus, Volume2, VolumeX, BookOpen, Target, Award, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Key } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    childName: "",
    parentEmail: "",
    userId: "",
    password: "",
    age: ""
  });

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/v1/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.parentEmail,
          userName: formData.childName,
          password: formData.password,
          id: formData.userId,
          age: parseInt(formData.age)
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed. Please check your details and try again.");
      }

      const data = await response.json();

      // Store user info and token in localStorage (assuming similar response structure to login)
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify({
        id: data.user.id,
        userId: data.user.userId,
        email: data.user.email,
        userName: data.user.userName,
        role: data.user.role,
        userType: 'student', // Assuming registration is for students
        photo: '/uploads/00d4cb2f-56bd-4d1f-955b-70e4a28236e0.png'
      }));

      setSuccessMessage("Registration successful! Redirecting to learning area...");

      // Navigate to activities after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || "An error occurred during registration");
      console.error("Registration error:", err);
      setIsSubmitting(false);
    }
  };

  return (
      <div
          className="min-h-screen"
          style={{
            backgroundImage: 'url("https://img.freepik.com/free-photo/smiling-girl-studying-home_329181-18968.jpg?t=st=1751377172~exp=1751380772~hmac=9fc2ed7cd5a4b176b6f9937a1e01f0bb9da35282ae15d7d7668fe42abeffcc73&w=826")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
      >
        <div className="min-h-screen bg-gradient-to-br from-blue-900/80 via-purple-900/80 to-green-900/80">
          {/* Navigation Bar */}
          <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b-4 border-blue-400">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-blue-600">TinkerAlpha</h1>
                </div>
                <div className="hidden md:flex space-x-6">
                  <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
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
                </div>
                <div className="flex items-center space-x-5">
                  <Button
                      onClick={toggleSound}
                      variant="outline"
                      size="icon"
                      className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                  <Link to="/register">
                    <Button className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2">
                      Register Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-4"> Join TinkerAlpha!</h1>
                <p className="text-xl text-white/90">
                  Start your electronics learning adventure today - it's completely free!
                </p>
              </div>

              {/* Registration Form */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-blue-200">
                <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center justify-center">
                    <UserPlus className="mr-2 h-6 w-6" />
                    Create Your Account
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="text-center text-red-600 font-semibold">
                          {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="text-center text-green-600 font-semibold">
                          {successMessage}
                        </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="childName" className="text-lg font-semibold text-gray-700">
                        Student's Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                            id="childName"
                            name="childName"
                            type="text"
                            placeholder="Enter the student name"
                            className="pl-10 h-12 text-lg border-2 border-gray-300 focus:border-blue-500"
                            onChange={handleInputChange}
                            value={formData.childName}
                            required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parentEmail" className="text-lg font-semibold text-gray-700">
                        Parent's Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                            id="parentEmail"
                            name="parentEmail"
                            type="email"
                            placeholder="parent@example.com"
                            className="pl-10 h-12 text-lg border-2 border-gray-300 focus:border-blue-500"
                            onChange={handleInputChange}
                            value={formData.parentEmail}
                            required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="userId" className="text-lg font-semibold text-gray-700">
                        Student ID
                      </Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                            id="userId"
                            name="userId"
                            type="text"
                            placeholder="sonali889"
                            className="pl-10 h-12 text-lg border-2 border-gray-300 focus:border-blue-500"
                            onChange={handleInputChange}
                            value={formData.userId}
                            required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-lg font-semibold text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a secure password"
                            className="pl-10 h-12 text-lg border-2 border-gray-300 focus:border-blue-500"
                            onChange={handleInputChange}
                            value={formData.password}
                            required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-lg font-semibold text-gray-700">
                        Student's Age
                      </Label>
                      <select
                          id="age"
                          name="age"
                          className="w-full h-12 text-lg border-2 border-gray-300 rounded-md px-3 focus:border-blue-500 focus:outline-none"
                          onChange={handleInputChange}
                          value={formData.age}
                          required
                      >
                        <option value="">Select age</option>
                        <option value="5">5 years old</option>
                        <option value="6">6 years old</option>
                        <option value="7">7 years old</option>
                        <option value="8">8 years old</option>
                        <option value="9">9 years old</option>
                        <option value="10">10 years old</option>
                      </select>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl py-4 h-14 font-bold"
                    >
                      {isSubmitting ? "Signing Up..." : "Sign Up"}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-gray-600">
                      Already have an account?{" "}
                      <Link to="/signin" className="text-blue-600 hover:text-blue-800 font-semibold">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits Section */}
              <Card className="mt-8 bg-gradient-to-r from-purple-100/95 to-purple-100/95 border-2 border-purple-300 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-pink-800 mb-4 text-center">
                    🌟 What You Get for Free
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">✅</span>
                      <span className="text-black-700">Access to all 4 activities</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">✅</span>
                      <span className="text-black-700">Progress tracking dashboard</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">✅</span>
                      <span className="text-black-700">Interactive quizzes & puzzles</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">✅</span>
                      <span className="text-black-700">Completion certificates</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Back to Home */}
              <div className="text-center mt-8">
                <Link to="/">
                  <Button className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <Home className="mr-3 h-5 w-5" />
                    🏠 Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
  );
};

export default Register;