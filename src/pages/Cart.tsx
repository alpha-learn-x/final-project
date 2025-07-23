
import { Link } from "react-router-dom";
import { Zap, ShoppingCart, Star, Gift, Home, Trophy, Award, BookOpen, Target, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Cart = () => {
  const earnedCharacters = [
    {
      id: 1,
      name: "Mickey Mouse",
      activity: "Simple Electric Circuit",
      earnedDate: "March 15, 2024",
      image: "https://static.wikia.nocookie.net/disney/images/9/90/Mickey_Mouse.png",
      rarity: "Common",
      description: "The classic leader who loves to solve circuit puzzles!"
    },
    {
      id: 2,
      name: "Minnie Mouse",
      activity: "Simple Electric Circuit - Quiz",
      earnedDate: "March 16, 2024",
      image: "https://static.wikia.nocookie.net/disney/images/b/b8/Minnie_Mouse.png",
      rarity: "Rare",
      description: "A clever mouse with problem-solving powers!"
    },
    {
      id: 3,
      name: "Donald Duck",
      activity: "Building a Simple Motor",
      earnedDate: "March 20, 2024",
      image: "https://static.wikia.nocookie.net/disney/images/d/da/Donald_Duck.png",
      rarity: "Epic",
      description: "An energetic duck who loves to build things!"
    }
  ];

  const availableCharacters = [
    {
      id: 4,
      name: "Goofy",
      activity: "Traffic Light Automation",
      image: "https://static.wikia.nocookie.net/disney/images/c/c3/Goofy.png",
      rarity: "Common",
      locked: true,
      description: "Complete Traffic Light activity to unlock!"
    },
    {
      id: 5,
      name: "Pluto",
      activity: "Building a Simple Robot",
      image: "https://static.wikia.nocookie.net/disney/images/f/fd/Pluto.png",
      rarity: "Legendary",
      locked: true,
      description: "Complete Robot Building activity to unlock!"
    },
    {
      id: 6,
      name: "Chip and Dale",
      activity: "Complete all puzzles",
      image: "https://static.wikia.nocookie.net/disney/images/1/14/Chip_%27n_Dale.png",
      rarity: "Epic",
      locked: true,
      description: "Solve 20 puzzles to unlock this wise duo!"
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "from-gray-100 to-gray-200 border-gray-300";
      case "Rare": return "from-blue-100 to-blue-200 border-blue-300";
      case "Epic": return "from-purple-100 to-purple-200 border-purple-300";
      case "Legendary": return "from-yellow-100 to-yellow-200 border-yellow-300";
      default: return "from-gray-100 to-gray-200 border-gray-300";
    }
  };

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "text-gray-600";
      case "Rare": return "text-blue-600";
      case "Epic": return "text-purple-600";
      case "Legendary": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b-4 border-blue-400">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/uploads/6ffc8098-6922-435a-99ef-f9c11d2729c4.png" alt="TinkerAlpha" className="h-8 w-auto" />
              <h1 className="text-2xl font-bold text-blue-600">TinkerAlpha</h1>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                <Home className="mr-1 h-4 w-4" />
                Home
              </Link>
              <Link to="/activities" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                <Target className="mr-1 h-4 w-4" />
                Activities
              </Link>
              <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                <BookOpen className="mr-1 h-4 w-4" />
                Dashboard
              </Link>
              <Link to="/help" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                <HelpCircle className="mr-1 h-4 w-4" />
                Help
              </Link>
            </div>
            <Link to="/cart">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2">
                <ShoppingCart className="mr-1 h-4 w-4" />
                Cart ({earnedCharacters.length})
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">🛒 My Character Collection</h1>
          <p className="text-xl text-gray-700">Collect amazing Disney characters by completing activities and challenges!</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-b from-green-100 to-green-200">
            <CardContent className="text-center p-6">
              <Trophy className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-green-800">{earnedCharacters.length}</h3>
              <p className="text-green-600">Characters Earned</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-blue-100 to-blue-200">
            <CardContent className="text-center p-6">
              <Star className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-blue-800">1</h3>
              <p className="text-blue-600">Epic Characters</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-purple-100 to-purple-200">
            <CardContent className="text-center p-6">
              <Gift className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-purple-800">3</h3>
              <p className="text-purple-600">Available to Unlock</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-yellow-100 to-yellow-200">
            <CardContent className="text-center p-6">
              <ShoppingCart className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-yellow-800">50%</h3>
              <p className="text-yellow-600">Collection Complete</p>
            </CardContent>
          </Card>
        </div>

        {/* Earned Characters */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
            <Trophy className="mr-2 h-8 w-8" />
            Your Earned Characters
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {earnedCharacters.map((character) => (
              <Card key={character.id} className={`bg-gradient-to-b ${getRarityColor(character.rarity)} border-2 hover:shadow-xl transition-shadow`}>
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-white flex items-center justify-center">
                    <img src={character.image} alt={character.name} className="w-16 h-16 object-cover" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">{character.name}</CardTitle>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getRarityTextColor(character.rarity)} bg-white`}>
                    {character.rarity}
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-700 mb-3">{character.description}</p>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Earned from:</strong> {character.activity}
                  </div>
                  <div className="text-sm text-gray-500">
                    <strong>Date:</strong> {character.earnedDate}
                  </div>
                  <div className="mt-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ✓ Collected!
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Available Characters */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
            <Gift className="mr-2 h-8 w-8" />
            Characters to Unlock
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {availableCharacters.map((character) => (
              <Card key={character.id} className="bg-gradient-to-b from-gray-100 to-gray-200 border-2 border-gray-300 opacity-75">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-white flex items-center justify-center grayscale">
                    <img src={character.image} alt={character.name} className="w-16 h-16 object-cover" />
                  </div>
                  <CardTitle className="text-xl text-gray-600">{character.name}</CardTitle>
                  <div className="px-3 py-1 rounded-full text-sm font-semibold text-gray-500 bg-white">
                    {character.rarity}
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-3">{character.description}</p>
                  <div className="text-sm text-gray-500 mb-4">
                    <strong>Unlock by:</strong> {character.activity}
                  </div>
                  <Button disabled className="bg-gray-400 text-white">
                    🔒 Locked
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Back Navigation */}
        <div className="text-center">
          <Link to="/dashboard">
            <Button variant="outline" className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-6 py-3">
              <Home className="mr-2 h-5 w-5" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
