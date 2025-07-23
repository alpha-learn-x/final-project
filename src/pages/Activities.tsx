import { Link } from "react-router-dom";
import { CircuitBoard, Zap, Car, Bot, Play, Home, ShoppingCart, Award, BookOpen, HelpCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import Header from "@/components/Header.tsx";

const Activities = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userName = currentUser.userName || 'User'; // Fallback to 'User' if userName is not available

  useEffect(() => {
    // Add background music for kids
    const audio = new Audio('https://example.com/kids-background-music.mp3');
    audio.loop = true;
    audio.volume = 0.3;

    const playMusic = () => {
      audio.play().catch(console.log);
    };

    document.addEventListener('click', playMusic, { once: true });

    return () => {
      audio.pause();
      document.removeEventListener('click', playMusic);
    };
  }, []);

  const activities = [
    {
      id: 1,
      title: "Simple Electric Circuit",
      description: "Join Sparky the Robot! Help him light up his way home by building magical circuits with drag-and-drop fun!",
      icon: CircuitBoard,
      color: "red",
      difficulty: "Beginner",
      duration: "30 min",
      path: "/activity/circuit",
      emoji: "⚡",
      reward: "Lightning Badge",
      story: "Sparky needs your help to light the street!"
    },
    {
      id: 2,
      title: "Energy & Power",
      description: "Adventure with Robo the Engineer! Build spinning motors and create the fastest fan in the galaxy!",
      icon: Zap,
      color: "yellow",
      difficulty: "Intermediate",
      duration: "45 min",
      path: "/activity/motor",
      emoji: "🔄",
      reward: "Energy Master Badge",
      story: "Help Robo build the ultimate spinning machine!"
    },
    {
      id: 3,
      title: "Traffic Light Automation",
      description: "Meet Captain Traffic! Control magical traffic lights and keep the tiny city safe and organized!",
      icon: Car,
      color: "green",
      difficulty: "Intermediate",
      duration: "40 min",
      path: "/activity/traffic",
      emoji: "🚦",
      reward: "Traffic Controller Badge",
      story: "Captain Traffic needs your help to control the city!"
    },
    {
      id: 4,
      title: "Building a Simple Robot",
      description: "Team up with Bot Builder! Create amazing robots that can navigate mazes and solve puzzles!",
      icon: Bot,
      color: "purple",
      difficulty: "Advanced",
      duration: "60 min",
      path: "/activity/robot",
      emoji: "🤖",
      reward: "Robot Builder Badge",
      story: "Bot Builder wants to create the smartest robot ever!"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      red: "from-red-100 to-red-300 border-red-400",
      yellow: "from-yellow-100 to-yellow-300 border-yellow-400",
      green: "from-green-100 to-green-300 border-green-400",
      purple: "from-purple-100 to-purple-300 border-purple-400"
    };
    return colorMap[color] || "from-gray-100 to-gray-300 border-gray-400";
  };

  const getIconColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      red: "text-red-600",
      yellow: "text-yellow-600",
      green: "text-green-600",
      purple: "text-purple-600"
    };
    return colorMap[color] || "text-gray-600";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-500 text-white";
      case "Intermediate": return "bg-yellow-500 text-white";
      case "Advanced": return "bg-red-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 relative overflow-hidden">
        {/* Floating animations */}
        <div className="absolute top-10 left-10 text-4xl animate-bounce">🌟</div>
        <div className="absolute top-20 right-20 text-3xl animate-ping">⭐</div>
        <div className="absolute bottom-20 left-20 text-4xl animate-pulse">🎈</div>

        {/* Navigation Bar */}
        <Header></Header>
        {/* Navigation Bar */}

        <div className="container mx-auto px-4 py-12">
          {/* Header with Robot Guide */}
          <div className="text-center mb-16">
            <div className="relative">
              <div className="text-6xl mb-4 animate-bounce">🤖</div>
              <h1 className="text-6xl font-bold text-white mb-6 animate-pulse">
                🪄 Learning Adventures with {userName}!
              </h1>
              <div className="absolute -top-8 -left-8 text-5xl animate-spin">⭐</div>
              <div className="absolute -top-8 -right-8 text-5xl animate-spin">⭐</div>
            </div>
            <div className="bg-white/90 rounded-3xl p-6 max-w-4xl mx-auto border-4 border-yellow-400 shadow-2xl">
              <p className="text-2xl text-purple-800 font-bold mb-4">
                Hi {userName}! 👋 I'm your learning buddy! Let's explore amazing activities together!
              </p>
              <p className="text-lg text-blue-700">
                🌟 Choose an adventure below and let's learn through play! Each activity has stories, games, and awesome rewards! 🌟
              </p>
            </div>
          </div>

          {/* Activities Grid with Stories */}
          <div className="grid md:grid-cols-2 gap-10 mb-12">
            {activities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                  <Card key={activity.id} className={`hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:rotate-1 bg-gradient-to-br ${getColorClasses(activity.color)} border-4 relative overflow-hidden group`}>
                    {/* Story bubble */}
                    <div className="absolute top-2 left-2 bg-white/90 rounded-full px-3 py-1 text-sm font-bold text-purple-600 animate-pulse">
                      {activity.story}
                    </div>

                    {/* Floating emoji */}
                    <div className="absolute top-4 right-4 text-4xl animate-bounce group-hover:animate-spin">
                      {activity.emoji}
                    </div>

                    {/* Difficulty and duration badges */}
                    <div className="absolute top-16 left-4 space-y-2">
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(activity.difficulty)}`}>
                        {activity.difficulty}
                      </div>
                      <div className="bg-blue-100 px-3 py-1 rounded-full text-blue-800 text-sm font-bold">
                        ⏱️ {activity.duration}
                      </div>
                    </div>

                    <Link to={activity.path}>
                      <CardHeader className="text-center pt-20 pb-4">
                        <div className="relative mx-auto mb-4">
                          <IconComponent className={`h-20 w-20 ${getIconColor(activity.color)} animate-pulse`} />
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-ping"></div>
                        </div>
                        <CardTitle className="text-3xl text-gray-800 mb-4">{activity.title}</CardTitle>
                        <div className="bg-purple-100 px-4 py-2 rounded-full inline-block">
                          <span className="text-purple-800 font-bold">🏆 Earn: {activity.reward}</span>
                        </div>
                      </CardHeader>
                    </Link>

                    <CardContent className="text-center px-6 pb-8">
                      <p className="text-gray-700 mb-8 text-lg leading-relaxed">{activity.description}</p>
                      <Link to={activity.path}>
                        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-8 py-4 w-full rounded-full text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                          <Play className="mr-3 h-6 w-6" />
                          🚀 Start Adventure!
                        </Button>
                      </Link>
                    </CardContent>

                    {/* Animated background elements */}
                    <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-white/20 rounded-full group-hover:animate-ping"></div>
                    <div className="absolute -top-12 -right-12 w-20 h-20 bg-white/20 rounded-full group-hover:animate-ping"></div>
                  </Card>
              );
            })}
          </div>

          {/* Enhanced Fun Stats Section */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10 mb-12 border-4 border-purple-200">
            <h3 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
              🎊 Amazing Rewards Await You, {userName}! 🎊
            </h3>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="group hover:scale-110 transition-transform">
                <div className="text-5xl mb-3 animate-bounce">🏆</div>
                <div className="text-2xl font-bold text-purple-600">Cool Badges</div>
                <div className="text-gray-600">Collect them all!</div>
              </div>
              <div className="group hover:scale-110 transition-transform">
                <div className="text-5xl mb-3 animate-pulse">🎮</div>
                <div className="text-2xl font-bold text-blue-600">Fun Games</div>
                <div className="text-gray-600">Play & Learn!</div>
              </div>
              <div className="group hover:scale-110 transition-transform">
                <div className="text-5xl mb-3 animate-spin">🌟</div>
                <div className="text-2xl font-bold text-yellow-600">Magic Stars</div>
                <div className="text-gray-600">Level up!</div>
              </div>
              <div className="group hover:scale-110 transition-transform">
                <div className="text-5xl mb-3 animate-bounce">🎁</div>
                <div className="text-2xl font-bold text-green-600">Surprises</div>
                <div className="text-gray-600">Hidden treasures!</div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link to="/">
              <Button className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <Home className="mr-3 h-5 w-5" />
                🏠 Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
  );
};

export default Activities;