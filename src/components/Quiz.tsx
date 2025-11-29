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
      
      if (lessons.length === 0) {
        throw new Error('Không thể tải nội dung bài học');
      }
      
      console.log('Generating quiz from lessons...');
      const quiz = await generateQuizFromLessons(lessons);
      
      setQuizData(quiz);
      setSelectedAnswers(new Array(quiz.totalQuestions).fill(-1));
      setQuizStarted(true);
    } catch (err) {
      console.error('Error loading quiz:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải bài tập');
    } finally {
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
    setError('');
  };

  if (!quizStarted) {
    return (
      <div className="quiz-container">
        <div className="quiz-intro">
          <div className="quiz-intro-icon">📚</div>
          <h2>Bài tập trắc nghiệm</h2>
          <p>Lịch sử Đắk Lắk từ 1930-1945</p>
          
          <div className="quiz-info">
            <div className="info-item">
              <span className="info-icon">📝</span>
              <span>10 câu hỏi trắc nghiệm</span>
            </div>
            <div className="info-item">
              <span className="info-icon">⏱️</span>
              <span>Không giới hạn thời gian</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🎯</span>
              <span>Dựa trên 10 bài học</span>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <div className="quiz-actions">
            <button 
              className="quiz-btn quiz-btn-primary"
              onClick={loadQuiz}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Đang tạo bài tập...
                </>
              ) : (
                'Bắt đầu làm bài'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showConfirmPopup) {
    return (
      <div className="quiz-container">
        <div className="confirm-popup-overlay">
          <div className="confirm-popup">
            <div className="confirm-header">
              <h2>Xác nhận nộp bài</h2>
              <p>Vui lòng kiểm tra lại đáp án của bạn trước khi nộp bài:</p>
            </div>
            
            <div className="confirm-answers">
              {quizData?.questions.map((question, index) => (
                <div key={index} className="confirm-answer-simple">
                  <span className="answer-text">
                    Câu {index + 1}. {selectedAnswers[index] !== -1 
                      ? String.fromCharCode(65 + selectedAnswers[index])
                      : '?'
                    }
                  </span>
                </div>
              ))}
            </div>
            
            <div className="confirm-actions">
              <button 
                className="quiz-btn quiz-btn-secondary"
                onClick={handleCancelSubmit}
              >
                ← Quay lại
              </button>
              <button 
                className="quiz-btn quiz-btn-success"
                onClick={handleConfirmSubmit}
              >
                Xác nhận nộp bài
              </button>
            </div>
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
        <div className="results-modern">
          {/* Header */}
          <div className="results-header">
            <h1 className="results-title">Hoàn thành bài tập!</h1>
            <p className="results-subtitle">Kết quả của bạn đã được ghi nhận</p>
          </div>

          {/* Score Card chính */}
          <div className="score-card-main">
            <div className="score-visual">
              <div className="score-ring">
                <svg className="score-progress" viewBox="0 0 120 120">
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                  </defs>
                  <circle cx="60" cy="60" r="50" className="score-bg"/>
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="50" 
                    className="score-fill"
                    style={{
                      strokeDasharray: `${percentage * 3.14} 314`,
                      strokeDashoffset: 0
                    }}
                  />
                </svg>
                <div className="score-content">
                  <span className="score-big">{score}</span>
                  <span className="score-divider">/</span>
                  <span className="score-total">{quizData?.totalQuestions}</span>
                </div>
              </div>
              <div className="percentage-badge">{percentage}%</div>
            </div>
            
            <div className="score-details">
              <h3>Phân tích kết quả</h3>
              <div className="stats-grid">
                <div className="stat-item correct">
                  <div className="stat-number">{score}</div>
                  <div className="stat-label">Câu đúng</div>
                </div>
                <div className="stat-item incorrect">
                  <div className="stat-number">{(quizData?.totalQuestions || 0) - score}</div>
                  <div className="stat-label">Câu sai</div>
                </div>
                <div className="stat-item accuracy">
                  <div className="stat-number">{percentage}%</div>
                  <div className="stat-label">Độ chính xác</div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Badge */}
          {percentage >= 70 && (
            <div className="achievement-modern">
              <div className={`achievement-card ${
                percentage >= 90 ? 'gold' : 
                percentage >= 80 ? 'silver' : 'bronze'
              }`}>
                <div className="achievement-info">
                  <h4>
                    {percentage >= 90 ? 'Xuất sắc!' : 
                     percentage >= 80 ? 'Rất tốt!' : 'Khá tốt!'}
                  </h4>
                  <p>
                    {percentage >= 90 ? 'Bạn đã thành thạo kiến thức' : 
                     percentage >= 80 ? 'Kết quả ấn tượng' : 'Tiếp tục cố gắng nhé!'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Nhận xét theo kết quả */}
          <div className="results-message">
            {percentage >= 90 && (
              <div className="message excellent">
                <p>Chúc mừng bạn! Với {score}/{quizData?.totalQuestions} câu đúng ({percentage}%), bạn đã thể hiện sự hiểu biết xuất sắc về lịch sử Việt Nam. Kiến thức vững chắc của bạn thật đáng ngưỡng mộ!</p>
              </div>
            )}
            {percentage >= 80 && percentage < 90 && (
              <div className="message good">
                <p>Rất tốt! Bạn đã trả lời đúng {score}/{quizData?.totalQuestions} câu hỏi ({percentage}%). Đây là một kết quả ấn tượng cho thấy bạn đã nắm vững phần lớn kiến thức. Hãy tiếp tục phát huy!</p>
              </div>
            )}
            {percentage >= 70 && percentage < 80 && (
              <div className="message good">
                <p>Khá tốt! Với {score}/{quizData?.totalQuestions} câu đúng ({percentage}%), bạn đã cho thấy nền tảng kiến thức khá vững. Hãy ôn lại một số phần để đạt kết quả cao hơn.</p>
              </div>
            )}
            {percentage >= 60 && percentage < 70 && (
              <div className="message average">
                <p>Bạn đã trả lời đúng {score}/{quizData?.totalQuestions} câu ({percentage}%). Đây là khởi đầu tốt! Hãy xem lại những câu sai và ôn tập thêm để cải thiện kết quả.</p>
              </div>
            )}
            {percentage >= 50 && percentage < 60 && (
              <div className="message average">
                <p>Kết quả {score}/{quizData?.totalQuestions} câu đúng ({percentage}%) cho thấy bạn cần ôn tập thêm. Đừng nản lòng! Hãy xem chi tiết đáp án và học thêm để cải thiện.</p>
              </div>
            )}
            {percentage < 50 && (
              <div className="message needs-work">
                <p>Với {score}/{quizData?.totalQuestions} câu đúng ({percentage}%), bạn cần dành thêm thời gian ôn tập. Đây là cơ hội tuyệt vời để học hỏi! Hãy xem lại đáp án và thử lại.</p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="results-actions">
            <button 
              className="action-btn secondary"
              onClick={resetQuiz}
            >
              Làm lại bài tập
            </button>
            <button 
              className="action-btn primary"
              onClick={() => {
                setShowResults(false);
                setShowReview(true);
              }}
            >
              Xem chi tiết đáp án
            </button>
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
    </div>
  );
};

export default Quiz;
