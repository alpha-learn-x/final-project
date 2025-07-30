import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Home, Save } from 'lucide-react';
import Header from "@/components/Header.tsx";

interface Question {
  id: number;
  text: string;
  pauseAt: number;
  answer: string;
  options: string[];
}

interface Task {
  id: number;
  youtubeUrl: string;
  questions: Question[];
}

interface QuizPayload {
  quizName: string;
  tasks: Task[];
}

const SaveVisualQuiz: React.FC = () => {
  const [quizName, setQuizName] = useState('VISUAL');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      youtubeUrl: '',
      questions: [
        {
          id: 1,
          text: '',
          pauseAt: 0,
          answer: '',
          options: ['', '', '', '']
        }
      ]
    }
  ]);

  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle quiz name
  const handleQuizNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuizName(e.target.value);
  };

  // Handle YouTube URL for a task
  const handleYoutubeUrlChange = (taskIndex: number, value: string) => {
    setTasks(prev => {
      const updated = [...prev];
      updated[taskIndex].youtubeUrl = value;
      return updated;
    });
  };

  // Handle question change inside a task
  const handleQuestionChange = (taskIndex: number, questionIndex: number, field: string, value: string | number) => {
    setTasks(prev => {
      const updated = [...prev];
      updated[taskIndex].questions[questionIndex] = {
        ...updated[taskIndex].questions[questionIndex],
        [field]: value
      };
      return updated;
    });
  };

  // Handle options change
  const handleOptionChange = (taskIndex: number, questionIndex: number, optionIndex: number, value: string) => {
    setTasks(prev => {
      const updated = [...prev];
      const options = updated[taskIndex].questions[questionIndex].options.map((opt, i) =>
          i === optionIndex ? value : opt
      );
      updated[taskIndex].questions[questionIndex].options = options;
      return updated;
    });
  };

  const addTask = () => {
    setTasks(prev => [
      ...prev,
      {
        id: prev.length + 1,
        youtubeUrl: '',
        questions: [
          {
            id: 1,
            text: '',
            pauseAt: 0,
            answer: '',
            options: ['', '', '', '']
          }
        ]
      }
    ]);
  };

  const addQuestion = (taskIndex: number) => {
    setTasks(prev => {
      const updated = [...prev];
      updated[taskIndex].questions.push({
        id: updated[taskIndex].questions.length + 1,
        text: '',
        pauseAt: 0,
        answer: '',
        options: ['', '', '', '']
      });
      return updated;
    });
  };

  const removeQuestion = (taskIndex: number, questionIndex: number) => {
    setTasks(prev => {
      const updated = [...prev];
      updated[taskIndex].questions.splice(questionIndex, 1);
      updated[taskIndex].questions = updated[taskIndex].questions.map((q, idx) => ({ ...q, id: idx + 1 }));
      return updated;
    });
  };

  const validateQuiz = (): boolean => {
    if (!quizName.trim()) {
      setError('Quiz name is required');
      return false;
    }

    for (const task of tasks) {
      if (!task.youtubeUrl.trim()) {
        setError('Each task must have a YouTube URL');
        return false;
      }

      for (const question of task.questions) {
        if (!question.text.trim() || !question.answer.trim() || question.pauseAt < 0 || question.options.some(opt => !opt.trim())) {
          setError('All questions must be valid and fully filled');
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaveStatus(null);

    if (!validateQuiz()) return;

    const payload: QuizPayload = { quizName, tasks };

    try {
      const res = await axios.post('http://localhost:5000/api/v1/quizzes/visual/questions', payload);
      setSaveStatus('Quiz saved successfully!');
      console.log(res.data);
    } catch (err: any) {
      setError('Failed to save quiz: ' + err.message);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 p-10">
        <Header />

        {saveStatus && <div className="p-4 mb-4 bg-green-200 text-green-800 rounded">{saveStatus}</div>}
        {error && <div className="p-4 mb-4 bg-red-200 text-red-800 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
          <div className="mb-6">
            <label className="block font-bold mb-2 text-purple-800">Quiz Name</label>
            <input
                type="text"
                value={quizName}
                onChange={handleQuizNameChange}
                className="w-full p-3 border rounded-lg"
            />
          </div>

          {tasks.map((task, taskIndex) => (
              <div key={taskIndex} className="mb-10 border-2 border-yellow-300 p-6 rounded-xl bg-yellow-50">
                <h2 className="text-xl font-bold mb-4 text-purple-700">Task {taskIndex + 1}</h2>

                <div className="mb-4">
                  <label className="block mb-2 text-gray-700">YouTube URL</label>
                  <input
                      type="text"
                      value={task.youtubeUrl}
                      onChange={(e) => handleYoutubeUrlChange(taskIndex, e.target.value)}
                      className="w-full p-3 border rounded-lg"
                  />
                </div>

                {task.questions.map((question, qIndex) => (
                    <div key={qIndex} className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2 text-blue-800">Question {qIndex + 1}</h4>
                      <input
                          type="text"
                          placeholder="Question Text"
                          value={question.text}
                          onChange={(e) => handleQuestionChange(taskIndex, qIndex, 'text', e.target.value)}
                          className="w-full mb-2 p-2 border rounded"
                      />
                      <input
                          type="number"
                          placeholder="Pause At"
                          value={question.pauseAt}
                          onChange={(e) => handleQuestionChange(taskIndex, qIndex, 'pauseAt', parseInt(e.target.value))}
                          className="w-full mb-2 p-2 border rounded"
                      />
                      <input
                          type="text"
                          placeholder="Correct Answer"
                          value={question.answer}
                          onChange={(e) => handleQuestionChange(taskIndex, qIndex, 'answer', e.target.value)}
                          className="w-full mb-2 p-2 border rounded"
                      />
                      {question.options.map((option, optIndex) => (
                          <input
                              key={optIndex}
                              type="text"
                              placeholder={`Option ${optIndex + 1}`}
                              value={option}
                              onChange={(e) => handleOptionChange(taskIndex, qIndex, optIndex, e.target.value)}
                              className="w-full mb-2 p-2 border rounded"
                          />
                      ))}
                      {task.questions.length > 1 && (
                          <button
                              type="button"
                              onClick={() => removeQuestion(taskIndex, qIndex)}
                              className="text-red-600 mt-2"
                          >
                            Remove Question
                          </button>
                      )}
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => addQuestion(taskIndex)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  ➕ Add Question
                </button>
              </div>
          ))}

          <div className="flex justify-between items-center mt-10">
            <button
                type="button"
                onClick={addTask}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
            >
              ➕ Add Task
            </button>

            <button
                type="submit"
                className="bg-purple-600 text-white px-10 py-4 rounded-full text-lg hover:bg-purple-700"
            >
              <Save className="inline mr-2" />
              Save Quiz
            </button>
          </div>

          <div className="flex justify-center mt-8">
            <Link to="/">
              <button
                  className="bg-gray-700 text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-800"
              >
                Home
              </button>
            </Link>
          </div>
        </form>
      </div>
  );
};

export default SaveVisualQuiz;
