import { Link } from "react-router-dom";
import { BookOpen, Download, MessageSquare, Mail, Home, Target, Award, HelpCircle, Volume2, VolumeX, Send, Paperclip, Video, Scan, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Footer from "@/components/Footer";
import { useState } from "react";
import Header from "@/components/Header.tsx";

const Help = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{id: number, text: string, sender: 'user' | 'ai'}>>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [is3DViewOpen, setIs3DViewOpen] = useState(false);

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:tinkalpha@gmail.com?subject=TinkerAlpha Support Request&body=Hi TinkerAlpha Team,%0A%0AI need help with:%0A%0A[Please describe your issue here]%0A%0AThank you!";
  };

  const handleStartChat = () => {
    // This would navigate to the AI chat interface
    window.open("/chat-ai", "_blank");
  };

  const handleDownloadGuide = () => {
    // Create a simple PDF placeholder since we can't access local files
    const link = document.createElement('a');
    link.href = 'data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL091dGxpbmVzIDIgMCBSCi9QYWdlcyAzIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvT3V0bGluZXMKL0NvdW50IDAKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9Db3VudCAxCi9LaWRzIFs0IDAgUl0KPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAzIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSAKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KPj4KPj4KL0NvbnRlbnRzIDUgMCBSCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9MZW5ndGggMTA5Cj4+CnN0cmVhbQpCVApxCjcwIDUwIFRECi9GMSA4IFRmCihIZWxsbyBXb3JsZCkgVGoKRVQKUQpxCjIwMCA2MDAgVEQKL0YxIDEyIFRmCihUaW5rZXJBbHBoYSBHdWlkZSkgVGoKRVQKUQplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDc0IDAwMDAwIG4gCjAwMDAwMDAxMjAgMDAwMDAgbiAKMDAwMDAwMDE3OSAwMDAwMCBuIAowMDAwMDAwMzI2IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDg0CiUlRU9GCg==';
    link.download = 'TinkerAlpha_Guide.pdf';
    link.click();
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        text: chatMessage,
        sender: 'user' as const
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage("");
      setSuccessMessage("Sent the message successfully");
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          text: "Thank you for your message! Our AI assistant will help you with your electronics learning questions.",
          sender: 'ai' as const
        };
        setChatMessages(prev => [...prev, aiResponse]);
      }, 1000);

      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handle3DView = () => {
    setIs3DViewOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Navigation Bar */}
      <Header></Header>
      {/* Navigation Bar */}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">❓ Help & Support Center</h1>
          <p className="text-xl text-gray-700">We're here to help you succeed in your learning journey!</p>
        </div>

        {/* AI Learning Assistant Section */}
        <Card className="mb-12 bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-800 text-center">🧠 AI Learning Assistant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Chat Interface */}
            <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
              <h3 className="text-lg font-semibold mb-4">💬 Chat with AI Assistant</h3>
              
              {/* Chat Messages */}
              <div className="h-40 overflow-y-auto bg-gray-50 rounded-lg p-3 mb-4">
                {chatMessages.length === 0 ? (
                  <p className="text-purple-500 text-center">Start a conversation with our AI assistant!</p>
                ) : (
                  chatMessages.map((message) => (
                    <div key={message.id} className={`mb-2 p-2 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-blue-100 ml-8 text-right' 
                        : 'bg-purple-100 mr-8'
                    }`}>
                      <span className="font-medium">{message.sender === 'user' ? 'You' : 'AI Assistant'}:</span>
                      <p>{message.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Input */}
              <div className="flex space-x-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your question here..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.png,.jpg,.jpeg,.docx"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </label>
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-2">📎 Selected file: {selectedFile.name}</p>
              )}
              
              {successMessage && (
                <p className="text-green-600 font-semibold mt-2">{successMessage}</p>
              )}
            </div>

            {/* AI Assistant Features */}
            <div className="grid md:grid-cols-3 gap-4">
              <Button 
                onClick={handle3DView}
                className="h-20 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white flex flex-col items-center justify-center"
              >
                <Scan className="h-6 w-6 mb-1" />
                Scan for 3D View
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-20 bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white flex flex-col items-center justify-center">
                    <Video className="h-6 w-6 mb-1" />
                    Video Tutorials
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Watch a Quick Demo - How to Complete This Activity</DialogTitle>
                  </DialogHeader>
                  <div className="aspect-video">
                    <iframe
                      src="https://www.youtube.com/embed/BrCIcqS1yEg"
                      title="TinkerAlpha Tutorial"
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                onClick={handleStartChat}
                className="h-20 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white flex flex-col items-center justify-center"
              >
                <MessageSquare className="h-6 w-6 mb-1" />
                Start AI Chat
              </Button>
            </div>

            {/* 3D View Modal */}
            <Dialog open={is3DViewOpen} onOpenChange={setIs3DViewOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>3D Circuit View</DialogTitle>
                </DialogHeader>
                <div className="h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🔌⚡🔋</div>
                    <p className="text-lg text-gray-700">Interactive 3D Circuit Model</p>
                    <p className="text-sm text-gray-500 mt-2">Resistor → Battery → LED Circuit</p>
                    <div className="mt-4 text-xs text-gray-400">
                      Use mouse to rotate • Scroll to zoom
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Help Options Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Video Tutorials */}
          <Card className="bg-gradient-to-b from-red-100 to-red-200 border-2 border-red-300 hover:shadow-xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="text-5xl mb-4">🎥</div>
              <CardTitle className="text-red-800">Video Tutorials</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-red-600 mb-4">Watch step-by-step video guides</p>
              <a 
                href="https://youtu.be/BrCIcqS1yEg" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Watch Videos
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Download Guide */}
          <Card className="bg-gradient-to-b from-green-100 to-green-200 border-2 border-green-300 hover:shadow-xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="text-5xl mb-4">📄</div>
              <CardTitle className="text-green-800">Download Guide</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-green-600 mb-4">Get PDF guides and resources</p>
              <Button 
                onClick={handleDownloadGuide}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Guide
              </Button>
            </CardContent>
          </Card>

          {/* Live Chat */}
          <Card className="bg-gradient-to-b from-blue-100 to-blue-200 border-2 border-blue-300 hover:shadow-xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="text-5xl mb-4">🤖</div>
              <CardTitle className="text-blue-800">AI Learning Assistant</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-blue-600 mb-4">Chat with our AI helper</p>
              <Button 
                onClick={handleStartChat}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Start Chat
              </Button>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="bg-gradient-to-b from-purple-100 to-purple-200 border-2 border-purple-300 hover:shadow-xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="text-5xl mb-4">📧</div>
              <CardTitle className="text-purple-800">Contact Support</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-purple-600 mb-4">Email us for personalized help</p>
              <Button 
                onClick={handleContactSupport}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300">
          <CardHeader>
            <CardTitle className="text-2xl text-orange-800 text-center">🙋‍♀️ Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg border border-yellow-200">
                <h3 className="font-bold text-orange-700 mb-2">How do I start an activity?</h3>
                <p className="text-gray-700">Navigate to the Activities page and click on any activity card. Follow the step-by-step instructions to complete each section!</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-yellow-200">
                <h3 className="font-bold text-orange-700 mb-2">How do I earn badges and certificates?</h3>
                <p className="text-gray-700">Complete activities, pass quizzes, and solve puzzles to earn stars, badges, and certificates. Your progress is automatically saved!</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-yellow-200">
                <h3 className="font-bold text-orange-700 mb-2">What if I need help during an activity?</h3>
                <p className="text-gray-700">Look for the hint buttons (🎵 Get a Hint) in each activity, or use the voice instructions by clicking the speaker icons!</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-yellow-200">
                <h3 className="font-bold text-orange-700 mb-2">How does the 3D scanning feature work?</h3>
                <p className="text-gray-700">Use your phone camera to scan the QR codes in activities to see interactive 3D models of circuits and components!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-800 text-center">🔗 Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/activities">
                <Button variant="outline" className="w-full border-2 border-blue-400 text-blue-600 hover:bg-blue-50">
                  🎯 Activities
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" className="w-full border-2 border-green-400 text-green-600 hover:bg-green-50">
                  📊 Dashboard
                </Button>
              </Link>
              <Link to="/certificates">
                <Button variant="outline" className="w-full border-2 border-purple-400 text-purple-600 hover:bg-purple-50">
                  🏆 Certificates
                </Button>
              </Link>
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

      <Footer />
    </div>
  );
};

export default Help;
