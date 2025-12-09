import React, { useState } from 'react';
import { loadLessonContent, generateQuizFromLessons, QuizData } from '../services/quizService';

interface QuizProps {
  onBack?: () => void;
}

const Quiz: React.FC<QuizProps> = ({ onBack }) => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [quizStarted, setQuizStarted] = useState(false);

  const loadQuiz = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Loading lesson content...');
      const lessons = await loadLessonContent();
      console.log('Lessons loaded:', lessons.length);
      
      console.log('Generating quiz...');
      const quiz = await generateQuizFromLessons(lessons);
      console.log('Quiz generated:', quiz);
      
      if (quiz && quiz.questions && quiz.questions.length > 0) {
        setQuizData(quiz);
        setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
        setIsLoading(false);
        setQuizStarted(true);
      } else {
        throw new Error('Không thể tạo câu hỏi từ nội dung bài học');
      }
    } catch (err) {
      console.error('Error loading quiz:', err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải bài tập');
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < (quizData?.totalQuestions || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowConfirmPopup(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmPopup(false);
    setShowResults(true);
  };

  const handleCancelSubmit = () => {
    setShowConfirmPopup(false);
  };

  const calculateScore = () => {
    if (!quizData) return 0;
    
    let correct = 0;
    quizData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    
    return correct;
  };

  const resetQuiz = () => {
    setQuizData(null);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setShowReview(false);
    setQuizStarted(false);
    setIsLoading(false);
    setError('');
  };


  if (!quizStarted) {
    return (
      <div className="quiz-container">
        <div className="quiz-intro-modern">
          <div className="intro-header">
            <h1 className="intro-title">Luyện tập củng cố</h1>
            <p className="intro-subtitle">Luyện tập và kiểm tra kiến thức về quê hương xinh đẹp nhé!</p>
          </div>
          
          <div className="quiz-info-grid">
            <div className="info-badge questions">
              <div className="badge-number">10</div>
              <div className="badge-text">Câu hỏi</div>
            </div>
            <div className="info-badge time">
              <div className="badge-number">∞</div>
              <div className="badge-text">Thời gian</div>
            </div>
            <div className="info-badge content">
              <div className="badge-number">✓</div>
              <div className="badge-text">Miễn phí</div>
            </div>
            <div className="info-badge format">
              <div className="badge-number">📝</div>
              <div className="badge-text">Trắc nghiệm</div>
            </div>
          </div>

          {error && (
            <div className="error-alert">
              <div className="alert-content">
                <strong>Lỗi:</strong> {error}
              </div>
            </div>
          )}

          <div className="start-section">
            <button 
              className={`start-btn-modern ${isLoading ? 'loading' : ''}`}
              onClick={loadQuiz}
              disabled={isLoading}
            >
              <div className="btn-content">
                {isLoading ? (
                  <>
                    <div className="icon-container">
                      <svg className="loading-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <span className="btn-text">Đang tạo bài tập</span>
                  </>
                ) : (
                  <>
                    <div className="icon-container">
                      <svg className="ready-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="btn-text">Sẵn sàng</span>
                  </>
                )}
              </div>
              <div className="btn-glow"></div>
            </button>
            <p className="start-note-modern">
              {isLoading ? 'Vui lòng chờ trong giây lát...' : 'Nhấn để bắt đầu luyện tập'}
            </p>
          </div>
        </div>
      </div>
    );
  }


  if (showReview) {
    console.log('Rendering review page, showReview:', showReview);
    const score = calculateScore();
    
    return (
      <div className="quiz-container">
        <div className="quiz-review">
          <div className="review-header">
            <h2>Xem lại đáp án</h2>
            <p>Điểm của bạn: <span className="review-score">{score}/{quizData?.totalQuestions}</span></p>
          </div>
          
          <div className="review-questions">
            {quizData?.questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={index} className="review-question">
                  <div className="review-question-header">
                    <h3>Câu {index + 1}</h3>
                    <div className={`review-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                      {isCorrect ? '✅ Đúng' : '❌ Sai'}
                    </div>
                  </div>
                  
                  <p className="review-question-text">{question.question}</p>
                  
                  <div className="review-options">
                    {question.options.map((option, optionIndex) => {
                      let className = 'review-option';
                      
                      if (optionIndex === question.correctAnswer) {
                        className += ' correct-answer';
                      } else if (optionIndex === userAnswer && !isCorrect) {
                        className += ' user-wrong-answer';
                      } else if (optionIndex === userAnswer && isCorrect) {
                        className += ' user-correct-answer';
                      }
                      
                      return (
                        <div key={optionIndex} className={className}>
                          {option}
                          {optionIndex === question.correctAnswer && <span className="answer-label">Đáp án đúng</span>}
                          {optionIndex === userAnswer && optionIndex !== question.correctAnswer && <span className="answer-label">Bạn chọn</span>}
                        </div>
                      );
                    })}
                  </div>
                  
                  {question.explanation && (
                    <div className="review-explanation">
                      <h4>💡 Giải thích:</h4>
                      <p>{question.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="review-actions">
            <button 
              className="quiz-btn quiz-btn-secondary"
              onClick={() => {
                setShowReview(false);
                setShowResults(true);
              }}
            >
              ← Quay lại kết quả
            </button>
            <button 
              className="quiz-btn quiz-btn-primary"
              onClick={resetQuiz}
            >
              Làm lại bài tập
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / (quizData?.totalQuestions || 1)) * 100);
    
    return (
      <div className="quiz-container">
        <div className="results-horizontal">
          {/* Main Results Card */}
          <div className="results-card-horizontal">
            {/* Score Section */}
            <div className="score-section-horizontal">
              <div className="score-display-horizontal">
                <span className="score-number-horizontal">{score}</span>
                <span className="score-divider-horizontal">/</span>
                <span className="score-total-horizontal">{quizData?.totalQuestions}</span>
              </div>
              <div className="percentage-horizontal">{percentage}%</div>
            </div>

            {/* Stats Section */}
            <div className="stats-section-horizontal">
              <div className="stat-item-horizontal">
                <span className="stat-label-horizontal">SỐ CÂU ĐÚNG:</span>
                <span className="stat-value-horizontal correct">{score}</span>
              </div>
              <div className="stat-item-horizontal">
                <span className="stat-label-horizontal">SỐ CÂU SAI:</span>
                <span className="stat-value-horizontal incorrect">{(quizData?.totalQuestions || 0) - score}</span>
              </div>
              <div className="stat-item-horizontal">
                <span className="stat-label-horizontal">THỜI GIAN:</span>
                <span className="stat-value-horizontal time">16 giây</span>
              </div>
            </div>

            {/* Message Section */}
            <div className="message-section-horizontal">
              <div className="message-icon-horizontal">💡</div>
              <span>Cần cố gắng thêm! Hãy đọc lại bài học để nắm chắc kiến thức.</span>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons-horizontal">
              <button 
                className="action-btn-horizontal secondary"
                onClick={() => {
                  setShowResults(false);
                  setShowReview(true);
                }}
              >
                <div className="btn-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Xem đáp án</span>
              </button>
              <button 
                className="action-btn-horizontal primary"
                onClick={resetQuiz}
              >
                <div className="btn-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4V10H7M23 20V14H17M20.49 9A9 9 0 0 0 5.64 5.64L1 10M3.51 15A9 9 0 0 0 18.36 18.36L23 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Làm lại bài tập</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quizData || quizData.questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="quiz-error">
          <span>❌ Không thể tải bài tập. Vui lòng thử lại.</span>
          <button className="quiz-btn" onClick={resetQuiz}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const question = quizData.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quizData.totalQuestions - 1;
  const allAnswered = selectedAnswers.every(answer => answer !== -1);

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / quizData.totalQuestions) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">
            Câu {currentQuestion + 1} / {quizData.totalQuestions}
          </span>
        </div>
      </div>

      <div className="quiz-question">
        <h3>Câu {currentQuestion + 1}</h3>
        <p>{question.question}</p>
        
        <div className="quiz-options">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`quiz-option ${selectedAnswers[currentQuestion] === index ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-navigation">
        <button 
          className="quiz-btn quiz-btn-secondary"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          ← Câu trước
        </button>
        
        <div className="quiz-nav-center">
          {selectedAnswers[currentQuestion] === -1 && (
            <span className="answer-hint">Chọn một đáp án</span>
          )}
        </div>
        
        {!isLastQuestion ? (
          <button 
            className="quiz-btn quiz-btn-primary"
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === -1}
          >
            Câu tiếp →
          </button>
        ) : (
          <button 
            className="quiz-btn quiz-btn-success"
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            {allAnswered ? 'Hoàn thành' : `Còn ${selectedAnswers.filter(a => a === -1).length} câu`}
          </button>
        )}
      </div>

      {/* Confirmation Popup Overlay */}
      {showConfirmPopup && (
        <div className="confirm-popup-overlay">
          <div className="confirm-popup-simple">
            <div className="confirm-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Xác nhận nộp bài</h3>
            <p>Bạn có chắc chắn muốn nộp bài không?</p>
            
            <div className="confirm-actions-simple">
              <button 
                className="btn-cancel"
                onClick={handleCancelSubmit}
              >
                Hủy
              </button>
              <button 
                className="btn-confirm"
                onClick={handleConfirmSubmit}
              >
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
