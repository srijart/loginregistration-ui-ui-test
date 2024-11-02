import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';  
import './QuizQuestionComponent.css';

const QuizQuestionComponent = () => {
  const { id } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizResult, setQuizResult] = useState(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [visibleQuestionIndex, setVisibleQuestionIndex] = useState(null); 

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/v1/quizzes');
        const filteredQuizzes = response.data.filter(quiz => quiz.course.courseId === id);
        setQuizzes(filteredQuizzes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        toast.error('Error fetching quizzes');
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [id]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const quizId = quizzes[currentQuizIndex]?.id;
    const quizStatusKey = `${userId}Q${quizId}`;

    if (quizId && localStorage.getItem(quizStatusKey)) {
      setIsQuizSubmitted(true);
      fetchQuizResult(userId, quizId);
    }
  }, [quizzes, currentQuizIndex]);

  const handleAnswerChange = (quizId, questionId, answerValue) => {
    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      [`${quizId}-${questionId}`]: answerValue,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizzes[currentQuizIndex].questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const quizId = quizzes[currentQuizIndex]?.id;
    const quizStatusKey = `${userId}Q${quizId}`;

    if (localStorage.getItem(quizStatusKey)) {
      toast.info('Quiz already submitted. Fetching your score...');
      fetchQuizResult(userId, quizId);
      return;
    }

    const submittedAnswers = quizzes[currentQuizIndex].questions.map(question => ({
      questionId: question.id,
      selectedAnswer: userAnswers[`${quizId}-${question.id}`] || null,
    }));

    const data = {
      userId: Number(userId),
      quizId: quizId,
      submittedAnswers: submittedAnswers,
    };

    try {
      const response = await axios.post('http://localhost:8082/api/v1/quizzes/submit-quiz', data);
      if (response.status === 200) {
        toast.success('Quiz submitted successfully!');
        localStorage.setItem(quizStatusKey, true);
        setIsQuizSubmitted(true);
        fetchQuizResult(userId, quizId);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Error submitting quiz');
      if (error.response?.status === 500) {
        fetchQuizResult(userId, quizId);
        localStorage.setItem(quizStatusKey, true);
      }
    }
  };

  const fetchQuizResult = async (userId, quizId) => {
    try {
      const response = await axios.get(`http://localhost:8082/api/v1/quizzes/quiz-result/${userId}/${quizId}`);
      setQuizResult(response.data);
      setIsQuizSubmitted(true);
    } catch (error) {
      console.error('Error fetching quiz result:', error);
      toast.error('Error fetching quiz result');
    }
  };

  const toggleQuestionVisibility = (index) => {
    setVisibleQuestionIndex(visibleQuestionIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <ClipLoader color="#333" loading={loading} size={50} />
      </div>
    );
  }

  if (quizzes.length === 0) {
    return <p className='quiz-not-available'>No quizzes available for this course.</p>;
  }

  const currentQuiz = quizzes[currentQuizIndex];
  const currentQuestion = currentQuiz?.questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <p>Loading question...</p>;
  }

  const isAnswerSelected = userAnswers[`${currentQuiz.id}-${currentQuestion.id}`] !== undefined;

  return (
    <div className="quiz-content-container">
      <h3 className='course-learnings-title'>Quiz</h3>
      {/* <ToastContainer /> */}
      {isQuizSubmitted ? (
        <div>
          {quizResult ? (
            <div>
              <h2 className='quiz-content-heading'>Quiz Attempt Summary</h2>
              <p>{`Total Questions: ${quizResult.totalQuestions}, Correct Answers: ${quizResult.correctAnswers}`}</p>
              <p>{`Score: ${Math.round(quizResult.score)}%`}</p>
            </div>
          ) : (
            <ClipLoader color="#333" loading={loading} size={50} />
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className='quiz-form'>
          <div className="quiz-question">
            <div className="quiz-question-title" onClick={() => toggleQuestionVisibility(currentQuestionIndex)} role="button" tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && toggleQuestionVisibility(currentQuestionIndex)}>
              <p className="question-text">{currentQuestion.question}</p>
              <span className="arrow-icon">
                {visibleQuestionIndex === currentQuestionIndex ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
            {visibleQuestionIndex === currentQuestionIndex && (
              <>
              <div className="quiz-answer-options">
                {currentQuestion.answers.map(answer => (
                  <div key={answer.id} className="quiz-answer-option">
                    <label className="quiz-answer-label">
                      <input
                        type="radio"
                        name={`${currentQuiz.id}-${currentQuestion.id}`}
                        value={answer.answer}
                        onChange={() => handleAnswerChange(currentQuiz.id, currentQuestion.id, answer.answer)}
                        checked={userAnswers[`${currentQuiz.id}-${currentQuestion.id}`] === answer.answer}
                      />
                      {answer.answer}
                    </label>
                  </div>
                ))}
              </div><div className="navigation-buttons">
              {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="next-button"
                  disabled={!isAnswerSelected}
                >
                  Next Question
                </button>
              ) : (
                <button
                  type="submit"
                  className="submit-answers-button"
                  disabled={Object.keys(userAnswers).length < currentQuiz.questions.length}
                >
                  Submit Answers
                </button>
              )}
            </div>
            </>
            )}
            
          </div>
        </form>
      )}
    </div>
  );
};

export default QuizQuestionComponent;
