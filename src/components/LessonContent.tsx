import React, { useState, useEffect } from 'react';
import { generateLessonSummary, generateKeyPoints } from '../services/lessonSummaryService';
import { generateQuizForLesson, QuizQuestion } from '../services/quizService';

interface LessonContentProps {
  lessonData: any;
}

// Simple markdown parser for summary text
const parseMarkdown = (text: string): React.ReactElement[] => {
  const lines = text.split('\n');
  const elements: React.ReactElement[] = [];
  
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    
    // Handle headers (## or ###)
    if (line.startsWith('###')) {
      elements.push(
        <h4 key={index} style={{ fontSize: '1.2rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          {line.replace(/^###\s*/, '')}
        </h4>
      );
    } else if (line.startsWith('##')) {
      elements.push(
        <h3 key={index} style={{ fontSize: '1.4rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          {line.replace(/^##\s*/, '')}
        </h3>
      );
    }
    // Handle bullet points
    else if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
      const content = line.replace(/^\s*[*-]\s*/, '');
      // Process bold text within the line
      const processedContent = processBoldText(content);
      elements.push(
        <li key={index} style={{ marginBottom: '0.5rem', lineHeight: '1.6' }}>
          {processedContent}
        </li>
      );
    }
    // Regular paragraph
    else {
      const processedContent = processBoldText(line);
      elements.push(
        <p key={index} style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
          {processedContent}
        </p>
      );
    }
  });
  
  return elements;
};

// Process bold text (**text** or __text__)
const processBoldText = (text: string): (string | React.ReactElement)[] => {
  const parts: (string | React.ReactElement)[] = [];
  let currentIndex = 0;
  
  // Match **text** or __text__
  const boldRegex = /(\*\*|__)(.*?)\1/g;
  let match;
  
  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before bold
    if (match.index > currentIndex) {
      parts.push(text.substring(currentIndex, match.index));
    }
    // Add bold text
    parts.push(
      <strong key={match.index} style={{ fontWeight: '700', color: 'rgba(255, 255, 255, 0.95)' }}>
        {match[2]}
      </strong>
    );
    currentIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.substring(currentIndex));
  }
  
  return parts.length > 0 ? parts : [text];
};

