
import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, ArrowLeft, Award, QrCode, Play, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Footer from "@/components/Footer";
import Header from "@/components/Header.tsx";

const Traffic = () => {
  const [currentSection, setCurrentSection] = useState("video");
  const [completedSections, setCompletedSections] = useState([]);
  const [earnedRewards, setEarnedRewards] = useState(0);

  const sections = [
    { id: "video", title: "Introduction Video", icon: "🎥" },
    { id: "activity", title: "Traffic Light Build", icon: "🚦" },
    { id: "quiz", title: "Knowledge Quiz", icon: "❓" },
    { id: "puzzle", title: "Automation Puzzle", icon: "🧩" }
  ];

  const quizQuestions = [
    {
      question: "What controls the timing of traffic lights?",
      options: ["Timer circuit", "Manual switch", "Car sensors", "All of the above"],
      correct: 3
    },
    {
      question: "Which light comes after red in a traffic signal?",
      options: ["Yellow", "Green", "Orange", "Blue"],
      correct: 1
    },
    {
      question: "What is automation?",
      options: ["Manual control", "Automatic control without human intervention", "Remote control", "Voice control"],
      correct: 1
    },
    {
      question: "How do sensors detect cars?",
      options: ["By weight", "By metal detection", "By heat", "All methods can be used"],
      correct: 3
    },
    {
      question: "Why is traffic light automation important?",
      options: ["Saves energy", "Improves traffic flow", "Reduces accidents", "All of the above"],
      correct: 3
    }
  ];

  const trafficComponents = [
    { id: "led-red", name: "Red LED", placed: false, x: 0, y: 0 },
    { id: "led-yellow", name: "Yellow LED", placed: false, x: 0, y: 0 },
    { id: "led-green", name: "Green LED", placed: false, x: 0, y: 0 },
    { id: "timer", name: "Timer Circuit", placed: false, x: 0, y: 0 },
    { id: "battery", name: "Battery", placed: false, x: 0, y: 0 },
    { id: "resistor", name: "Resistor", placed: false, x: 0, y: 0 }
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
          🎥 Traffic Light Automation Introduction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/Ho9MKqjKejg"
            title="How Traffic Lights Work"
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
          🚦 Build Your Traffic Light System
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold mb-4">Available Components:</h4>
            <div className="space-y-2">
              {trafficComponents.map((component) => (
                <div
                  key={component.id}
                  className="p-3 bg-red-100 rounded-lg cursor-move hover:bg-red-200 transition-colors"
                  draggable
                >
                  🚦 {component.name}
                </div>
              ))}
            </div>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-64 bg-gray-50">
            <h4 className="font-bold mb-4 text-center">Build your traffic light here</h4>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 bg-red-300 rounded-full flex items-center justify-center text-2xl">🔴</div>
              <div className="w-20 h-20 bg-yellow-300 rounded-full flex items-center justify-center text-2xl">🟡</div>
              <div className="w-20 h-20 bg-green-300 rounded-full flex items-center justify-center text-2xl">🟢</div>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Button 
            onClick={() => handleSectionComplete("activity", 10)}
            className="bg-purple-500 hover:bg-purple-600 text-white"
            disabled={completedSections.includes("activity")}
          >
            {completedSections.includes("activity") ? "✅ Completed" : "Complete Traffic Light"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const QuizSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center">
          ❓ Automation Knowledge Quiz
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
          🧩 Traffic Sequence Puzzle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <p className="text-gray-700 mb-4">Arrange the traffic light sequence correctly!</p>
          <div className="grid grid-cols-3 gap-4">
            {["🔴", "🟡", "🟢"].map((emoji, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-b from-red-100 to-red-200 rounded-lg border-2 border-red-300 text-6xl cursor-pointer hover:scale-105 transition-transform"
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
            <h1 className="text-4xl font-bold text-blue-800 mb-2">Activity 3: Traffic Light Automation</h1>
            <p className="text-lg text-gray-700">Learn about automation by building a smart traffic light!</p>
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
              <span>Great job learning about automation! 🚦</span>
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
                    Amazing work! You've earned <strong>{earnedRewards} stars</strong> ⭐
                  </p>
                  <p className="text-orange-600">You're becoming an automation expert!</p>
                </div>
                <div className="text-4xl">{earnedRewards >= 50 ? "🏆" : "🚦"}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Activity */}
        {completedSections.length === sections.length && (
          <Card className="mt-8 bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-300">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold text-green-800 mb-4">🎉 Activity Complete!</h3>
              <p className="text-green-700 mb-4">
                Excellent! You've mastered traffic light automation. Ready for the final challenge?
              </p>
              <Link to="/activity/robot">
                <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3">
                  Next: Building a Simple Robot 🤖
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Traffic;
