
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, ArrowLeft, Award, QrCode, Play, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import Header from "@/components/Header.tsx";

const Motor = () => {
  const [currentSection, setCurrentSection] = useState("video");
  const [completedSections, setCompletedSections] = useState([]);
  const [earnedRewards, setEarnedRewards] = useState(0);
  const [motorSpeed, setMotorSpeed] = useState([50]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [attempts, setAttempts] = useState({});

  const sections = [
    { id: "video", title: "Meet Robo!", icon: "🎥" },
    { id: "battery", title: "Connect Battery & Coil", icon: "🔋" },
    { id: "speed", title: "Control Speed", icon: "⚡" },
    { id: "magnets", title: "Add Magnets", icon: "🧲" },
    { id: "fan", title: "Create Fan", icon: "🌪️" },
    { id: "quiz", title: "Knowledge Quest", icon: "❓" },
    { id: "challenge", title: "Speed Challenge", icon: "🏁" }
  ];

  useEffect(() => {
    // Onboarding animation
    if (currentSection === "video") {
      toast("🤖 Hi Sonali! I'm Robo! Let's build the most amazing motor together!", {
        duration: 4000,
      });
    }
  }, []);

  const showFeedback = (isCorrect: boolean, message: string) => {
    if (isCorrect) {
      setShowConfetti(true);
      toast.success(`🎉 Great job, Sonali! ${message}`, { duration: 3000 });
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      toast.info(`💡 Hint: ${message}`, { duration: 3000 });
    }
  };

  const handleSectionComplete = (sectionId: string, reward: number) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
      setEarnedRewards(earnedRewards + reward);
      showFeedback(true, "You're becoming a motor master!");
      
      // Session timer reminder
      if (completedSections.length === 3) {
        setTimeout(() => {
          toast("🧘 Time for a stretch break! Click here to pause.", {
            duration: 5000,
            action: {
              label: "Take Break",
              onClick: () => console.log("Break time!")
            }
          });
        }, 2000);
      }
    }
  };

  const VideoSection = () => (
    <Card className="bg-gradient-to-br from-blue-100 to-purple-100 border-4 border-blue-300">
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center text-2xl">
          🤖 Robo's Motor Adventure
        </CardTitle>
        <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-400">
          <p className="text-purple-700 font-bold">
            "Hi Sonali! I'm Robo the Engineer! Let's build the most amazing spinning motor together! 
            Watch how I make things spin and move!" 🌟
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/CWulQ1ZSE3c"
            title="How Electric Motors Work"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
          <div className="absolute top-2 right-2 text-2xl animate-bounce">🎬</div>
        </div>
        <Button 
          onClick={() => {
            handleSectionComplete("video", 5);
            toast("🎥 Amazing! Now let's start building!");
          }}
          className="w-full bg-green-500 hover:bg-green-600 text-white text-lg py-3"
          disabled={completedSections.includes("video")}
        >
          {completedSections.includes("video") ? "✅ Watched with Robo!" : "🎬 Watch with Robo!"}
        </Button>
      </CardContent>
    </Card>
  );

  const BatterySection = () => (
    <Card className="bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-orange-300">
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center text-2xl">
          🔋 Connect Battery and Coil
        </CardTitle>
        <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-400">
          <p className="text-purple-700 font-bold">
            "Great! Now drag the battery and coil together! The battery gives power, and the coil makes magic happen!" ⚡
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold mb-4 text-lg">🎯 Drag These Parts:</h4>
            <div className="space-y-3">
              <div className="p-4 bg-yellow-200 rounded-lg cursor-move hover:bg-yellow-300 transition-all transform hover:scale-105 border-2 border-yellow-400">
                🔋 Battery (Power Source)
              </div>
              <div className="p-4 bg-orange-200 rounded-lg cursor-move hover:bg-orange-300 transition-all transform hover:scale-105 border-2 border-orange-400">
                🌀 Copper Coil (Magic Wire)
              </div>
              <div className="p-4 bg-red-200 rounded-lg cursor-move hover:bg-red-300 transition-all transform hover:scale-105 border-2 border-red-400">
                🔌 Connecting Wires
              </div>
            </div>
          </div>
          <div className="border-4 border-dashed border-purple-400 rounded-lg p-6 min-h-64 bg-gradient-to-br from-purple-50 to-pink-50 relative">
            <h4 className="font-bold mb-4 text-center text-lg">🎪 Build Your Motor Here!</h4>
            <div className="text-center">
              <div className="text-6xl animate-pulse">🔧</div>
              <div className="text-4xl mt-4 animate-bounce">⚡</div>
              <p className="text-purple-600 font-semibold mt-2">Drag parts here!</p>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Button 
            onClick={() => {
              handleSectionComplete("battery", 10);
              showFeedback(true, "Perfect connection! Robo is proud!");
            }}
            className="bg-purple-500 hover:bg-purple-600 text-white text-lg px-8 py-3"
            disabled={completedSections.includes("battery")}
          >
            {completedSections.includes("battery") ? "✅ Connected!" : "🔌 Connect Parts!"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const SpeedSection = () => (
    <Card className="bg-gradient-to-br from-green-100 to-blue-100 border-4 border-green-300">
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center text-2xl">
          ⚡ Control Motor Speed
        </CardTitle>
        <div className="bg-green-100 p-4 rounded-lg border-2 border-green-400">
          <p className="text-purple-700 font-bold">
            "Wow! Now let's make it spin faster or slower! Move the magic slider and watch what happens!" 🎛️
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border-4 border-blue-200">
            <h4 className="font-bold mb-4 text-lg">🎛️ Speed Control (RPM):</h4>
            <Slider
              value={motorSpeed}
              onValueChange={setMotorSpeed}
              max={100}
              step={1}
              className="w-full mb-4"
            />
            <div className="text-center">
              <div className="text-4xl mb-2" style={{ animation: `spin ${2 - (motorSpeed[0] / 100)}s linear infinite` }}>
                🌪️
              </div>
              <p className="text-2xl font-bold text-blue-600">Speed: {motorSpeed[0]} RPM</p>
              <p className="text-lg text-purple-600">
                {motorSpeed[0] < 30 ? "Slow and steady! 🐢" : 
                 motorSpeed[0] < 70 ? "Perfect speed! 🎯" : "Super fast! 🚀"}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Button 
            onClick={() => {
              handleSectionComplete("speed", 15);
              showFeedback(true, "You're a speed control expert!");
            }}
            className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-3"
            disabled={completedSections.includes("speed")}
          >
            {completedSections.includes("speed") ? "✅ Speed Mastered!" : "🎛️ Master Speed!"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case "video": return <VideoSection />;
      case "battery": return <BatterySection />;
      case "speed": return <SpeedSection />;
      // Add other sections here
      default: return <VideoSection />;
    }
  };

  const progress = (completedSections.length / sections.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-confetti animate-pulse"></div>
        </div>
      )}

      {/* Navigation Bar */}
      <Header></Header>
      {/* Navigation Bar */}

      <div className="container mx-auto px-4 py-8">
        {/* Header with Story */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/activities">
            <Button variant="outline" className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Adventures
            </Button>
          </Link>
          <div className="text-center">
            <div className="text-4xl mb-2 animate-bounce">🤖</div>
            <h1 className="text-4xl font-bold text-blue-800 mb-2">Activity 2: Robo's Motor Adventure</h1>
            <p className="text-lg text-gray-700">Help Robo build the ultimate spinning machine!</p>
            <div className="bg-yellow-100 p-3 rounded-lg mt-2 border-2 border-yellow-400">
              <p className="text-purple-700 font-bold">👋 Hi Sonali! Ready to spin some magic with me?</p>
            </div>
          </div>
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            <QrCode className="mr-2 h-5 w-5" />
            Scan for 3D Magic!
          </Button>
        </div>

        {/* Progress Bar with encouragement */}
        <Card className="mb-8 bg-gradient-to-r from-purple-100 to-pink-100 border-4 border-purple-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-blue-800">Sonali's Progress 🌟</h3>
              <span className="text-lg font-semibold text-green-600">{completedSections.length}/{sections.length} Complete</span>
            </div>
            <Progress value={progress} className="h-4 mb-4" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>🚀 {progress < 50 ? "Keep going, you're doing amazing!" : "Wow! You're almost there!"}</span>
              <span>{earnedRewards} ⭐ earned by Sonali!</span>
            </div>
          </CardContent>
        </Card>

        {/* Section Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {sections.slice(0, 4).map((section) => (
            <Button
              key={section.id}
              onClick={() => setCurrentSection(section.id)}
              className={`p-4 h-auto flex flex-col items-center space-y-2 ${
                currentSection === section.id 
                  ? 'bg-blue-500 text-white border-4 border-yellow-400' 
                  : 'bg-white border-2 border-blue-300 text-blue-600 hover:bg-blue-50'
              }`}
            >
              <span className="text-2xl">{section.icon}</span>
              <span className="font-semibold text-sm">{section.title}</span>
              {completedSections.includes(section.id) && (
                <CheckCircle className="w-5 h-5 text-green-500 animate-bounce" />
              )}
            </Button>
          ))}
        </div>

        {/* Current Section Content */}
        {renderCurrentSection()}

        {/* Rewards Summary */}
        {earnedRewards > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-yellow-100 to-orange-100 border-4 border-yellow-400">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center">
                <Award className="mr-2 h-6 w-6" />
                🎉 Amazing Rewards for Sonali! 🎉
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-700 text-lg">
                    Fantastic work! You've earned <strong>{earnedRewards} magic stars</strong> ⭐
                  </p>
                  <p className="text-orange-600">Robo is so proud of you! Keep collecting stars!</p>
                </div>
                <div className="text-4xl animate-bounce">{earnedRewards >= 50 ? "🏆" : "🤖"}</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Motor;
