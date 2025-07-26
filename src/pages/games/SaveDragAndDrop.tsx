import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Home, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Header from "@/components/Header.tsx";

// Define types for the question structure
interface Question {
  id: number;
  text: string;
  correctAnswer: string;
  options: string[];
}

// Define types for the quiz structure
interface Quiz {
  quizName: string;
  questions: Question[];
}

const SaveDragAndDropQuiz: React.FC = () => {
  const [quiz, setQuiz] = useState<Quiz>({
    quizName: 'DRAGANDDROP',
    questions: [
      {
        id: 1,
        text: '',
        correctAnswer: '',
        options: ['', '', '', '']
      }
    ]
  });
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle input changes for quiz-level fields
  const handleQuizChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuiz(prev => ({ ...prev, [name]: value }));
  };

  // Handle question field changes
  const handleQuestionChange = (index: number, field: string, value: string) => {
    setQuiz(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = { ...newQuestions[index], [field]: value };
      return { ...prev, questions: newQuestions };
    });
  };

  // Handle option changes
  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setQuiz(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[questionIndex] = {
        ...newQuestions[questionIndex],
        options: newQuestions[questionIndex].options.map((opt, idx) =>
          idx === optionIndex ? value : opt
        )
      };
      return { ...prev, questions: newQuestions };
    });
  };

  // Add a new question
  const addQuestion = () => {
    setQuiz(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: prev.questions.length + 1,
          text: '',
          correctAnswer: '',
          options: ['', '', '', '']
        }
      ]
    }));
  };

  // Remove a question
  const removeQuestion = (index: number) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions
        .filter((_, idx) => idx !== index)
        .map((q, qIdx) => ({ ...q, id: qIdx + 1 }))
    }));
  };

  // Validate quiz data before submission
  const validateQuiz = (): boolean => {
    if (!quiz.quizName.trim()) {
      setError('Quiz name is required');
      return false;
    }
    for (const question of quiz.questions) {
      if (!question.text.trim()) {
        setError('All questions must have text');
        return false;
      }
      if (!question.correctAnswer.trim()) {
        setError('All questions must have a correct answer');
        return false;
      }
      if (question.options.some(opt => !opt.trim())) {
        setError('All options must be filled');
        return false;
      }
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaveStatus(null);

    if (!validateQuiz()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/v1/quizzes/draganddrop/questions', quiz);
      setSaveStatus('Drag and Drop quiz saved successfully!');
      console.log('Quiz saved:', response.data);
    } catch (error: any) {
      setError('Failed to save quiz: ' + (error.response?.data?.message || error.message));
      console.error('Error saving quiz:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 relative overflow-hidden">
      <div className="absolute top-10 left-10 text-4xl animate-bounce">🌟</div>
      <div className="absolute top-20 right-20 text-3xl animate-ping">⭐</div>
      <div className="absolute bottom-20 left-20 text-4xl animate-pulse">🎈</div>

      <Header />

      <div className="container mx-auto px-4 py-12">
        {saveStatus && (
          <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-700">
            {saveStatus}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-700">
            {error}
          </div>
        )}

        <div className="text-center mb-16">
          <div className="relative">
            <div className="text-6xl mb-4 animate-bounce">🖐️</div>
            <h1 className="text-6xl font-bold text-white mb-6 animate-pulse">
              🪄 Create Drag and Drop Quiz
            </h1>
            <div className="absolute -top-8 left-8 text-5xl animate-spin">⭐</div>
            <div className="absolute -top-8 right-8 text-5xl animate-spin">⭐</div>
          </div>
          <div className="bg-white/90 rounded-3xl p-6 max-w-4xl mx-auto border-4 border-yellow-400 shadow-2xl">
            <p className="text-2xl text-purple-800 font-bold mb-4">
              Create a new drag-and-drop quiz with questions
            </p>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border-4 border-yellow-300">
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label className="block text-lg font-bold text-purple-800 mb-2">
                Quiz Name
              </label>
              <input
                type="text"
                name="quizName"
                value={quiz.quizName}
                onChange={handleQuizChange}
                className="w-full p-3 rounded-lg border-2 border-purple-300 focus:outline-none focus:border-purple-500"
                placeholder="Enter quiz name"
              />
            </div>

            {quiz.questions.map((question, qIndex) => (
              <div key={qIndex} className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-xl font-bold text-purple-800 mb-4">
                  Question {qIndex + 1}
                </h3>
                <div className="mb-4">
                  <label className="block text-md font-medium text-gray-700 mb-2">
                    Question Text
                  </label>
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                    className="w-full p-3 rounded-lg border-2 border-purple-300 focus:outline-none focus:border-purple-500"
                    placeholder="Enter question text"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-md font-medium text-gray-700 mb-2">
                    Correct Answer
                  </label>
                  <input
                    type="text"
                    value={question.correctAnswer}
                    onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                    className="w-full p-3 rounded-lg border-2 border-purple-300 focus:outline-none focus:border-purple-500"
                    placeholder="Enter correct answer"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-md font-medium text-gray-700 mb-2">
                    Options
                  </label>
                  {question.options.map((option, oIndex) => (
                    <input
                      key={oIndex}
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      className="w-full p-3 mb-2 rounded-lg border-2 border-purple-300 focus:outline-none focus:border-purple-500"
                      placeholder={`Option ${oIndex + 1}`}
                    />
                  ))}
                </div>
                {quiz.questions.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Remove Question
                  </Button>
                )}
              </div>
            ))}

            <div className="flex justify-between mb-8">
              <Button
                type="button"
                onClick={addQuestion}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-medium"
              >
                Add Question
              </Button>
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
              <Button
                className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Home className="mr-3 h-5 w-5" />
                🏠 Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveDragAndDropQuiz;
