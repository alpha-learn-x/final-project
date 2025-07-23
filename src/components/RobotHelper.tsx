
import { useState } from "react";
import { MessageCircle, X, Lightbulb, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RobotHelperProps {
  hints: string[];
  recommendations: string[];
}

const RobotHelper = ({ hints, recommendations }: RobotHelperProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"hints" | "recommendations">("hints");

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Robot Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 shadow-lg transform hover:scale-110 transition-all duration-300"
        >
          <div className="text-2xl">🤖</div>
        </Button>
      )}

      {/* Robot Helper Panel */}
      {isOpen && (
        <Card className="w-80 bg-white shadow-2xl border-2 border-blue-300 animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-2xl">🤖</div>
                <CardTitle className="text-blue-800">Robo Helper</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-blue-600">Hi there! I'm here to help you learn! 🌟</p>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Tab Navigation */}
            <div className="flex bg-gray-50">
              <button
                onClick={() => setActiveTab("hints")}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === "hints"
                    ? "bg-yellow-100 text-yellow-800 border-b-2 border-yellow-400"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Lightbulb className="w-4 h-4 inline mr-2" />
                Hints
              </button>
              <button
                onClick={() => setActiveTab("recommendations")}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === "recommendations"
                    ? "bg-purple-100 text-purple-800 border-b-2 border-purple-400"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <HelpCircle className="w-4 h-4 inline mr-2" />
                Tips
              </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-64 overflow-y-auto">
              {activeTab === "hints" && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-yellow-700 mb-2">💡 Helpful Hints:</h4>
                  {hints.map((hint, index) => (
                    <div key={index} className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                      <p className="text-sm text-yellow-800">{hint}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "recommendations" && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-700 mb-2">🎯 Recommendations:</h4>
                  {recommendations.map((rec, index) => (
                    <div key={index} className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400">
                      <p className="text-sm text-purple-800">{rec}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-3 rounded-b-lg">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <MessageCircle className="w-3 h-3" />
                <span>Keep going! You're doing great! 🌟</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RobotHelper;
