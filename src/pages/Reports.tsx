import { Link } from "react-router-dom";
import { ArrowLeft, Download, FileText, TrendingUp, Award, Calendar, User, Home, BookOpen, Target, HelpCircle, Volume2, VolumeX, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts";
import { useState } from "react";

const Reports = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  const progressData = [
    { activity: "Circuit Building", completed: 100, total: 100 },
    { activity: "Motor Design", completed: 75, total: 100 },
    { activity: "Traffic Light", completed: 30, total: 100 },
    { activity: "Robot Building", completed: 0, total: 100 }
  ];

  const performanceData = [
    { week: "Week 1", score: 85, hours: 8 },
    { week: "Week 2", score: 92, hours: 10 },
    { week: "Week 3", score: 78, hours: 6 },
    { week: "Week 4", score: 95, hours: 12 }
  ];

  const generatePDFReport = () => {
    // Create a comprehensive PDF report
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 800, 1000);

      // Header
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(0, 0, 800, 120);
      
      // TinkerAlpha Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('TinkerAlpha Learning Report', 400, 50);
      
      // Student name
      ctx.font = 'bold 24px Arial';
      ctx.fillText('Student: Sonali Fernando', 400, 85);

      // Report content
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(' Learning Progress Summary', 50, 180);

      // Progress details
      ctx.font = '16px Arial';
      ctx.fillText('• Circuit Building: 100% Complete ✅', 70, 220);
      ctx.fillText('• Motor Design: 75% Complete 🔧', 70, 250);
      ctx.fillText('• Traffic Light System: 30% Complete 🚦', 70, 280);
      ctx.fillText('• Robot Building: Not Started 🤖', 70, 310);

      // Performance section
      ctx.font = 'bold 20px Arial';
      ctx.fillText('🎯 Performance Metrics', 50, 380);
      
      ctx.font = '16px Arial';
      ctx.fillText('• Average Score: 89.4%', 70, 420);
      ctx.fillText('• Total Hours Spent: 36 hours', 70, 450);
      ctx.fillText('• Activities Completed: 1 out of 4', 70, 480);
      ctx.fillText('• Certificates Earned: 1', 70, 510);

      // Achievements
      ctx.font = 'bold 20px Arial';
      ctx.fillText('🏆 Recent Achievements', 50, 580);
      
      ctx.font = '16px Arial';
      ctx.fillText('• Completed "Simple Electric Circuit" activity', 70, 620);
      ctx.fillText('• Earned "Electronics Beginner" badge', 70, 650);
      ctx.fillText('• Scored 100% on Circuit Quiz', 70, 680);

      // Recommendations
      ctx.font = 'bold 20px Arial';
      ctx.fillText('💡 Recommendations', 50, 750);
      
      ctx.font = '16px Arial';
      ctx.fillText('• Continue with Motor Design activity', 70, 790);
      ctx.fillText('• Practice circuit diagrams daily', 70, 820);
      ctx.fillText('• Join the weekly electronics challenge', 70, 850);

      // Footer
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Generated on ${new Date().toLocaleDateString()}`, 400, 950);
      ctx.fillText('TinkerAlpha Learning Platform', 400, 970);

      // Download
      const link = document.createElement('a');
      link.download = `Sonali_Fernando_Learning_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b-4 border-blue-400 mb-8">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-blue-600">TinkerAlpha ⚡</h1>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                <Home className="mr-1 h-4 w-4" />
                Home
              </Link>
              <Link to="/subjects" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                <BookOpen className="mr-1 h-4 w-4" />
                Subjects
              </Link>
              <Link to="/activities" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                <Target className="mr-1 h-4 w-4" />
                Activities
              </Link>
              <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                <BookOpen className="mr-1 h-4 w-4" />
                Dashboard
              </Link>
              <Link to="/certificates" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                <Award className="mr-1 h-4 w-4" />
                Certificates
              </Link>
              <Link to="/help" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                <HelpCircle className="mr-1 h-4 w-4" />
                Help
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={toggleSound}
                variant="outline"
                size="icon"
                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
               <Link to="/cart">
                <Button className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-bold ">
                  <ShoppingCart className="mr-1 h-4 w-4" />
                  Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-800 mb-2">📊 Learning Reports</h1>
            <p className="text-gray-600">Sonali Fernando's Progress Report</p>
          </div>
          <div className="flex space-x-4">
            <Button 
              onClick={generatePDFReport}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF Report
            </Button>
            <Link to="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-100 to-blue-200">
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 mx-auto mb-2 text-blue-600" />
              <h3 className="text-2xl font-bold text-blue-800">4</h3>
              <p className="text-blue-600">Total Activities</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-100 to-green-200">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 text-green-600" />
              <h3 className="text-2xl font-bold text-green-800">89.4%</h3>
              <p className="text-green-600">Average Score</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-100 to-purple-200">
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 mx-auto mb-2 text-purple-600" />
              <h3 className="text-2xl font-bold text-purple-800">1</h3>
              <p className="text-purple-600">Certificates</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-100 to-orange-200">
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-2 text-orange-600" />
              <h3 className="text-2xl font-bold text-orange-800">36</h3>
              <p className="text-orange-600">Hours Spent</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Tracking */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-blue-800">📈 Activity Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {progressData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{item.activity}</span>
                    <span className="text-sm text-gray-500">{item.completed}%</span>
                  </div>
                  <Progress value={item.completed} className="h-3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-blue-800">📊 Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                score: { label: "Score", color: "#3b82f6" },
                hours: { label: "Hours", color: "#10b981" },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Detailed Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-blue-800">🔍 Detailed Activity Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-bold text-green-800">✅ Simple Electric Circuit</h4>
                <p className="text-green-600">Completed on March 15, 2024</p>
                <p className="text-sm text-gray-600">Score: 100% | Time spent: 12 hours</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-bold text-yellow-800">🔧 Building a Simple Motor</h4>
                <p className="text-yellow-600">75% Complete | In Progress</p>
                <p className="text-sm text-gray-600">Current score: 85% | Time spent: 8 hours</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-800">🚦 Traffic Light Automation</h4>
                <p className="text-blue-600">30% Complete | In Progress</p>
                <p className="text-sm text-gray-600">Current score: 70% | Time spent: 4 hours</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800">🤖 Building a Simple Robot</h4>
                <p className="text-gray-600">Not Started</p>
                <p className="text-sm text-gray-600">Time spent: 0 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-800">💡 Learning Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-2">Next Steps</h4>
                <ul className="text-blue-600 space-y-1">
                  <li>• Continue with Motor Design activity</li>
                  <li>• Complete the circuit diagram quiz</li>
                  <li>• Practice with virtual components</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-800 mb-2">Strengths</h4>
                <ul className="text-green-600 space-y-1">
                  <li>• Excellent circuit understanding</li>
                  <li>• Strong problem-solving skills</li>
                  <li>• Consistent learning schedule</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
