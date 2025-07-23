
import { Link } from "react-router-dom";
import { Zap, Award, Star, Download, Home, Trophy, Medal, BookOpen, Target, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Header from "@/components/Header.tsx";

const Certificates = () => {
  const childData = {
    name: "Sonali Fernando",
    age: 12,
    batch: "Batch A",
    enrolledDate: "January 2025",
    photo: "/uploads/00d4cb2f-56bd-4d1f-955b-70e4a28236e0.png"
  };

  const certificates = [
    {
      id: 1,
      title: "Modality Test",
      completedDate: "August 15, 2025",
      activity: "Award for Excellence in Visual Learning",
      score: "85%",
      earned: true
      
    },
    {
      id: 2,
      title: "Modality Test",
      completedDate: "Pending",
      activity: "Written Logic Award – Read/Write Excellence",
      score: "Not scored yet",
      earned: false
    },
    {
      id: 3,
      title: "Modality Test",
      completedDate: "Pending",
      activity: "Kinesthetic Innovator in Electronics",
      score: "Not scored yet",
      earned: false
    },
    {
      id: 4,
      title: "Modality Test",
      completedDate: "Pending",
      activity: "Sound Scholar in Electronics",
      score: "Not scored yet",
      earned: false
    }
  ];

  const badges = [
    { name: "Visual Visionary", icon: "🎗️", earned: true, description: "Completed visual learning activity" },
    { name: "Sound Seeker", icon: "🎗️", earned: true, description: "Completed sound learning activity" },
    { name: "Hands-On Hero", icon: "🎗️", earned: true, description: "Completed hands-on learning activity" },
    { name: "Helping Hand", icon: "🎗️", earned: false, description: "Helped 5 classmates" },
    { name: "Perfect Score", icon: "🎗️", earned: false, description: "Got 100% in any activity" },
    { name: "Curious Mind", icon: "🎗️", earned: true, description: "Asked 20 questions" }
  ];

  const handleDownloadCertificate = (certTitle: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Create gradient neon background similar to uploaded image
      const gradient = ctx.createLinearGradient(0, 0, 1200, 850);
      gradient.addColorStop(0, '#7dd3fc'); // Light blue
      gradient.addColorStop(0.5, '#a7f3d0'); // Light green
      gradient.addColorStop(1, '#fbbf24'); // Yellow
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 850);

      // Draw decorative border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8;
      ctx.strokeRect(40, 40, 1120, 770);
      
      // Inner border
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.strokeRect(60, 60, 1080, 730);

      // White certificate content area
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(150, 150, 900, 550);

      // DIPLOMA header with colorful letters
      ctx.font = 'bold 64px Arial';
      ctx.textAlign = 'center';
      const diplomaText = 'DIPLOMA';
      const colors = ['#22c55e', '#f97316', '#eab308', '#8b5cf6', '#06b6d4', '#ef4444'];
      let x = 600 - (diplomaText.length * 32);
      for (let i = 0; i < diplomaText.length; i++) {
        ctx.fillStyle = colors[i % colors.length];
        ctx.fillText(diplomaText[i], x, 250);
        x += 64;
      }

      // Certificate content
      ctx.fillStyle = '#6b7280';
      ctx.font = '28px Arial';
      ctx.fillText('this certificate is presented to', 600, 320);

      // Child's name
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 48px Arial';
      ctx.fillText(childData.name.toUpperCase(), 600, 380);

      // Achievement text
      ctx.fillStyle = '#6b7280';
      ctx.font = '24px Arial';
      ctx.fillText('for successfully completing', 600, 430);

      // Certificate title
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 32px Arial';
      ctx.fillText(certTitle, 600, 480);

      // School name
      ctx.fillStyle = '#6366f1';
      ctx.font = 'bold 28px Arial';
      ctx.fillText('TinkerAlpha Learning Academy', 600, 530);

      // Date and signature lines
      ctx.fillStyle = '#6b7280';
      ctx.font = '20px Arial';
      ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 350, 620);
      ctx.fillText('Signature', 850, 620);

      // Draw signature lines
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(280, 630);
      ctx.lineTo(420, 630);
      ctx.moveTo(780, 630);
      ctx.lineTo(920, 630);
      ctx.stroke();

      // Add decorative elements like the uploaded image
      // Graduation cap icons
      ctx.font = '48px Arial';
      ctx.fillText('🎓', 200, 300);
      ctx.fillText('🎓', 1000, 300);

      // School building
      ctx.fillText('🏫', 600, 200);

      // Stars and decorative elements
      ctx.font = '32px Arial';
      ctx.fillText('⭐', 120, 200);
      ctx.fillText('⭐', 1080, 200);
      ctx.fillText('⭐', 120, 600);
      ctx.fillText('⭐', 1080, 600);
      ctx.fillText('🌟', 180, 500);
      ctx.fillText('🌟', 1020, 500);

      // Grade badge (like in uploaded image)
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(950, 550, 40, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.stroke();
      
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('A', 950, 560);

      // Download
      const link = document.createElement('a');
      link.download = `${certTitle}_${childData.name}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Navigation Bar */}
      <Header></Header>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">🏆 Certificates & Achievements</h1>
          <p className="text-xl text-gray-700">Celebrate Sonali's amazing learning journey!</p>
        </div>

        {/* Child Details Card */}
        <Card className="mb-8 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-800 flex items-center">
              <Star className="mr-2 h-6 w-6" />
              Student Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-pink-300 rounded-full flex items-center justify-center border-4 border-white">
                <img src={childData.photo} alt={childData.name} className="w-20 h-20 rounded-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-purple-800 mb-2">{childData.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-purple-700">Age:</span>
                    <div className="text-purple-600">{childData.age} years old</div>
                  </div>
                  <div>
                    <span className="font-semibold text-purple-700">Batch:</span>
                    <div className="text-purple-600">{childData.batch}</div>
                  </div>
                  <div>
                    <span className="font-semibold text-purple-700">Enrolled:</span>
                    <div className="text-purple-600">{childData.enrolledDate}</div>
                  </div>
                  <div>
                    <span className="font-semibold text-purple-700">Status:</span>
                    <div className="text-green-600 font-medium">Active Learner</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificates Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
            <Award className="mr-2 h-8 w-8" />
            Certificates Earned
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <Card key={cert.id} className={`${cert.earned ? 'bg-gradient-to-b from-purple-100 to-cyan-100 border-purple-300 shadow-lg' : 'bg-gray-100 border-gray-300'} border-2`}>
                <CardHeader className="text-center">
                  <div className={`text-4xl mb-2 ${cert.earned ? '' : 'grayscale opacity-50'}`}>
                    {cert.earned ? '🏆' : '🔒'}
                  </div>
                  <CardTitle className={`${cert.earned ? 'text-purple-800' : 'text-gray-500'}`}>
                    {cert.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-2">
                    <p className={`font-semibold ${cert.earned ? 'text-purple-700' : 'text-gray-500'}`}>
                      Activity: {cert.activity}
                    </p>
                    <p className={`${cert.earned ? 'text-purple-600' : 'text-gray-500'}`}>
                      Score: {cert.score}
                    </p>
                    <p className={`text-sm ${cert.earned ? 'text-purple-600' : 'text-gray-500'}`}>
                      {cert.earned ? `Completed: ${cert.completedDate}` : 'Not yet earned'}
                    </p>
                  </div>
                  {cert.earned && (
                    <Button 
                      onClick={() => handleDownloadCertificate(cert.title)}
                      className="mt-4 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white shadow-lg"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Beautiful Certificate
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Badges Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
            <Medal className="mr-2 h-8 w-8" />
            Achievement Badges
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {badges.map((badge, index) => (
              <Card key={index} className={`text-center p-4 ${badge.earned ? 'bg-gradient-to-b from-green-100 to-green-200 border-green-300' : 'bg-gray-100 border-gray-300'} border-2`}>
                <div className={`text-3xl mb-2 ${badge.earned ? '' : 'grayscale opacity-50'}`}>
                  {badge.icon}
                </div>
                <h4 className={`font-bold text-sm ${badge.earned ? 'text-green-800' : 'text-gray-500'}`}>
                  {badge.name}
                </h4>
                <p className={`text-xs mt-1 ${badge.earned ? 'text-green-600' : 'text-gray-400'}`}>
                  {badge.description}
                </p>
                {badge.earned && (
                  <div className="text-xs text-green-600 font-semibold mt-2">✓ Earned!</div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Back Navigation */}
        <div className="text-center">
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

export default Certificates;
