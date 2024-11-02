import React, { useState } from 'react';  
import { useNavigate, useParams } from 'react-router-dom'; 
import { ToastContainer, toast } from 'react-toastify'; 
import { useTranslation } from 'react-i18next'; 
import ClipLoader from 'react-spinners/ClipLoader'; 
import axios from 'axios'; 
import './QuizCreation.css';  
import { COURSES_URL } from '../Services/courseService';

const QuizCreation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [title] = useState('Java');  
  const { id } = useParams(); 
  const instructorId = localStorage.getItem("userId");  
  
  const [questions, setQuestions] = useState([{ 
    question: '', 
    answers: [
      { answer: '', correct: false }, 
      { answer: '', correct: false }, 
      { answer: '', correct: false }, 
      { answer: '', correct: false }
    ] 
  }]);
  
  const [loading, setLoading] = useState(false);
  const [quizUploaded, setQuizUploaded] = useState(false);  

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index].question = e.target.value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (qIndex, aIndex, e) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers[aIndex].answer = e.target.value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, aIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers.forEach((answer, index) => {
      answer.correct = index === aIndex;  
    });
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { 
      question: '', 
      answers: [
        { answer: '', correct: false }, 
        { answer: '', correct: false }, 
        { answer: '', correct: false }, 
        { answer: '', correct: false }
      ] 
    }]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.info(t('UploadingQuiz'));

    const payload = {
      title,
      instructorId,
      courseId: id,
      questions,
    };

    try {
      const response = await axios.post(`${COURSES_URL}/quizzes`, payload);
      setLoading(false);
      if (response.status === 201) {
        toast.success(t('QuizAddedSuccess'));
        setQuizUploaded(true);  
      } else {
        toast.error(t('QuizAddedFail'));
      }
    } catch (error) {
      setLoading(false);
      console.error('Error adding quiz:', error);
      toast.error(t('QuizAddError'));
    }
  };

  return (
    <div className="quiz-form-container">
      {/* <ToastContainer /> */}
      {loading && (
        <div className="loading-overlay">
          <ClipLoader color="#333333" loading={loading} size={50} />
        </div>
      )}
      
      {!quizUploaded ? (
        <>
          <h2>{t('AddNewQuiz')}</h2>
          <form onSubmit={handleSubmit}>
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="question-container">
                <div className='quiz-question-creation'>
                    <label>{t('EnterYourQuestion')}</label>
                <input
                  type="text"
                  placeholder={t('Question')}
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIndex, e)}
                  required
                />
                </div>

                <label>{t('Provide4AnswerOptions')}</label>
                {q.answers.map((a, aIndex) => (
                  <div key={aIndex} className="answer-container">
                    <input
                      type="text"
                      placeholder={t('Answer')}
                      value={a.answer}
                      onChange={(e) => handleAnswerChange(qIndex, aIndex, e)}
                      required
                    />
                    <label>
                      <input
                        type="radio"
                        name={`correctAnswer${qIndex}`}
                        checked={a.correct}
                        onChange={() => handleCorrectAnswerChange(qIndex, aIndex)}
                        className='quiz-radio-creation'
                      />
                      {t('Correct')}
                    </label>
                  </div>
                ))}
                <button type="button" onClick={() => handleRemoveQuestion(qIndex)} className='remove-question-btn'>
                  {t('RemoveQuestion')}
                </button>
              </div>
            ))}

            <button type="button" onClick={handleAddQuestion} className='add-question-btn'>
              {t('AddAnotherQuestion')}
            </button>
            
            <button type="submit" className='quiz-submit'>{t('AddQuiz')}</button>
          </form>
        </>
      ) : (
        <div className="success-message">
          <h2>{t('Quiz Uploaded Successfully!')}</h2>
          <p>{t('Do you want to go to the home page?')}</p>
          <button onClick={() => navigate('/')} className="go-home-btn">{t('GoHome')}</button>
        </div>
      )}
    </div>
  );
};

export default QuizCreation;
