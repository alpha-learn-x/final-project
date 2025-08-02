import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Home, Save } from 'lucide-react';
import Header from "@/components/Header.tsx";
import { Button } from "@/components/ui/button";

const Rec_SaveVisualQuiz: React.FC = () => {
  const [quizName, setQuizName] = useState('Rec_VISUAL');
  const [question, setQuestion] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');
  const [answer4, setAnswer4] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [pauseAt, setPauseAt] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    if (!quizName.trim()) {
      setError('Quiz name is required');
      return false;
    }
    if (!question.trim()) {
      setError('Question is required');
      return false;
    }
    if (!answer1.trim() || !answer2.trim() || !answer3.trim() || !answer4.trim()) {
      setError('All answer options must be filled');
      return false;
    }
    if (!correctAnswer.trim()) {
      setError('Correct answer is required');
      return false;
    }
    if (!youtubeUrl.trim()) {
      setError('YouTube URL is required');
      return false;
    }
    const pauseAtNum = parseFloat(pauseAt);
    if (!pauseAt || isNaN(pauseAtNum) || pauseAtNum <= 0) {
      setError('Pause time must be a positive number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaveStatus(null);

    if (!validateForm()) return;

    try {
      const payload = {
        quizName: quizName.trim(),
        question: question.trim(),
        answer1: answer1.trim(),
        answer2: answer2.trim(),
        answer3: answer3.trim(),
        answer4: answer4.trim(),
        correctAnswer: correctAnswer.trim(),
        youtubeUrl: youtubeUrl.trim(),
        pauseAt: parseFloat(pauseAt)
      };

      const res = await axios.post('http://localhost:5000/api/v1/quizzes/rec-visual/create', payload);

      setSaveStatus('Quiz saved successfully!');
      setQuizName('Rec_VISUAL');
      setQuestion('');
      setAnswer1('');
      setAnswer2('');
      setAnswer3('');
      setAnswer4('');
      setCorrectAnswer('');
      setYoutubeUrl('');
      setPauseAt('');
    } catch (err: any) {
      setError('Failed to save quiz: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 p-10 relative overflow-hidden">
        <div className="absolute top-10 left-10 text-4xl animate-bounce">🌟</div>
        <div className="absolute top-20 right-20 text-3xl animate-ping">⭐</div>
        <div className="absolute bottom-20 left-20 text-4xl animate-pulse">🎈</div>

        <Header />

        <div className="container mx-auto px-4 py-12 max-w-3xl">
          {saveStatus && <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-700">{saveStatus}</div>}
          {error && <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-700">{error}</div>}

          <div className="text-center mb-16">
            <div className="relative">
              <div className="text-6xl mb-4 animate-bounce">👁️</div>
              <h1 className="text-6xl font-bold text-white mb-6 animate-pulse">👓 Create Visual Quiz</h1>
              <div className="absolute -top-8 -left-8 text-5xl animate-spin">⭐</div>
              <div className="absolute -top-8 -right-8 text-5xl animate-spin">⭐</div>
            </div>
            <div className="bg-white/90 rounded-3xl p-6 border-4 border-yellow-400 shadow-2xl">
              <p className="text-2xl text-purple-800 font-bold mb-4">Create a new visual quiz question</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border-4 border-yellow-300">
            <div className="mb-8">
              <label className="block text-lg font-bold text-purple-800 mb-2">Quiz Name</label>
              <input
                  type="text"
                  value={quizName}
                  onChange={(e) => setQuizName(e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-purple-300 focus:outline-none focus:border-purple-500"
                  placeholder="Enter quiz name (e.g., Rec_VISUAL)"
              />
            </div>

            <div className="mb-8">
              <label className="block text-lg font-bold text-purple-800 mb-2">Question</label>
              <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-purple-300 focus:outline-none focus:border-purple-500"
                  placeholder="Enter question"
              />
            </div>

            <div className="mb-8">
              <label className="block text-lg font-bold text-purple-800 mb-2">Answer 1</label>
              <input
                  type="text"
                  value={answer1}
                  onChange={(e) => setAnswer1(e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-purple-300 focus:outline-none focus:border-purple-500"
                  placeholder="Answer 1"
              />
            </div>

            <div className="mb-8">
              <label className="block text-lg font-bold text-purple-800 mb-2">Answer 2</label>
              <input
                  type="text"
                  value={answer2}
                  onChange={(e) => setAnswer2(e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-purple-300 focus:outline-none focus:border-purple-500"
                  placeholder="Answer 2"
              />
            </div>

            <div className="mb-8">
              <label className="block text-lg font-bold text-purple-800 mb-2">Answer 3</label>
              <input
                  type="text"
                  value={answer3}
                  onChange={(e) => setAnswer3(e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-purple-300 focus:outline-none focus:border-purple-500"
                  placeholder="Answer 3"
              />
            </div>

            <div className="mb-8">
              <label className="block text-lg font-bold text-purple-800 mb-2">Answer 4</label>
              <input
                  type="text"
                  value={answer4}
                  onChange={(e) => setAnswer4(e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-purple-300 focus:outline-none focus:border-purple-500"
                  placeholder="Answer 4"
              />
            </div>

            <div className="mb-8">
              <label className="block text-lg font-bold text-purple-800 mb-2">Correct Answer</label>
              <input
                  type="text"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-purple-300 focus:outline-none focus:border-purple-500"
                  placeholder="Correct Answer"
              />
            </div>

            <div className="mb-8">
              <label className="block text-lg font-bold text-purple-800 mb-2">YouTube URL</label>
              <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-purple-300 focus:outline-none focus:border-purple-500"
                  placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=abc123xyz89)"
              />
            </div>

            <div className="mb-8">
              <label className="block text-lg font-bold text-purple-800 mb-2">Pause At (seconds)</label>
              <input
                  type="number"
                  value={pauseAt}
                  onChange={(e) => setPauseAt(e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-purple-300 focus:outline-none focus:border-purple-500"
                  placeholder="Enter pause time in seconds"
                  min="0"
                  step="0.1"
              />
            </div>

            <div className="flex justify-between mb-8">
              <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-bold py-6 px-12 rounded-full text-xl shadow-lg transform hover:scale-110 transition-all duration-300"
              >
                <Save className="inline mr-2" />
                Save Quiz
              </Button>
            </div>
          </form>

          <div className="flex justify-center mt-8">
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

export default Rec_SaveVisualQuiz;