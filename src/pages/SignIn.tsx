import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, User, Users, GraduationCap, Eye, EyeOff, Home, BookOpen, Target, Award, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Footer from "@/components/Footer";
import * as React from "react";

const SignIn = () => {
  const [userType, setUserType] = useState<"student" | "teacher">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(""); // Clear error on input change
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate user ID based on selected userType
    if (userType === "student" && !formData.userId.startsWith("STUDENT")) {
      setError("Student ID must start with 'STUDENT'");
      return;
    }
    if (userType === "teacher" && !formData.userId.startsWith("TEACHER")) {
      setError("Teacher ID must start with 'TEACHER'");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: formData.userId,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials or server error");
      }

      const data = await response.json();

      // Store user info and token in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify({
        id: data.user.id,
        userId: data.user.userId,
        email: data.user.email,
        userName: data.user.userName,
        role: data.user.role,
        userType: userType,
        photo: '/uploads/00d4cb2f-56bd-4d1f-955b-70e4a28236e0.png'
      }));

      // Navigate based on role
      navigate(data.user.role === "TEACHER" ? "/dashboard" : "/game-context");
    } catch (err) {
      setError(err.message || "An error occurred during login");
      console.error("Login error:", err);
    }
  };

  const userTypes = [
    {
      type: "student" as const,
      icon: GraduationCap,
      title: "Student",
      description: "Hi Sonali! Access your learning activities and progress",
      color: "from-blue-100 to-blue-200 border-blue-300"
    },
    {
      type: "teacher" as const,
      icon: User,
      title: "Teacher",
      description: "Guide Sonali and track student progress",
      color: "from-purple-100 to-purple-200 border-purple-300"
    }
  ];

  return (
      <div
          className="min-h-screen"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80")',
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
                  <h1 className="text-2xl font-bold text-blue-600">TinkerAlpha ⚡</h1>
                </div>
                <Link to="/">
                  <Button variant="outline" className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </nav>

          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">🔐 Welcome Back, Sonali!</h1>
                <p className="text-xl text-white/90">Choose your role and sign in to continue your amazing learning adventure!</p>
              </div>

              {/* User Type Selection */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {userTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                      <Card
                          key={type.type}
                          className={`cursor-pointer transition-all duration-300 border-2 bg-white/95 backdrop-blur-sm ${
                              userType === type.type
                                  ? `bg-gradient-to-b ${type.color} shadow-lg scale-105 border-blue-400`
                                  : 'hover:shadow-md hover:bg-white'
                          }`}
                          onClick={() => setUserType(type.type)}
                      >
                        <CardHeader className="text-center pb-2">
                          <IconComponent className={`h-12 w-12 mx-auto mb-2 ${
                              userType === type.type ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <CardTitle className={userType === type.type ? 'text-blue-800' : 'text-gray-600'}>
                            {type.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center pt-0">
                          <p className={`text-sm ${userType === type.type ? 'text-blue-600' : 'text-gray-500'}`}>
                            {type.description}
                          </p>
                        </CardContent>
                      </Card>
                  );
                })}
              </div>

              {/* Sign In Form */}
              <Card className="max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-blue-800">
                    Sign In as {userTypes.find(t => t.type === userType)?.title}
                  </CardTitle>
                  <p className="text-gray-600">Enter your credentials to continue</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-6">
                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="userId" className="text-blue-700 font-semibold">
                        User ID
                      </Label>
                      <Input
                          id="userId"
                          name="userId"
                          type="text"
                          value={formData.userId}
                          onChange={handleInputChange}
                          placeholder={`Enter your ${userType} ID`}
                          className="border-2 border-blue-200 focus:border-blue-400"
                          required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-blue-700 font-semibold">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            className="border-2 border-blue-200 focus:border-blue-400 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3"
                    >
                      Let's Sign In!
                    </Button>

                    <div className="text-center space-y-2">
                      <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
                          Register here
                        </Link>
                      </p>
                      <p className="text-xs text-gray-500">
                        Forgot your password? Contact your teacher or administrator.
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          <Footer />
        </div>
      </div>
  );
};

export default SignIn;