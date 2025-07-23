
import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, ArrowLeft, Award, QrCode, Play, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Footer from "@/components/Footer";
import Header from "@/components/Header.tsx";

const Robot = () => {
  const [currentSection, setCurrentSection] = useState("video");
  const [completedSections, setCompletedSections] = useState([]);
  const [earnedRewards, setEarnedRewards] = useState(0);

  const sections = [
    { id: "video", title: "Introduction Video", icon: "🎥" },
    { id: "activity", title: "Robot Building", icon: "🤖" },
    { id: "quiz", title: "Knowledge Quiz", icon: "❓" },
    { id: "puzzle", title: "Robot Puzzle", icon: "🧩" }
  ];

  const quizQuestions = [
    {
      question: "What makes a robot different from other machines?",
      options: ["It can move", "It can think and make decisions", "It uses electricity", "It has wheels"],
      correct: 1
    },
    {
      question: "Which sensor helps a robot detect obstacles?",
      options: ["Light sensor", "Ultrasonic sensor", "Temperature sensor", "All sensors"],
      correct: 1
    },
    {
      question: "What is the brain of a robot called?",
      options: ["Motor", "Sensor", "Microcontroller", "Battery"],
      correct: 2
    },
    {
      question: "How do robots receive instructions?",
      options: ["Through programming", "By talking to them", "Through magic", "They don't need instructions"],
      correct: 0
    },
    {
      question: "What can robots help us with?",
      options: ["Cleaning", "Exploring dangerous places", "Manufacturing", "All of the above"],
      correct: 3
    }
  ];

  const robotComponents = [
    { id: "microcontroller", name: "Microcontroller", placed: false, x: 0, y: 0 },
    { id: "motor", name: "Servo Motor", placed: false, x: 0, y: 0 },
    { id: "sensor", name: "Ultrasonic Sensor", placed: false, x: 0, y: 0 },
    { id: "wheels", name: "Wheels", placed: false, x: 0, y: 0 },
    { id: "battery", name: "Battery Pack", placed: false, x: 0, y: 0 },
    { id: "chassis", name: "Robot Chassis", placed: false, x: 0, y: 0 }
  ];

  const handleSectionComplete = (sectionId: string, reward: number) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
      setEarnedRewards(earnedRewards + reward);
    }
  };

  const VideoSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center">
          🎥 Robot Building Introduction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/gfKsGZhgJ24"
            title="How Robots Work"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>
        <Button 
          onClick={() => handleSectionComplete("video", 5)}
          className="w-full bg-green-500 hover:bg-green-600 text-white"
          disabled={completedSections.includes("video")}
        >
          {completedSections.includes("video") ? "✅ Completed" : "Mark as Watched"}
        </Button>
      </CardContent>
    </Card>
  );

  const ActivitySection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center">
          🤖 Build Your Robot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold mb-4">Available Components:</h4>
            <div className="space-y-2">
              {robotComponents.map((component) => (
                <div
                  key={component.id}
                  className="p-3 bg-purple-100 rounded-lg cursor-move hover:bg-purple-200 transition-colors"
                  draggable
                >
                  🤖 {component.name}
                </div>
              ))}
            </div>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-64 bg-gray-50">
            <h4 className="font-bold mb-4 text-center">Assemble your robot here</h4>
            <div className="text-center">
              <div className="text-8xl opacity-50">🤖</div>
              <p className="text-gray-500 mt-2">Drag components to build your robot</p>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Button 
            onClick={() => handleSectionComplete("activity", 10)}
            className="bg-purple-500 hover:bg-purple-600 text-white"
            disabled={completedSections.includes("activity")}
          >
            {completedSections.includes("activity") ? "✅ Completed" : "Complete Robot Building"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const QuizSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center">
          ❓ Robotics Knowledge Quiz
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {quizQuestions.map((question, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h4 className="font-bold mb-3">{index + 1}. {question.question}</h4>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    className="w-full text-left p-3 rounded-lg bg-gray-100 hover:bg-blue-100 transition-colors"
                  >
                    {String.fromCharCode(65 + optionIndex)}. {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button 
            onClick={() => handleSectionComplete("quiz", 15)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={completedSections.includes("quiz")}
          >
            {completedSections.includes("quiz") ? "✅ Completed" : "Submit Quiz"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const PuzzleSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center">
          🧩 Robot Assembly Puzzle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <p className="text-gray-700 mb-4">Put the robot parts in the correct order!</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {["🧠", "👁️", "🔋", "⚙️", "🛞", "🤖"].map((emoji, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-b from-purple-100 to-purple-200 rounded-lg border-2 border-purple-300 text-4xl cursor-pointer hover:scale-105 transition-transform"
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
        <div className="text-center">
          <Button 
            onClick={() => handleSectionComplete("puzzle", 20)}
            className="bg-pink-500 hover:bg-pink-600 text-white"
            disabled={completedSections.includes("puzzle")}
          >
            {completedSections.includes("puzzle") ? "✅ Completed" : "Complete Puzzle"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case "video": return <VideoSection />;
      case "activity": return <ActivitySection />;
      case "quiz": return <QuizSection />;
      case "puzzle": return <PuzzleSection />;
      default: return <VideoSection />;
    }
  };

  const progress = (completedSections.length / sections.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Navigation Bar */}
      <Header></Header>
      {/* Navigation Bar */}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/activities">
            <Button variant="outline" className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Activities
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-800 mb-2">Activity 4: Building a Simple Robot</h1>
            <p className="text-lg text-gray-700">Create your own robot and learn about artificial intelligence!</p>
          </div>
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            <QrCode className="mr-2 h-5 w-5" />
            Scan for 3D View
          </Button>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-blue-800">Your Progress</h3>
              <span className="text-lg font-semibold text-green-600">{completedSections.length}/{sections.length} Complete</span>
            </div>
            <Progress value={progress} className="h-3 mb-4" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>You're building the future! 🤖</span>
              <span>{earnedRewards} ⭐ earned</span>
            </div>
          </CardContent>
        </Card>

        {/* Section Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {sections.map((section) => (
            <Button
              key={section.id}
              onClick={() => setCurrentSection(section.id)}
              className={`p-4 h-auto flex flex-col items-center space-y-2 ${
                currentSection === section.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white border-2 border-blue-300 text-blue-600 hover:bg-blue-50'
              }`}
            >
              <span className="text-2xl">{section.icon}</span>
              <span className="font-semibold">{section.title}</span>
              {completedSections.includes(section.id) && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </Button>
          ))}
        </div>

        {/* Current Section Content */}
        {renderCurrentSection()}

        {/* Rewards Summary */}
        {earnedRewards > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center">
                <Award className="mr-2 h-6 w-6" />
                Rewards Earned!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-700 text-lg">
                    Outstanding! You've earned <strong>{earnedRewards} stars</strong> ⭐
                  </p>
                  <p className="text-orange-600">You're now a junior robotics engineer!</p>
                </div>
                <div className="text-4xl">{earnedRewards >= 50 ? "🏆" : "🤖"}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Course Completion */}
        {completedSections.length === sections.length && (
          <Card className="mt-8 bg-gradient-to-r from-gold-100 to-yellow-100 border-2 border-gold-300">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold text-yellow-800 mb-4">🎉 Congratulations! Course Complete!</h3>
              <p className="text-yellow-700 mb-4">
                Amazing work! You've completed all 4 activities and become a true TinkerAlpha graduate!
              </p>
              <div className="flex justify-center space-x-4">
                <Link to="/certificates">
                  <Button className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3">
                    🏆 Get Your Certificate
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" className="border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 px-8 py-3">
                    📊 View Your Progress
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Robot;
