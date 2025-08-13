import Header from "@/components/Header.tsx";
import { Award, Check, Play, QrCode, Star, Trophy, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Base URL for API calls
const API_BASE_URL = "http://localhost:5000/api/v1/activities";

// Placeholder activityId (replace with dynamic value in production)
const ACTIVITY_ID = "67890";

type UserAnswers = {
  circuitAnswers: any[];
  finalScore: number;
};

const Circuit = () => {
  // ✅ Pull current user from localStorage (same pattern as before)
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const initialUserId = currentUser.userId || "STUDENT001";
  const initialUserName = currentUser.userName || "User";

  const [userId, setUserId] = useState<string>(initialUserId);
  const [userName, setUserName] = useState<string>(initialUserName);

  useEffect(() => {
    // In case localStorage changes after first render
    try {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.userId) setUserId(parsedUser.userId);
        if (parsedUser.userName) setUserName(parsedUser.userName);
      }
    } catch (error: any) {
      console.error("Error parsing user data from localStorage:", error?.message || error);
    }
  }, []);

  // Sections trimmed to intro → circuit → complete
  const [currentSection, setCurrentSection] = useState<"intro" | "circuit" | "complete">("intro");
  const [circuitCompleted, setCircuitCompleted] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [earnedStars, setEarnedStars] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({
    circuitAnswers: [],
    finalScore: 0,
  });
  const videoRef = useRef<HTMLIFrameElement | null>(null); // kept in case you use later

  // Fetch initial activity progress when component mounts (safe to ignore removed sections)
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${ACTIVITY_ID}/progress/${userId}`);
        const result = await response.json();
        if (result.success && result.data) {
          const progress = result.data;
          // Only map the still-relevant properties
          setCurrentSection(progress.currentSection === "complete" ? "complete" : progress.currentSection === "circuit" ? "circuit" : "intro");
          setCircuitCompleted(progress.sectionProgress?.circuitCompleted || false);
          setEarnedStars(progress.starsEarned || 0);
          setUserAnswers({
            circuitAnswers: progress.circuitAnswers || [],
            finalScore: progress.totalScore || 0,
          });
          console.log("=== INITIAL PROGRESS LOADED ===");
          console.log("Progress:", progress);
          console.log("===============================");
        }
      } catch (error: any) {
        console.error("Error fetching activity progress:", error?.message || error);
      }
    };
    fetchProgress();
  }, [userId]);

  // Console log user progress
  useEffect(() => {
    console.log("=== USER PROGRESS UPDATE ===");
    console.log("Current Section:", currentSection);
    console.log("Circuit Completed:", circuitCompleted);
    console.log("User Answers:", userAnswers);
    console.log("Total Stars Earned:", earnedStars);
    console.log("===============================");
  }, [currentSection, circuitCompleted, userAnswers, earnedStars]);

  const logUserAction = async (action: string, data: any) => {
    console.log(`=== USER ACTION: ${action} ===`);
    console.log("Timestamp:", new Date().toISOString());
    console.log("Data:", data);
    console.log("==========================");

    // Save user action to backend
    try {
      const response = await fetch(`${API_BASE_URL}/${ACTIVITY_ID}/action/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          section: currentSection,
          data,
          deviceInfo: { userAgent: navigator.userAgent },
        }),
      });
      const result = await response.json();
      if (!result.success) {
        console.error("Error saving user action:", result.message);
      }
    } catch (error: any) {
      console.error("Error saving user action:", error?.message || error);
    }
  };

  const showSuccessFeedback = (message: string, stars: number) => {
    setFeedbackMessage(message);
    setEarnedStars((prev) => prev + stars);
    setShowFeedback(true);

    logUserAction("SUCCESS_FEEDBACK", {
      message,
      starsEarned: stars,
      totalStars: earnedStars + stars,
    });

    setTimeout(() => setShowFeedback(false), 3000);
  };

  const handleCircuitComplete = async () => {
    const circuitData = {
      components: ["battery", "switch", "LED"],
      connections: "series",
      working: true,
      completedAt: new Date().toISOString(),
    };

    setCircuitCompleted(true);
    setUserAnswers((prev) => ({
      ...prev,
      circuitAnswers: [...prev.circuitAnswers, circuitData],
      finalScore: prev.finalScore + 25, // keep your scoring
    }));

    console.log("=== CIRCUIT COMPLETION ===");
    console.log("Circuit Data:", circuitData);
    console.log("User successfully built circuit with components:", circuitData.components);
    console.log("========================");

    // Save circuit completion to backend
    try {
      const response = await fetch(`${API_BASE_URL}/${ACTIVITY_ID}/circuit/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          circuitData,
          starsEarned: 3,
        }),
      });
      const result = await response.json();
      if (!result.success) {
        console.error("Error saving circuit completion:", result.message);
      }
    } catch (error: any) {
      console.error("Error saving circuit completion:", error?.message || error);
    }

    showSuccessFeedback("Great job! ⚡ Circuit completed!", 3);

    // Go straight to COMPLETE after a short delay
    setTimeout(() => setCurrentSection("complete"), 2000);
  };

  const show3DCircuit = () => {
    logUserAction("3D_CIRCUIT_VIEW", {
      section: "circuit",
      feature: "AR_experience",
    });
    alert(
      "📱 3D Circuit View: Interactive 3D model of simple electric circuit with battery, switch, and LED would appear here! Scan the barcode with your phone camera to see the full AR experience."
    );
  };

  const playInstructions = (text: string) => {
    logUserAction("AUDIO_INSTRUCTION", {
      instruction: text,
      section: currentSection,
    });

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesis.getVoices();
      utterance.voice = voices.find((v) => v.name.includes("Female")) || voices[0];
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const renderIntroSection = () => (
    <div className="text-center space-y-6">
      <div className="bg-white/90 rounded-3xl p-8 border-4 border-yellow-400 shadow-2xl">
        <h2 className="text-3xl font-bold text-purple-800 mb-4">🎬 Introduction Video with Sparky!</h2>
        <p className="text-lg text-blue-700 mb-6">
          Meet Sparky the Robot! He'll guide you through building your first electric circuit!
        </p>

        <div className="relative w-full max-w-2xl mx-auto mb-6">
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/S0sCbaDtJZM"
            title="Simple Electric Circuit Introduction"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg border-4 border-blue-300"
            ref={videoRef}
          ></iframe>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() =>
              playInstructions(
                `Hi ${userName}! I'm Sparky, and I'm here to help you learn about electric circuits. Are you ready to build something amazing together?`
              )
            }
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Volume2 className="mr-2 h-4 w-4" />
            🤖 Hear from Sparky!
          </button>
          <button
            onClick={() => {
              logUserAction("SECTION_NAVIGATION", { from: "intro", to: "circuit" });
              setCurrentSection("circuit");
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg flex items-center"
          >
            <Play className="mr-2 h-5 w-5" />
            Let's Start Building! ⚡
          </button>
        </div>
      </div>
    </div>
  );

  const renderCircuitSection = () => (
    <div className="space-y-6">
      <div className="bg-white/90 rounded-3xl p-8 border-4 border-blue-400 shadow-2xl">
        <h2 className="text-3xl font-bold text-blue-800 mb-4 text-center">⚡ 2. Build Your Circuit - Interactive Lab!</h2>
        <p className="text-lg text-center text-blue-700 mb-6">🤖 Sparky says: "Drag and drop the components to complete the circuit!"</p>

        <div className="w-full h-96 border-4 border-purple-300 rounded-lg mb-6 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <iframe
            src="https://phet.colorado.edu/sims/html/circuit-construction-kit-dc-virtual-lab/latest/circuit-construction-kit-dc-virtual-lab_en.html"
            width="100%"
            height="100%"
            className="rounded-lg"
            title="Circuit Construction Kit"
            onLoad={() => logUserAction("SIMULATION_LOADED", { type: "PhET_Circuit_Kit" })}
          ></iframe>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-purple-700">🎯 Your Mission:</h3>
            <ul className="space-y-2 text-purple-600">
              <li>• Connect the battery to power your circuit</li>
              <li>• Add a switch to control the flow</li>
              <li>• Connect the LED light</li>
              <li>• Close the switch to light it up!</li>
            </ul>
          </div>
          <div className="flex flex-col space-y-4">
            <button onClick={show3DCircuit} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center">
              <QrCode className="mr-2 h-4 w-4" />
              📱 Scan for 3D View
            </button>
            <button
              onClick={() =>
                playInstructions(`Remember ${userName}, electricity needs a complete path to flow. Connect all the parts to make a circle!`)
              }
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Volume2 className="mr-2 h-4 w-4" />
              🎵 Get a Hint
            </button>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleCircuitComplete}
            disabled={circuitCompleted}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 text-lg rounded-lg flex items-center mx-auto"
          >
            {circuitCompleted ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                ✅ Circuit Complete!
              </>
            ) : (
              <>
                <Star className="mr-2 h-5 w-5" />
                🔥 I Did It!
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderCompleteSection = () => (
    <div className="text-center space-y-6">
      <div className="bg-white/90 rounded-3xl p-8 border-4 border-yellow-400 shadow-2xl">
        <h2 className="text-4xl font-bold text-yellow-800 mb-4">🎉 Congratulations {userName}! 🎉</h2>
        <p className="text-xl text-yellow-700 mb-6">You've mastered Simple Electric Circuits! Sparky is so proud! 🤖✨</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-b from-blue-100 to-blue-200 border-2 border-blue-400 p-6 rounded-lg">
            <div className="text-center">
              <Trophy className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-blue-800">Circuit Master</h3>
              <p className="text-blue-600">Badge Earned!</p>
            </div>
          </div>

          <div className="bg-gradient-to-b from-green-100 to-green-200 border-2 border-green-400 p-6 rounded-lg">
            <div className="text-center">
              <Star className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-green-800">{earnedStars} Stars</h3>
              <p className="text-green-600">Collected!</p>
            </div>
          </div>

          <div className="bg-gradient-to-b from-purple-100 to-purple-200 border-2 border-purple-400 p-6 rounded-lg">
            <div className="text-center">
              <Award className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-purple-800">Interactive Lab</h3>
              <p className="text-purple-600">Completed!</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg">🎯 Next Activity: Motor Building!</button>
          <button className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg">📚 Back to Activities</button>
        </div>
      </div>
    </div>
  );

  // Progress now: Intro 50% → Circuit 100% (Complete shown after)
  const progressValue = currentSection === "intro" ? 50 : currentSection === "circuit" ? 100 : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 relative overflow-hidden">
      {/* Success Feedback Popup */}
      {showFeedback && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl p-6 shadow-2xl border-4 border-yellow-400 animate-bounce">
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-green-800 mb-2">{feedbackMessage}</h3>
            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-500 fill-current animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating animations */}
      <div className="absolute top-10 left-10 text-4xl animate-bounce">🌟</div>
      <div className="absolute top-20 right-20 text-3xl animate-ping">⭐</div>
      <div className="absolute bottom-20 left-20 text-4xl animate-pulse">🎈</div>

      {/* Navigation Bar */}
      <Header></Header>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">⚡ Simple Electric Circuit ⚡</h1>
          <p className="text-xl text-white/90">Join Sparky on an amazing circuit adventure, {userName}!</p>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mt-6">
            <div className="w-full bg-white/30 rounded-full h-6">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-6 rounded-full transition-all duration-500"
                style={{ width: `${progressValue}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-white font-semibold mt-2">
              <span>🎬 Intro</span>
              <span>⚡ Circuit</span>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        {currentSection === "intro" && renderIntroSection()}
        {currentSection === "circuit" && renderCircuitSection()}
        {currentSection === "complete" && renderCompleteSection()}

        {/* Navigation Controls */}
        <div className="flex justify-center space-x-4 mt-8">
          {currentSection !== "intro" && (
            <button
              onClick={() => {
                const previousSection = currentSection === "circuit" ? "intro" : "intro";
                logUserAction("SECTION_NAVIGATION", {
                  from: currentSection,
                  to: previousSection,
                  direction: "previous",
                });
                setCurrentSection(previousSection);
              }}
              className="bg-white/90 text-blue-600 border-2 border-blue-400 px-6 py-3 rounded-lg hover:bg-blue-50"
            >
              ← Previous Section
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/95 backdrop-blur-md border-t-4 border-purple-500 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 TinkerAlpha. Making learning fun and interactive!</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Circuit;
