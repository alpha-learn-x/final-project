import { Link } from "react-router-dom";
import { BookOpen, Calculator, Atom, Cpu, Battery, Lightbulb, Home, Volume2, VolumeX, HelpCircle, Award, Target, Users, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header.tsx";

const Subjects = () => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;
    }
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  const subjects = [
    {
      id: 1,
      title: "Engineering",
      description: "Engineer your ideas into reality using logic, creativity, and hands-on learning.",
      icon: "👷‍♀️",
      color: "from-blue-400 to-blue-600",
      borderColor: "border-blue-300",
      activities: 8,
      level: "Beginner",
      emoji: "💡"

    },
    {
      id: 2,
      title: "Science",
      description: "Observe, experiment, and discover the laws that govern everything around us",
      icon: "👩‍🔬",
      color: "from-green-400 to-green-600",
      borderColor: "border-green-300",
      activities: 12,
      level: "Intermediate",
      emoji: "🧪"
    },
    {
      id: 3,
      title: "Technology",
      description: "Learn how software, apps, and gadgets are designed to solve real-world problems",
      icon: "🤖",
      color: "from-purple-400 to-purple-600",
      borderColor: "border-purple-300",
      activities: 10,
      level: "Intermediate",
      emoji: "⚙️"
    },
    {
      id: 4,
      title: "Arts",
      description: "Bring your ideas to life using colors, sounds, and motion",
      icon: "👩🏻‍🎨",
      color: "from-orange-400 to-orange-600",
      borderColor: "border-orange-300",
      activities: 15,
      level: "Advanced",
      emoji: "🎨"
    },
    {
      id: 5,
      title: "Mathematics",
      description: "Explore the patterns, shapes, and equations that shape the universe",
      icon: "👨🏻‍🏫",
      color: "from-red-400 to-red-600",
      borderColor: "border-red-300",
      activities: 20,
      level: "Advanced",
      emoji: "🧮"
    },
    
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-500 text-white";
      case "Intermediate": return "bg-yellow-500 text-white";
      case "Advanced": return "bg-red-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400">
      <audio ref={audioRef} src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" />

      {/* Navigation Bar */}
      <Header></Header>
      {/* Navigation Bar */}

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative">
            <h1 className="text-6xl font-bold text-white mb-6 animate-bounce">
              📖 Choose Your Subject! 📖
            </h1>
            <div className="absolute -top-8 -left-8 text-5xl animate-spin">🌟</div>
            <div className="absolute -top-8 -right-8 text-5xl animate-spin">🌟</div>
          </div>
          <p className="text-2xl text-white/90 max-w-4xl mx-auto font-semibold mb-8">
            🎉 Pick a subject that excites you and start your amazing electronics adventure! Each subject has fun activities, games, and cool experiments! 🎉
          </p>
          {/* Large Start Learning Button */}
          <Link to="/activities">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-2xl px-16 py-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
               START LEARNING NOW! 
            </Button>
          </Link>
        </div>

        {/* Subjects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {subjects.map((subject) => (
            <Card 
              key={subject.id} 
              className={`hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-110 hover:rotate-1 bg-gradient-to-br from-white to-gray-50 border-4 ${subject.borderColor} relative overflow-hidden group`}
            >
              {/* Floating emoji */}
              <div className="absolute top-3 right-3 text-3xl animate-bounce group-hover:animate-spin">
                {subject.emoji}
              </div>
              
              {/* Level badge */}
              <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-bold ${getLevelColor(subject.level)}`}>
                {subject.level}
              </div>

              <CardHeader className="text-center pt-12 pb-4">
                <div className="text-6xl mb-4 animate-pulse">{subject.icon}</div>
                <CardTitle className="text-2xl text-gray-800 mb-2">{subject.title}</CardTitle>
                <div className="flex justify-center items-center space-x-4">
                  <span className="bg-blue-100 px-4 py-2 rounded-full text-blue-800 font-semibold">
                    🎯 {subject.activities} Activities
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="text-center px-6 pb-6">
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">{subject.description}</p>
                <Link to="/activities">
                  <Button className={`w-full bg-gradient-to-r ${subject.color} hover:shadow-xl text-white font-bold py-4 px-6 rounded-full text-lg transform hover:scale-105 transition-all duration-300`}>
                     Start Learning Now!
                  </Button>
                </Link>
              </CardContent>
 
              {/* Animated background elements */}
              <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-purple-200 rounded-full opacity-50 group-hover:animate-ping"></div>
              <div className="absolute -top-10 -right-10 w-16 h-16 bg-blue-200 rounded-full opacity-50 group-hover:animate-ping"></div>
            </Card>
          ))}
        </div>

        {/* Quick Stats Section */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-12 border-4 border-purple-200">
          <h3 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
             Your Learning Journey Awaits! 
          </h3>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="group hover:scale-105 transition-transform">
              <div className="text-4xl mb-2">📚</div>
              <div className="text-3xl font-bold text-blue-600">6</div>
              <div className="text-gray-600 font-semibold">Subjects</div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-3xl font-bold text-green-600">83</div>
              <div className="text-gray-600 font-semibold">Activities</div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-3xl font-bold text-purple-600">25</div>
              <div className="text-gray-600 font-semibold">Certificates</div>
            </div>
            <div className="group hover:scale-105 transition-transform">
              <div className="text-4xl mb-2">🎮</div>
              <div className="text-3xl font-bold text-orange-600">50+</div>
              <div className="text-gray-600 font-semibold">Games</div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mb-12">
          <Link to="/">
            <Button className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <Home className="mr-3 h-5 w-5" />
              🏠 Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-800 via-blue-800 to-indigo-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                <h3 className="text-2xl font-bold">TinkerAlpha</h3>
              </div>
              <p className="text-purple-200">Making electronics learning fun and interactive for kids everywhere!</p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold mb-4 text-yellow-300">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/subjects" className="text-purple-200 hover:text-white transition-colors">📚 Subjects</Link></li>
                <li><Link to="/activities" className="text-purple-200 hover:text-white transition-colors">🎯 Activities</Link></li>
                <li><Link to="/dashboard" className="text-purple-200 hover:text-white transition-colors">📊 Dashboard</Link></li>
                <li><Link to="/certificates" className="text-purple-200 hover:text-white transition-colors">🏆 Certificates</Link></li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold mb-4 text-yellow-300">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/help" className="text-purple-200 hover:text-white transition-colors">❓ Help Center</Link></li>
                <li><Link to="/register" className="text-purple-200 hover:text-white transition-colors">🚀 Register</Link></li>
                <li><Link to="/signin" className="text-purple-200 hover:text-white transition-colors">🔐 Sign In</Link></li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold mb-4 text-yellow-300">Contact</h4>
              <p className="text-purple-200 mb-2">📧 hello@tinkeralpha.com</p>
              <p className="text-purple-200 mb-2">📞 +94718771343</p>
              <p className="text-purple-200">🌍 Sri Lanka</p>
            </div>
          </div>
          <div className="border-t border-purple-600 mt-8 pt-8 text-center">
            <p className="text-purple-200">© 2025 TinkerAlpha. All rights reserved. Built with ❤️ for young innovators!</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Subjects;