const LessonContent: React.FC<LessonContentProps> = ({ lessonData }) => {
  const [summary, setSummary] = useState<string>('');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string>('');
  const [showSummary, setShowSummary] = useState(false);
  
  // Quiz states
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [quizError, setQuizError] = useState<string>('');
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [quizDuration, setQuizDuration] = useState<number>(0);

  // Reset summary and quiz when lesson changes
  useEffect(() => {
    setSummary('');
    setKeyPoints([]);
    setShowSummary(false);
    setSummaryError('');
    setQuizQuestions([]);
    setShowQuiz(false);
    setUserAnswers({});
    setShowResults(false);
    setQuizError('');
  }, [lessonData]);

  if (!lessonData) {
    return (
      <div className="lesson-content-empty">
        <h2>Chọn một bài học để bắt đầu</h2>
        <p>Vui lòng chọn một bài học từ danh sách bên trái</p>
      </div>
    );
  }

  const handleGenerateSummary = async () => {
    if (isLoadingSummary) return;
    
    setIsLoadingSummary(true);
    setSummaryError('');
    setShowSummary(true);

    try {
      const summaryText = await generateLessonSummary(lessonData);
      const points = await generateKeyPoints(lessonData);
      
      setSummary(summaryText);
      setKeyPoints(points);
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummaryError('Không thể tạo tóm tắt. Vui lòng thử lại sau.');
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleStartQuiz = async () => {
    if (isLoadingQuiz) return;
    
    setIsLoadingQuiz(true);
    setQuizError('');
    setShowQuiz(true);
    setUserAnswers({});
    setShowResults(false);
    setQuizStartTime(Date.now());

    try {
      const quizData = await generateQuizForLesson(lessonData);
      setQuizQuestions(quizData.questions);
    } catch (error) {
      console.error('Error generating quiz:', error);
      setQuizError('Không thể tạo bài tập. Vui lòng thử lại sau.');
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    if (showResults) return; // Don't allow changes after submission
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmitQuiz = () => {
    setShowSubmitConfirm(true);
  };

  const confirmSubmitQuiz = () => {
    const duration = Math.floor((Date.now() - quizStartTime) / 1000);
    setQuizDuration(duration);
    setShowSubmitConfirm(false);
    setShowResults(true);
  };

  const getComment = () => {
    const score = calculateScore();
    const total = quizQuestions.length;
    const percentage = (score / total) * 100;

    if (percentage === 100) {
      return "Xuất sắc! Bạn đã nắm vững kiến thức bài học.";
    } else if (percentage >= 80) {
      return "Rất tốt! Bạn đã hiểu phần lớn nội dung bài học.";
    } else if (percentage >= 60) {
      return "Khá tốt! Hãy xem lại một số kiến thức để hoàn thiện hơn.";
    } else if (percentage >= 40) {
      return "Cần cố gắng thêm! Hãy đọc lại bài học để nắm chắc kiến thức.";
    } else {
      return "Hãy dành thời gian đọc kỹ bài học và thử lại nhé!";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins} phút ${secs} giây` : `${secs} giây`;
  };

  const handleBackToLesson = () => {
    setShowQuiz(false);
    setQuizQuestions([]);
    setUserAnswers({});
    setShowResults(false);
    setQuizError('');
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const renderContent = (content: any): React.ReactElement[] => {
    const elements: React.ReactElement[] = [];

    if (typeof content === 'string') {
      return [<p key="content" className="lesson-paragraph">{content}</p>];
    }

    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <p key={index} className="lesson-paragraph">{item}</p>
      ));
    }

    if (typeof content === 'object' && content !== null) {
      Object.keys(content).forEach((key, index) => {
        const value = content[key];

        if (key === 'tieu_de') {
          elements.push(
            <h3 key={`title-${index}`} className="lesson-subtitle">
              {value}
            </h3>
          );
        } else if (key === 'noi_dung') {
          elements.push(...renderContent(value));
        } else if (key === 'mo_dau') {
          elements.push(
            <p key={`intro-${index}`} className="lesson-intro">
              {value}
            </p>
          );
        } else if (key.startsWith('phan_') || key.startsWith('muc_')) {
          elements.push(
            <div key={`section-${index}`} className="lesson-section">
              {renderContent(value)}
            </div>
          );
        } else if (key === 'cac_muc' || key === 'cac_phan') {
          elements.push(...renderContent(value));
        }
      });
    }

    return elements;
  };

  return (
    <div className="lesson-content">
      <div className="lesson-header">
        <h1 className="lesson-title">{lessonData.tieu_de}</h1>
        
        {/* Summary Button - Changes based on state */}
        <button 
          className={`summary-btn-compact ${isLoadingSummary ? 'summary-btn-loading' : ''}`}
          onClick={() => {
            if (showSummary && summary) {
              setShowSummary(false);
            } else {
              handleGenerateSummary();
            }
          }}
          disabled={isLoadingSummary}
        >
          {isLoadingSummary ? (
            <>
              <div className="summary-icon-animated">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path className="line-1" d="M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path className="line-2" d="M9 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span>Đang tóm tắt bài học...</span>
            </>
          ) : showSummary && summary ? (
            'Xem nội dung đầy đủ'
          ) : (
            'Tóm tắt'
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className={`lesson-content-wrapper ${isLoadingSummary ? 'content-fading' : ''}`}>

        {/* Show Quiz if active */}
        {showQuiz ? (
          <div className="lesson-body">
            <div className="quiz-section">
              <div className="quiz-header">
                <h2>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Bài tập trắc nghiệm
                </h2>
                <button className="quiz-back-btn" onClick={handleBackToLesson}>
                  ← Quay lại bài học
                </button>
              </div>

              {isLoadingQuiz ? (
                <div className="quiz-loading">
                  <div className="loading-spinner"></div>
                  <p>Đang tạo câu hỏi...</p>
                </div>
              ) : quizError ? (
                <div className="quiz-error">
                  <p>{quizError}</p>
                  <button onClick={handleStartQuiz}>Thử lại</button>
                </div>
              ) : quizQuestions.length > 0 ? (
                <>
                  <div className="quiz-questions">
                    {quizQuestions.map((question, index) => (
                      <div key={question.id} className={`quiz-question ${showResults ? 'quiz-question-result' : ''}`}>
                        <div className="question-header">
                          <span className="question-number">Câu {index + 1}</span>
                          {showResults && (
                            <span className={`question-status ${userAnswers[question.id] === question.correctAnswer ? 'correct' : 'incorrect'}`}>
                              {userAnswers[question.id] === question.correctAnswer ? '✓ Đúng' : '✗ Sai'}
                            </span>
                          )}
                        </div>
                        <p className="question-text">{question.question}</p>
                        <div className="question-options">
                          {question.options.map((option, optIndex) => {
                            const isSelected = userAnswers[question.id] === optIndex;
                            const isCorrect = optIndex === question.correctAnswer;
                            const showCorrect = showResults && isCorrect;
                            const showIncorrect = showResults && isSelected && !isCorrect;

                            return (
                              <div
                                key={optIndex}
                                className={`option ${isSelected ? 'selected' : ''} ${showCorrect ? 'correct' : ''} ${showIncorrect ? 'incorrect' : ''}`}
                                onClick={() => handleAnswerSelect(question.id, optIndex)}
                              >
                                <span className="option-text">{option}</span>
                                {showCorrect && <span className="option-icon">✓</span>}
                                {showIncorrect && <span className="option-icon">✗</span>}
                              </div>
                            );
                          })}
                        </div>
                        {showResults && (
                          <div className="question-explanation">
                            <strong>Giải thích:</strong> {question.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {!showResults ? (
                    <div className="quiz-actions">
                      {!showSubmitConfirm ? (
                        <>
                          <button 
                            className="submit-quiz-btn"
                            onClick={handleSubmitQuiz}
                            disabled={Object.keys(userAnswers).length < quizQuestions.length}
                          >
                            Nộp bài
                          </button>
                          {Object.keys(userAnswers).length < quizQuestions.length && (
                            <p className="quiz-hint">Vui lòng trả lời tất cả các câu hỏi</p>
                          )}
                        </>
                      ) : (
                        <div className="submit-confirm-inline">
                          <div className="confirm-content">
                            <div className="confirm-text">
                              <h4>Xác nhận nộp bài</h4>
                              <p>Bạn có chắc chắn muốn nộp bài? Bạn sẽ không thể thay đổi câu trả lời sau khi nộp.</p>
                            </div>
                            <div className="confirm-actions">
                              <button className="confirm-cancel" onClick={() => setShowSubmitConfirm(false)}>
                                Hủy
                              </button>
                              <button className="confirm-submit" onClick={confirmSubmitQuiz}>
                                Xác nhận nộp
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="quiz-results-section">
                      <div className="results-card">
                        <div className="results-header">
                          <h3>Kết quả bài làm</h3>
                        </div>
                        
                        <div className="results-body">
                          <div className="results-main">
                            <div className="score-summary">
                              <div className="score-main">
                                <span className="score-value">{calculateScore()}</span>
                                <span className="score-divider">/</span>
                                <span className="score-total">{quizQuestions.length}</span>
                              </div>
                              <div className="score-percentage">
                                {Math.round((calculateScore() / quizQuestions.length) * 100)}%
                              </div>
                            </div>
                            
                            <div className="results-info">
                              <div className="info-row">
                                <span className="info-label">Số câu đúng:</span>
                                <span className="info-value correct">{calculateScore()}</span>
                              </div>
                              <div className="info-row">
                                <span className="info-label">Số câu sai:</span>
                                <span className="info-value incorrect">{quizQuestions.length - calculateScore()}</span>
                              </div>
                              <div className="info-row">
                                <span className="info-label">Thời gian:</span>
                                <span className="info-value">{formatTime(quizDuration)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="results-comment">
                            <div className="comment-icon">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <p className="comment-text">{getComment()}</p>
                          </div>
                        </div>
                        
                        <div className="results-footer">
                          <button className="retry-quiz-btn" onClick={handleStartQuiz}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Làm lại bài tập
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        ) : showSummary && !isLoadingSummary && summary ? (
          <div className="lesson-body">
            {/* Summary Result Only - No Header */}
            <div className="summary-result-section">
              <div className="summary-content">
                <div className="summary-main">
                  <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Tóm tắt bài học
                  </h3>
                  <div className="summary-text">
                    {parseMarkdown(summary)}
                  </div>
                </div>

                {keyPoints.length > 0 && (
                  <div className="summary-keypoints">
                    <h3>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Điểm chính cần nhớ
                    </h3>
                    <ul className="keypoints-list">
                      {keyPoints.map((point, index) => (
                        <li key={index}>
                          <span className="keypoint-number">{index + 1}</span>
                          <span className="keypoint-text">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Quiz Button at end of summary */}
              <div className="lesson-quiz-action">
                <button className="start-quiz-btn" onClick={handleStartQuiz} disabled={isLoadingQuiz}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Làm bài tập
                </button>
              </div>
            </div>
          </div>
        ) : summaryError ? (
          <div className="lesson-body">
            <div className="summary-error-full">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3>Không thể tạo tóm tắt</h3>
              <p>{summaryError}</p>
              <div className="error-actions">
                <button className="retry-btn" onClick={handleGenerateSummary}>
                  Thử lại
                </button>
                <button className="back-btn" onClick={() => {
                  setShowSummary(false);
                  setSummaryError('');
                }}>
                  Quay lại
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lesson-body">
            {lessonData.noi_dung && renderContent(lessonData.noi_dung)}
            
            {/* Quiz Button at end of lesson content */}
            <div className="lesson-quiz-action">
              <button className="start-quiz-btn" onClick={handleStartQuiz} disabled={isLoadingQuiz}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Làm bài tập
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default LessonContent;
