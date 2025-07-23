
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, ArrowLeft, Send, MessageCircle, User, Clock, Star, Paperclip, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import Header from "@/components/Header.tsx";

const Inbox = () => {
  const navigate = useNavigate();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewMessageBox, setShowNewMessageBox] = useState(false);

  const messages = [
    {
      id: 1,
      sender: "Mrs. Sarah Johnson",
      role: "Teacher",
      subject: "Mishel's Circuit Progress",
      preview: "Great work on the electric circuit activity! Mishel showed excellent understanding...",
      time: "2 hours ago",
      unread: true,
      priority: "high",
      fullMessage: "Great work on the electric circuit activity! Mishel showed excellent understanding of basic concepts and completed all sections with enthusiasm. I recommend moving to the motor building activity next.",
      avatar: "👩‍🏫"
    },
    {
      id: 2,
      sender: "Parent Portal",
      role: "System",
      subject: "Weekly Progress Report",
      preview: "Your child has completed 1 activity this week and earned 3 new badges...",
      time: "1 day ago",
      unread: false,
      priority: "normal",
      fullMessage: "Your child has completed 1 activity this week and earned 3 new badges. Total learning time: 2.5 hours. Keep up the great work!",
      avatar: "📊"
    },
    {
      id: 3,
      sender: "Mr. David Chen",
      role: "Principal",
      subject: "TinkerAlpha Program Update",
      preview: "We're excited to announce new features in the TinkerAlpha platform...",
      time: "3 days ago",
      unread: false,
      priority: "normal",
      fullMessage: "We're excited to announce new features in the TinkerAlpha platform including AR barcode scanning and enhanced gamification. These updates will make learning even more engaging for students.",
      avatar: "👨‍💼"
    },
    {
      id: 4,
      sender: "AI Learning Assistant",
      role: "AI Helper",
      subject: "Learning Tips for Circuit Activities",
      preview: "Here are some personalized tips to help Mishel excel in electronics...",
      time: "1 week ago",
      unread: false,
      priority: "normal",
      fullMessage: "Here are some personalized tips to help Mishel excel in electronics: 1) Practice identifying circuit components daily, 2) Use the 3D AR scanner for better visualization, 3) Complete quiz sections to reinforce learning.",
      avatar: "🤖"
    }
  ];

  const quickReplies = [
    "Thank you for the update!",
    "Can we schedule a meeting?",
    "How can I help at home?",
    "What should we focus on next?"
  ];

  const filteredMessages = messages.filter(message =>
    message.sender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendReply = () => {
    if (newMessage.trim()) {
      console.log("Sending reply:", newMessage);
      setNewMessage("");
      // Here you would typically send the message to the backend
    }
  };

  const handleNewMessage = () => {
    setShowNewMessageBox(true);
    setSelectedMessage(null);
  };

  const navigateToAIChat = () => {
    navigate('/ai-chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Navigation Bar */}
      <Header></Header>
      {/* Navigation Bar */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/dashboard">
            <Button variant="outline" className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-800 mb-2">📬 Inbox & Messages</h1>
            <p className="text-lg text-gray-700">Communication between teachers, parents, and students</p>
          </div>
          <Button 
            onClick={handleNewMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search teachers by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center justify-between">
                  <span className="flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Messages
                  </span>
                  <Badge className="bg-red-500">
                    {filteredMessages.filter(m => m.unread).length} new
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 cursor-pointer border-b hover:bg-gray-50 transition-colors ${
                        selectedMessage?.id === message.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      } ${message.unread ? 'bg-blue-25' : ''}`}
                      onClick={() => {
                        setSelectedMessage(message);
                        setShowNewMessageBox(false);
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{message.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium truncate ${message.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                              {message.sender}
                            </p>
                            <div className="flex items-center space-x-1">
                              {message.priority === 'high' && <Star className="w-4 h-4 text-yellow-500" />}
                              {message.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs mb-1">
                            {message.role}
                          </Badge>
                          <p className={`text-sm truncate ${message.unread ? 'font-semibold' : 'text-gray-600'}`}>
                            {message.subject}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{message.preview}</p>
                          <div className="flex items-center mt-1">
                            <Clock className="w-3 h-3 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">{message.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message View */}
          <div className="lg:col-span-2">
            {showNewMessageBox ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-800">New Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">To:</label>
                      <Input placeholder="Select recipient..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Subject:</label>
                      <Input placeholder="Enter subject..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Message:</label>
                      <Textarea
                        placeholder="Type your message here..."
                        className="min-h-32"
                      />
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline">
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attach File
                      </Button>
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => setShowNewMessageBox(false)}>
                          Cancel
                        </Button>
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : selectedMessage ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{selectedMessage.avatar}</div>
                      <div>
                        <CardTitle className="text-xl text-blue-800">{selectedMessage.subject}</CardTitle>
                        <p className="text-gray-600">
                          From: <span className="font-medium">{selectedMessage.sender}</span> ({selectedMessage.role})
                        </p>
                        <p className="text-sm text-gray-500">{selectedMessage.time}</p>
                      </div>
                    </div>
                    {selectedMessage.priority === 'high' && (
                      <Badge className="bg-red-500">High Priority</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Message Content */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-800 leading-relaxed">{selectedMessage.fullMessage}</p>
                    </div>

                    {/* Quick Replies */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Quick Replies:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {quickReplies.map((reply, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="text-left justify-start h-auto p-3 text-sm"
                            onClick={() => setNewMessage(reply)}
                          >
                            {reply}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Reply Section */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-800 mb-3">Reply:</h4>
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Type your message here..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-24"
                        />
                        <div className="flex items-center justify-between">
                          <Button variant="outline" size="sm">
                            <Paperclip className="w-4 h-4 mr-2" />
                            Attach File
                          </Button>
                          <div className="flex space-x-2">
                            <Button variant="outline">Save Draft</Button>
                            <Button 
                              onClick={handleSendReply}
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Send Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-96">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Select a message to view</h3>
                    <p>Choose a message from the list to read and reply</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* AI Chat Assistant */}
        <Card className="mt-8 bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300">
          <CardHeader>
            <CardTitle className="text-purple-800 flex items-center">
              🤖 AI Learning Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🤖</div>
              <div className="flex-1">
                <p className="text-purple-700 mb-3">
                  Get instant help and personalized learning tips for your child!
                </p>
                <Button 
                  onClick={navigateToAIChat}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat with AI Assistant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Inbox;
