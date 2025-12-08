import React, { useState, useEffect } from 'react';
import { generateLessonSummary, generateKeyPoints } from '../services/lessonSummaryService';
import { generateQuizForLesson, QuizQuestion } from '../services/quizService';

interface LessonContentProps {
  lessonData: any;
}

interface ContentItem {
  type: string;
  text?: string;
  src?: string;
  caption?: string;
  alt?: string;
}

interface Question {
  question: string;
  answer: string;
}

interface Subsection {
  subsection_id: string;
  title: string;
  content: ContentItem[];
  questions?: Question[];
}

interface Section {
  section_number: string;
  title: string;
  subsections?: Subsection[];
  content?: ContentItem[];
  questions?: Question[];
}

// Simple markdown parser for summary text
const parseMarkdown = (text: string): React.ReactElement[] => {
  // Add null/undefined check
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  const lines = text.split('\n');
  const elements: React.ReactElement[] = [];
  
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    
    // Handle headers (## or ###)
    if (line.startsWith('###')) {
      elements.push(
        <h4 key={index} style={{ fontSize: '1.1rem', fontWeight: '600', marginTop: '1.2rem', marginBottom: '0.8rem', color: 'rgba(255, 255, 255, 0.98)' }}>
          {line.replace(/^###\s*/, '')}
        </h4>
      );
    } else if (line.startsWith('##')) {
      elements.push(
        <h3 key={index} style={{ fontSize: '1.1rem', fontWeight: '600', marginTop: '1.2rem', marginBottom: '0.8rem', color: 'rgba(255, 255, 255, 0.98)' }}>
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
        <li key={index} style={{ marginBottom: '0.5rem', lineHeight: '1.6', fontSize: '1rem', color: 'rgba(255, 255, 255, 0.92)' }}>
          {processedContent}
        </li>
      );
    }
    // Regular paragraph
    else {
      const processedContent = processBoldText(line);
      elements.push(
        <p key={index} style={{ marginBottom: '1rem', lineHeight: '1.7', fontSize: '1rem', color: 'rgba(255, 255, 255, 0.95)' }}>
          {processedContent}
        </p>
      );
    }
  });
  
  return elements;
};

// Process bold text (**text** or __text__)
const processBoldText = (text: string): (string | React.ReactElement)[] => {
  // Add null/undefined check
  if (!text || typeof text !== 'string') {
    return [];
  }
  
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
      <strong key={match.index} style={{ fontWeight: '600', color: 'rgba(255, 255, 255, 1)', fontSize: '1rem' }}>
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

  // State for answer reveals
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(new Set());

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
    setRevealedAnswers(new Set());
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

  const toggleAnswerReveal = (questionId: string) => {
    setRevealedAnswers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const renderContentItem = (item: any, index: number): React.ReactElement => {
    switch (item.type) {
      case 'paragraph':
        return (
          <p key={`paragraph-${index}`} className="lesson-paragraph">
            {item.text}
          </p>
        );
      case 'image':
        return (
          <div key={`image-${index}`} className="lesson-image-container">
            <img 
              src={item.src} 
              alt={item.alt || ''} 
              className="lesson-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const container = target.parentElement;
                if (container) {
                  const errorDiv = document.createElement('div');
                  errorDiv.className = 'image-error';
                  errorDiv.textContent = `Không thể tải hình ảnh: ${item.caption || item.alt || 'Hình ảnh'}`;
                  container.appendChild(errorDiv);
                }
              }}
            />
            {item.caption && (
              <p className="lesson-image-caption">{item.caption}</p>
            )}
          </div>
        );
      case 'image_group':
        return (
          <div key={`image-group-${index}`} className="lesson-image-group">
            <div className="image-group-container">
              {item.images && item.images.map((image: any, imgIndex: number) => (
                <div key={`group-image-${imgIndex}`} className="group-image-item">
                  <img 
                    src={image.src} 
                    alt={image.alt || ''} 
                    className="lesson-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const container = target.parentElement;
                      if (container) {
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'image-error';
                        errorDiv.textContent = `Không thể tải hình ảnh: ${image.caption || image.alt || 'Hình ảnh'}`;
                        container.appendChild(errorDiv);
                      }
                    }}
                  />
                  {image.caption && (
                    <p className="lesson-image-caption">{image.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'table':
        return (
          <div key={`table-${index}`} className="lesson-table-container">
            {item.title && <h4 className="table-title">{item.title}</h4>}
            <table className="lesson-table">
              {item.headers && (
                <thead>
                  <tr>
                    {item.headers.map((header: string, headerIndex: number) => (
                      <th key={headerIndex}>{header}</th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {item.data && item.data.map((row: any, rowIndex: number) => (
                  <tr key={rowIndex}>
                    <td className="table-indicator">{row.indicator}</td>
                    <td className="table-unit">{row.unit}</td>
                    <td className="table-value">{row['2021']}</td>
                    <td className="table-value">{row['2022']}</td>
                    <td className="table-value">{row['2023']}</td>
                    <td className="table-value">{row.q1_2024}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {item.source && (
              <p className="table-source">Nguồn: {item.source}</p>
            )}
            {item.note && (
              <p className="table-note">{item.note}</p>
            )}
          </div>
        );
      case 'info_box':
        return (
          <div key={`info-box-${index}`} className="lesson-info-box">
            {item.title && <h5 className="info-box-title">{item.title}</h5>}
            <div className="info-box-content">
              {item.content ? parseMarkdown(item.content) : (item.text ? parseMarkdown(item.text) : '')}
            </div>
          </div>
        );
      case 'note':
        return (
          <div key={`note-${index}`} className="lesson-note">
            {parseMarkdown(item.content || item.text || '')}
          </div>
        );
      case 'list':
        return (
          <div key={`list-${index}`} className="lesson-list">
            {item.title && <h5 className="list-title">{item.title}</h5>}
            <ul>
              {item.items && item.items.map((listItem: any, listIndex: number) => (
                <li key={listIndex}>
                  {typeof listItem === 'string' ? (
                    listItem
                  ) : listItem.category && listItem.works ? (
                    <div className="list-item-category">
                      <strong>{listItem.category}:</strong> {listItem.works}
                    </div>
                  ) : (
                    JSON.stringify(listItem)
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      case 'diagram':
        return (
          <div key={`diagram-${index}`} className="lesson-diagram">
            {item.title && <h5 className="diagram-title">{item.title}</h5>}
            {/* Show diagram image */}
            {item.image_src && (
              <div className="diagram-image">
                <img 
                  src={item.image_src} 
                  alt={item.alt || item.title || 'Sơ đồ'} 
                  className="diagram-img"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const container = target.parentElement;
                    if (container) {
                      const errorDiv = document.createElement('div');
                      errorDiv.className = 'image-error';
                      errorDiv.textContent = `Không thể tải sơ đồ: ${item.title || 'Sơ đồ'}`;
                      container.appendChild(errorDiv);
                    }
                  }}
                />
              </div>
            )}
          </div>
        );
      case 'image_gallery':
        return (
          <div key={`gallery-${index}`} className="lesson-image-gallery">
            <div className="gallery-grid">
              {item.images && item.images.map((image: any, imgIndex: number) => (
                <div key={`gallery-image-${imgIndex}`} className="gallery-image-item">
                  <img 
                    src={image.src} 
                    alt={image.alt || ''} 
                    className="gallery-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const container = target.parentElement;
                      if (container) {
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'image-error';
                        errorDiv.textContent = `Không thể tải hình ảnh: ${image.caption || image.alt || 'Hình ảnh'}`;
                        container.appendChild(errorDiv);
                      }
                    }}
                  />
                  {image.caption && (
                    <p className="gallery-image-caption">{image.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'chart':
        return (
          <div key={`chart-${index}`} className="lesson-chart">
            {item.title && <h5 className="chart-title">{item.title}</h5>}
            <div className="chart-image">
              <img 
                src={item.image_src} 
                alt={item.alt || ''} 
                className="chart-img"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const container = target.parentElement;
                  if (container) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'image-error';
                    errorDiv.textContent = `Không thể tải biểu đồ: ${item.caption || item.alt || 'Biểu đồ'}`;
                    container.appendChild(errorDiv);
                  }
                }}
              />
              {item.caption && (
                <p className="chart-caption">{item.caption}</p>
              )}
            </div>
          </div>
        );
      case 'source':
        return (
          <div key={`source-${index}`} className="lesson-source">
            <p className="source-text">{item.text}</p>
          </div>
        );
      case 'note':
        return (
          <div key={`note-${index}`} className="lesson-note">
            <div className="note-text">{parseMarkdown(item.content || item.text || '')}</div>
          </div>
        );
      case 'image_group':
        return (
          <div key={`image-group-${index}`} className="lesson-image-group">
            <div className="image-group-grid">
              {item.images && item.images.map((image: any, imgIndex: number) => (
                <div key={`group-image-${imgIndex}`} className="image-group-item">
                  <img 
                    src={image.src} 
                    alt={image.alt || ''} 
                    className="group-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const container = target.parentElement;
                      if (container) {
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'image-error';
                        errorDiv.textContent = `Không thể tải hình ảnh: ${image.caption || image.alt || 'Hình ảnh'}`;
                        container.appendChild(errorDiv);
                      }
                    }}
                  />
                  {image.caption && (
                    <p className="group-image-caption">{image.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'literary_work':
        return (
          <div key={`literary-work-${index}`} className="literary-work">
            <div className="work-header">
              <h3 className="work-title">{item.title}</h3>
              <p className="work-author">Tác giả: {item.author}</p>
            </div>
            <div className="work-content">
              {item.text_parts && item.text_parts.map((part: string, partIndex: number) => (
                <p key={partIndex} className="work-paragraph">{part}</p>
              ))}
            </div>
            {item.source && (
              <p className="work-source">{item.source}</p>
            )}
            {item.reading_guide && (
              <div className="reading-guide">
                <h4 className="guide-title">{item.reading_guide.title}</h4>
                <div className="guide-questions">
                  {item.reading_guide.questions.map((q: any, qIndex: number) => {
                    const questionId = `guide-q${qIndex}`;
                    const isRevealed = revealedAnswers.has(questionId);
                    
                    return (
                      <div key={qIndex} className="guide-question-item">
                        <p className="guide-question">
                          <strong>Câu {q.question_number}:</strong> {q.question}
                        </p>
                        <button 
                          className="answer-toggle-btn"
                          onClick={() => toggleAnswerReveal(questionId)}
                        >
                          {isRevealed ? 'Ẩn đáp án' : 'Hiện đáp án'}
                        </button>
                        {isRevealed && (
                          <div className="guide-answer">
                            {parseMarkdown(q.answer)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {item.remember && (
              <div className="work-remember">
                <h4 className="remember-title">{item.remember.title}</h4>
                <div className="remember-content">{parseMarkdown(item.remember.content || '')}</div>
              </div>
            )}
          </div>
        );
      case 'music_sheet':
        return (
          <div key={`music-sheet-${index}`} className="music-sheet">
            <div className="sheet-header">
              <h3 className="sheet-title">{item.title}</h3>
              <p className="sheet-composer">{item.composer}</p>
              {item.tempo && <p className="sheet-tempo">Tempo: {item.tempo}</p>}
            </div>
            {item.description && (
              <p className="sheet-description">{item.description}</p>
            )}
            {item.image && (
              <div className="sheet-image">
                <img 
                  src={item.image} 
                  alt={`Sheet nhạc ${item.title}`}
                  className="sheet-img"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const container = target.parentElement;
                    if (container) {
                      const errorDiv = document.createElement('div');
                      errorDiv.className = 'image-error';
                      errorDiv.textContent = `Không thể tải sheet nhạc: ${item.title}`;
                      container.appendChild(errorDiv);
                    }
                  }}
                />
              </div>
            )}
          </div>
        );
      case 'question_prompt':
        return (
          <div key={`question-prompt-${index}`} className="question-prompt">
            <div className="prompt-icon">❓</div>
            <p className="prompt-text">{item.text}</p>
          </div>
        );
      case 'subsection':
        return (
          <div key={`subsection-${index}`} className="lesson-subsection">
            <h6 className="subsection-title">{item.title}</h6>
            <div className="subsection-content">
              {Array.isArray(item.content) ? (
                item.content.map((subItem: any, subIndex: number) => (
                  typeof subItem === 'string' ? (
                    <p key={subIndex} className="subsection-paragraph">{processBoldText(subItem)}</p>
                  ) : subItem.title && subItem.details ? (
                    <div key={subIndex} className="subsection-item">
                      <h5 className="item-title">{subItem.title}</h5>
                      {Array.isArray(subItem.details) ? (
                        <ul className="item-details-list">
                          {subItem.details.map((detail: string, detailIndex: number) => (
                            <li key={detailIndex}>{processBoldText(detail)}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="item-details">{processBoldText(subItem.details)}</p>
                      )}
                    </div>
                  ) : (
                    <div key={subIndex}>{JSON.stringify(subItem)}</div>
                  )
                ))
              ) : (
                <div>{parseMarkdown(item.content || '')}</div>
              )}
            </div>
          </div>
        );
      case 'recognition':
        return (
          <div key={`recognition-${index}`} className="recognition-section">
            <h6 className="recognition-title">🏆 Các danh hiệu và công nhận</h6>
            <ul className="recognition-list">
              {item.items && item.items.map((recognition: string, recIndex: number) => (
                <li key={recIndex} className="recognition-item">{recognition}</li>
              ))}
            </ul>
          </div>
        );
      default:
        return <div key={`unknown-${index}`}></div>;
    }
  };

  const renderQuestions = (questions: Question[], sectionId: string): React.ReactElement[] => {
    return questions.map((question, index) => {
      const questionId = `${sectionId}-q${index}`;
      const isRevealed = revealedAnswers.has(questionId);
      
      return (
        <div key={questionId} className="lesson-question-container">
          <div className="lesson-question">
            <h4 className="question-title">Câu hỏi {(question as any).question_number || (index + 1)}:</h4>
            <p className="question-text">{question.question}</p>
            
            {/* Handle sub_questions */}
            {(question as any).sub_questions && (
              <div className="sub-questions">
                <ol>
                  {(question as any).sub_questions.map((subQ: string, subIndex: number) => (
                    <li key={subIndex} className="sub-question">{subQ}</li>
                  ))}
                </ol>
              </div>
            )}
            
            {/* Handle map */}
            {(question as any).map && (
              <div className="question-map">
                <img 
                  src={(question as any).map.image_src} 
                  alt={(question as any).map.alt || ''} 
                  className="map-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const container = target.parentElement;
                    if (container) {
                      const errorDiv = document.createElement('div');
                      errorDiv.className = 'image-error';
                      errorDiv.textContent = `Không thể tải bản đồ: ${(question as any).map.caption || (question as any).map.alt || 'Bản đồ'}`;
                      container.appendChild(errorDiv);
                    }
                  }}
                />
                {(question as any).map.caption && (
                  <p className="map-caption">{(question as any).map.caption}</p>
                )}
              </div>
            )}
            
            {/* Show empty table template for table-type questions */}
            {(question as any).answer_type === 'table' && typeof question.answer === 'object' && (
              <div className="question-table-template">
                <table className="lesson-table">
                  <thead>
                    <tr>
                      {(question.answer as any).headers && (question.answer as any).headers.map((header: string, headerIndex: number) => (
                        <th key={headerIndex}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(question.answer as any).rows && (question.answer as any).rows.map((row: any, rowIndex: number) => (
                      <tr key={rowIndex}>
                        <td>{row.name}</td>
                        <td>?</td>
                        <td>?</td>
                        <td>?</td>
                        <td>?</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <button 
              className="answer-toggle-btn"
              onClick={() => toggleAnswerReveal(questionId)}
            >
              {isRevealed ? 'Ẩn đáp án' : 'Hiện đáp án'}
            </button>
            {isRevealed && (
              <div className="question-answer">
                <h5>Đáp án:</h5>
                {(question as any).answer_type === 'table' && typeof question.answer === 'object' ? (
                  <div className="answer-table">
                    <table className="lesson-table">
                      <thead>
                        <tr>
                          {(question.answer as any).headers && (question.answer as any).headers.map((header: string, headerIndex: number) => (
                            <th key={headerIndex}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(question.answer as any).rows && (question.answer as any).rows.map((row: any, rowIndex: number) => (
                          <tr key={rowIndex}>
                            <td>{row.name}</td>
                            <td>{row.location}</td>
                            <td>{row.classification}</td>
                            <td>{row.year}</td>
                            <td>{row.features}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="answer-content">
                    <div className="answer-text">
                      {parseMarkdown(typeof question.answer === 'string' ? question.answer : '')}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  const renderSubsection = (subsection: any, sectionIndex: number, subsectionIndex: number): React.ReactElement => {
    const subsectionId = `section-${sectionIndex}-subsection-${subsectionIndex}`;
    
    return (
      <div key={subsectionId} className="lesson-subsection">
        <h4 className="subsection-title">
          {subsection.subsection_number || subsection.subsection_id}. {subsection.title}
        </h4>
        
        {/* Handle location and classification for lesson 4 */}
        {(subsection.location || subsection.classification) && (
          <div className="subsection-metadata">
            {subsection.location && (
              <p className="subsection-location"><strong>Địa điểm:</strong> {subsection.location}</p>
            )}
            {subsection.classification && (
              <p className="subsection-classification"><strong>Phân loại:</strong> {subsection.classification}</p>
            )}
          </div>
        )}
        
        {/* Handle periods structure */}
        {subsection.periods ? (
          <div className="subsection-periods">
            {subsection.periods.map((period: any, periodIndex: number) => (
              <div key={`period-${periodIndex}`} className="lesson-period">
                <h5 className="period-title">{period.period_title}</h5>
                <div className="period-content">
                  {period.content && period.content.map((item: any, index: number) => renderContentItem(item, index))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Handle normal content structure */
          <>
            {subsection.content && (
              <div className="subsection-content">
                {subsection.content.map((item: any, index: number) => renderContentItem(item, index))}
              </div>
            )}
            
            {/* Handle attractions structure for tourism lessons */}
            {subsection.attractions && (
              <div className="attractions-section">
                {subsection.attractions.map((attraction: any, attractionIndex: number) => (
                  <div key={`attraction-${attractionIndex}`} className="attraction-item">
                    <h5 className="attraction-title">
                      {attraction.attraction_number} {attraction.name}
                    </h5>
                    <div className="attraction-content">
                      {attraction.content && attraction.content.map((item: any, index: number) => 
                        renderContentItem(item, index)
                      )}
                    </div>
                    {attraction.question && (
                      <div className="attraction-question">
                        <div className="question-header">
                          <h6 className="question-title">Câu hỏi</h6>
                          <button
                            className="answer-toggle-btn"
                            onClick={() => toggleAnswerReveal(`${subsectionId}-attraction-${attractionIndex}`)}
                          >
                            {revealedAnswers.has(`${subsectionId}-attraction-${attractionIndex}`) ? 'Ẩn đáp án' : 'Hiện đáp án'}
                          </button>
                        </div>
                        <p className="question-text">{attraction.question.text}</p>
                        {revealedAnswers.has(`${subsectionId}-attraction-${attractionIndex}`) && (
                          <div className="answer-content">
                            <h6 className="answer-title">Đáp án:</h6>
                            <div className="answer-text">
                              {parseMarkdown(attraction.question.answer)}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {subsection.questions && subsection.questions.length > 0 && (
          <div className="subsection-questions">
            {renderQuestions(subsection.questions, subsectionId)}
          </div>
        )}
      </div>
    );
  };

  const renderSection = (section: Section, index: number): React.ReactElement => {
    const sectionId = `section-${index}`;
    
    return (
      <div key={sectionId} className="lesson-section">
        <h3 className="section-title">
          {section.section_number}. {section.title}
        </h3>
        
        {/* Handle intro field for lesson 8 */}
        {(section as any).intro && (
          <div className="section-intro">
            <p>{(section as any).intro}</p>
          </div>
        )}
        
        {section.subsections && section.subsections.map((subsection, subsectionIndex) => 
          renderSubsection(subsection, index, subsectionIndex)
        )}
        
        {section.content && (
          <div className="section-content">
            {section.content.map((item, contentIndex) => renderContentItem(item, contentIndex))}
          </div>
        )}
        
        {section.questions && section.questions.length > 0 && (
          <div className="section-questions">
            {renderQuestions(section.questions, sectionId)}
          </div>
        )}
        
        {/* Handle activities for lesson 12 */}
        {(section as any).activities && (section as any).activities.length > 0 && (
          <div className="section-activities">
            {(section as any).activities.map((activity: any, activityIndex: number) => (
              <div key={`activity-${activityIndex}`} className="lesson-activity">
                <h5 className="activity-title">Hoạt động {activity.activity_id}</h5>
                <p className="activity-instruction">{activity.instruction}</p>
                
                {activity.tasks && activity.tasks.map((task: any, taskIndex: number) => (
                  <div key={`task-${taskIndex}`} className="activity-task">
                    <h6 className="task-title">Nhiệm vụ {task.task_id}:</h6>
                    <p className="task-description">{task.description}</p>
                    
                    {/* Handle diagram in task */}
                    {task.diagram && (
                      <div className="task-diagram">
                        {task.diagram.image && (
                          <img 
                            src={task.diagram.image} 
                            alt={task.diagram.description || 'Sơ đồ'} 
                            className="task-diagram-image"
                          />
                        )}
                        {task.diagram.description && (
                          <p className="diagram-description">{task.diagram.description}</p>
                        )}
                      </div>
                    )}
                    
                    {/* Handle word bank and fill in blank */}
                    {task.word_bank && (
                      <div className="word-bank">
                        <h6>Từ khóa:</h6>
                        <div className="word-bank-items">
                          {task.word_bank.map((word: string, wordIndex: number) => (
                            <span key={wordIndex} className="word-bank-item">{word}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {task.fill_in_blank && (
                      <div className="fill-in-blank">
                        <p className="fill-text">{task.fill_in_blank.text}</p>
                        {task.fill_in_blank.source && (
                          <p className="fill-source">{task.fill_in_blank.source}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                {activity.answer && (
                  <div className="activity-answer">
                    <div className="answer-placeholder">
                      <strong>Câu trả lời:</strong>
                      <div className="answer-text">
                        {parseMarkdown(activity.answer)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderLearningObjectives = (objectives: string[]): React.ReactElement => {
    return (
      <div className="learning-objectives">
        <h3 className="objectives-title">Mục tiêu bài học</h3>
        <ul className="objectives-list">
          {objectives.map((objective, index) => (
            <li key={index} className="objective-item">{objective}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderIntroduction = (introduction: any): React.ReactElement => {
    return (
      <div className="lesson-introduction">
        <h3 className="introduction-title">{introduction.title}</h3>
        
        {/* Handle comparison structure for lesson 3 */}
        {introduction.content?.comparison ? (
          <div className="introduction-comparison">
            <div className="comparison-images">
              <div className="comparison-image">
                <img 
                  src={introduction.content.comparison.image_before.src} 
                  alt={introduction.content.comparison.image_before.alt}
                />
                <p className="image-caption">{introduction.content.comparison.image_before.caption}</p>
              </div>
              <div className="comparison-image">
                <img 
                  src={introduction.content.comparison.image_after.src} 
                  alt={introduction.content.comparison.image_after.alt}
                />
                <p className="image-caption">{introduction.content.comparison.image_after.caption}</p>
              </div>
            </div>
            <div className="comparison-task">
              <p><strong>Nhiệm vụ:</strong> {introduction.content.comparison.task}</p>
            </div>
          </div>
        ) : introduction.content?.task && introduction.content?.images ? (
          /* Handle task + images structure for lesson 4 */
          <div className="introduction-task-images">
            <div className="task-description">
              <p><strong>Nhiệm vụ:</strong> {introduction.content.task}</p>
            </div>
            <div className="task-images">
              {introduction.content.images.map((image: any, index: number) => (
                <div key={index} className="task-image">
                  <img src={image.src} alt={image.alt} />
                  <p className="image-caption">{image.caption}</p>
                </div>
              ))}
            </div>
          </div>
        ) : introduction.content?.task && introduction.content?.image ? (
          /* Handle task + single image structure for Phú Yên lesson */
          <div className="introduction-task-image">
            <div className="task-description">
              <p><strong>Nhiệm vụ:</strong> {introduction.content.task}</p>
            </div>
            <div className="task-single-image">
              <img 
                src={introduction.content.image.src} 
                alt={introduction.content.image.alt}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const container = target.parentElement;
                  if (container) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'image-error';
                    errorDiv.textContent = `Không thể tải hình ảnh: ${introduction.content.image.caption || introduction.content.image.alt || 'Hình ảnh'}`;
                    container.appendChild(errorDiv);
                  }
                }}
              />
              <p className="image-caption">{introduction.content.image.caption}</p>
              {introduction.content.image.credit && (
                <p className="image-credit">{introduction.content.image.credit}</p>
              )}
            </div>
          </div>
        ) : introduction.content?.questions && introduction.content?.images ? (
          /* Handle lesson 12 questions + images structure */
          <div className="introduction-content">
            <div className="introduction-questions">
              {introduction.content.questions.map((question: string, index: number) => (
                <p key={index} className="introduction-question">
                  <strong>Câu hỏi {index + 1}:</strong> {question}
                </p>
              ))}
            </div>
            <div className="introduction-images">
              {introduction.content.images.map((image: any, index: number) => (
                <div key={index} className="introduction-image-item">
                  <img src={image.src} alt={image.alt} />
                  <p className="image-caption">{image.caption}</p>
                </div>
              ))}
            </div>
          </div>
        ) : introduction.content?.matching_exercise ? (
          /* Handle lesson 8 matching exercise structure */
          <div className="introduction-content">
            {introduction.content.task && (
              <p className="introduction-task"><strong>Nhiệm vụ:</strong> {introduction.content.task}</p>
            )}
            <div className="matching-exercise">
              <div className="matching-columns">
                <div className="column-a">
                  <h5>Cột A</h5>
                  {introduction.content.matching_exercise.column_a && introduction.content.matching_exercise.column_a.map((item: any, index: number) => (
                    <div key={index} className="matching-item">
                      <span className="item-icon">{item.icon}</span>
                      <span className="item-text">{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="column-b">
                  <h5>Cột B</h5>
                  {introduction.content.matching_exercise.column_b && introduction.content.matching_exercise.column_b.map((item: string, index: number) => (
                    <div key={index} className="matching-item">
                      <span className="item-text">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {introduction.content.follow_up && (
              <p className="introduction-followup"><strong>Câu hỏi tiếp theo:</strong> {introduction.content.follow_up}</p>
            )}
          </div>
        ) : introduction.content?.activity && introduction.content?.question ? (
          /* Handle Phú Yên Topic 5 activity + question structure */
          <div className="introduction-activity-question">
            <div className="activity-section">
              <h4 className="activity-title">Hoạt động:</h4>
              <p className="activity-description">{introduction.content.activity}</p>
            </div>
            <div className="question-section">
              <h4 className="question-title">Câu hỏi:</h4>
              <p className="question-text">{introduction.content.question}</p>
            </div>
          </div>
        ) : introduction.content?.activity && introduction.content?.sample_program ? (
          /* Handle Phú Yên Topic 3 expert interview structure */
          <div className="introduction-expert-interview">
            <div className="interview-activity">
              <h4 className="activity-title">{introduction.content.activity}</h4>
              <p className="activity-description">{introduction.content.description}</p>
              {introduction.content.steps && (
                <div className="activity-steps">
                  <h5>Các bước thực hiện:</h5>
                  <ol>
                    {introduction.content.steps.map((step: string, index: number) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
            <div className="sample-program">
              <h4 className="program-title">{introduction.content.sample_program.title}</h4>
              <div className="program-questions">
                {introduction.content.sample_program.questions.map((qa: any, index: number) => (
                  <div key={index} className="qa-pair">
                    <p className="mc-question"><strong>MC:</strong> {qa.mc}</p>
                    <p className="expert-answer"><strong>Chuyên gia:</strong> {qa.expert}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : introduction.content?.historical_sites || introduction.content?.notable_figures || introduction.content?.task ? (
          /* Handle lesson 2 structure with content object */
          <div className="introduction-content">
            {introduction.content.historical_sites && (
              <p className="introduction-activity"><strong>Di tích lịch sử:</strong> {introduction.content.historical_sites}</p>
            )}
            {introduction.content.notable_figures && (
              <p className="introduction-activity"><strong>Nhân vật tiêu biểu:</strong> {introduction.content.notable_figures}</p>
            )}
            {introduction.content.task && (
              <p className="introduction-task"><strong>Nhiệm vụ:</strong> {introduction.content.task}</p>
            )}
          </div>
        ) : introduction.content && introduction.question ? (
          /* Handle content + question structure for Topic 7 */
          <div className="introduction-content-question">
            <div className="introduction-content">
              <p>{introduction.content}</p>
            </div>
            <div className="introduction-question-section">
              <div className="question-header">
                <h4 className="question-title">Câu hỏi</h4>
                <button
                  className="answer-toggle-btn"
                  onClick={() => toggleAnswerReveal('introduction-question')}
                >
                  {revealedAnswers.has('introduction-question') ? 'Ẩn đáp án' : 'Hiện đáp án'}
                </button>
              </div>
              <p className="question-text">{introduction.question.text}</p>
              {revealedAnswers.has('introduction-question') && (
                <div className="answer-content">
                  <h6 className="answer-title">Đáp án:</h6>
                  <div className="answer-text">
                    {parseMarkdown(introduction.question.answer)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : introduction.content?.content ? (
          /* Handle nested content object */
          <div className="introduction-content">
            {Array.isArray(introduction.content.content) 
              ? introduction.content.content.map((item: any, index: number) => renderContentItem(item, index))
              : <p>{introduction.content.content}</p>
            }
          </div>
        ) : (
          /* Handle flat content array or string */
          <div className="introduction-content">
            {Array.isArray(introduction.content) 
              ? introduction.content.map((item: any, index: number) => renderContentItem(item, index))
              : <p>{introduction.content}</p>
            }
          </div>
        )}
      </div>
    );
  };

  const renderMainContent = (mainContent: any): React.ReactElement => {
    return (
      <div className="main-content">
        <h2 className="main-content-title">{mainContent.title}</h2>
        <div className="main-content-sections">
          {mainContent.sections.map((section: Section, index: number) => renderSection(section, index))}
        </div>
      </div>
    );
  };

  const renderLanguagePractice = (languagePractice: any): React.ReactElement => {
    if (!languagePractice) return <div></div>;
    
    return (
      <div className="language-practice">
        <h2 className="language-practice-title">{languagePractice.title}</h2>
        <div className="language-exercises">
          {languagePractice.exercises && languagePractice.exercises.map((exercise: any, index: number) => (
            <div key={index} className="language-exercise">
              <h4 className="exercise-number">Bài tập {exercise.exercise_number}</h4>
              <p className="exercise-description">{exercise.description}</p>
              {exercise.text && (
                <div className="exercise-text">
                  <p className="text-content">{exercise.text}</p>
                  {exercise.source && (
                    <p className="text-source">{exercise.source}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPractice = (practice: any): React.ReactElement => {
    if (!practice) return <div></div>;
    
    return (
      <div className="lesson-practice">
        <h2 className="practice-title">{practice.title}</h2>
        {/* Handle single exercise with steps for lesson 12 */}
        {practice.exercise && (
          <div className="practice-single-exercise">
            <h4 className="exercise-title">{practice.exercise.title}</h4>
            {practice.exercise.steps && (
              <div className="exercise-steps">
                {practice.exercise.steps.map((step: any, stepIndex: number) => (
                  <div key={`step-${stepIndex}`} className="exercise-step">
                    <h5 className="step-title">Bước {step.step_number}: {step.title}</h5>
                    <p className="step-description">{step.description}</p>
                    
                    {/* Handle image in step */}
                    {step.image && (
                      <div className="step-image">
                        <img 
                          src={step.image} 
                          alt="Hình ảnh minh họa" 
                          className="step-img"
                        />
                      </div>
                    )}
                    
                    {/* Handle table in step */}
                    {step.table && (
                      <div className="step-table">
                        {step.table.image && (
                          <img 
                            src={step.table.image} 
                            alt="Bảng phân loại hoạt động" 
                            className="table-diagram"
                          />
                        )}
                        {step.table.headers && (
                          <table className="lesson-table">
                            <thead>
                              <tr>
                                {step.table.headers.map((header: string, headerIndex: number) => (
                                  <th key={headerIndex}>{header}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {step.table.sample_rows && step.table.sample_rows.map((row: any, rowIndex: number) => (
                                <tr key={rowIndex}>
                                  <td>
                                    {row.activity}
                                    {row.image && (
                                      <div className="row-image">
                                        <img src={row.image} alt={row.activity} className="sample-image" />
                                      </div>
                                    )}
                                  </td>
                                  <td>{row.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="practice-exercises">
          {practice.exercises && practice.exercises.map((exercise: any, index: number) => (
            <div key={`exercise-${index}`} className="practice-exercise">
              <h4 className="exercise-title">Bài tập {exercise.exercise_number || (index + 1)}</h4>
              {exercise.question && <p className="exercise-question">{exercise.question}</p>}
              {exercise.description && <p className="exercise-description">{exercise.description}</p>}
              
              {/* Handle guidelines for Phú Yên Topic 3 */}
              {exercise.guidelines && (
                <div className="exercise-guidelines">
                  <h5 className="guidelines-title">{exercise.guidelines.title}</h5>
                  <div className="guidelines-steps">
                    {exercise.guidelines.steps && exercise.guidelines.steps.map((step: any, stepIndex: number) => (
                      <div key={stepIndex} className="guideline-step">
                        <h6 className="step-title">{step.step}</h6>
                        {step.tasks && (
                          <ul className="step-tasks">
                            {step.tasks.map((task: string, taskIndex: number) => (
                              <li key={taskIndex} className="step-task">{task}</li>
                            ))}
                          </ul>
                        )}
                        {step.requirements && (
                          <div className="step-requirements">
                            {step.requirements.map((req: string, reqIndex: number) => (
                              <p key={reqIndex} className="step-requirement">{req}</p>
                            ))}
                          </div>
                        )}
                        {step.outline && (
                          <div className="step-outline">
                            {step.outline.map((item: string, outlineIndex: number) => (
                              <p key={outlineIndex} className="outline-item">{item}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Handle table_format for Phú Yên Topic 3 */}
              {exercise.table_format && (
                <div className="exercise-table-format">
                  <table className="format-table">
                    <thead>
                      <tr>
                        {exercise.table_format.headers.map((header: string, headerIndex: number) => (
                          <th key={headerIndex}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={exercise.table_format.headers.length}>
                          {exercise.table_format.note}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Handle tasks array for lesson 8 */}
              {exercise.tasks && (
                <div className="exercise-tasks">
                  <ol>
                    {exercise.tasks.map((task: string, taskIndex: number) => (
                      <li key={taskIndex} className="exercise-task">{task}</li>
                    ))}
                  </ol>
                </div>
              )}
              {exercise.timeline && (
                <div className="exercise-timeline">
                  <h5>{exercise.timeline.title}</h5>
                  <div className="timeline-events">
                    {exercise.timeline.events && exercise.timeline.events.map((event: any, eventIndex: number) => (
                      <div key={eventIndex} className="timeline-event">
                        <strong>{event.period || event.date}:</strong> 
                        <span className="event-content">{event.event || "[Điền thông tin]"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {exercise.table && (
                <div className="exercise-mind-map">
                  {exercise.table.title && <h5 className="mind-map-title">{exercise.table.title}</h5>}
                  <div className="mind-map-container">
                    <div className="mind-map-center">
                      Đắk Lắk<br/>(1975-1985)
                    </div>
                    <div className="mind-map-branches">
                      {exercise.table.categories && exercise.table.categories.map((category: any, catIndex: number) => (
                        <div key={catIndex} className="mind-map-branch">
                          <div className="branch-main">
                            {category.category}
                          </div>
                          <div className="branch-items">
                            {category.items && category.items.map((item: string, itemIndex: number) => (
                              <div key={itemIndex} className="branch-item">{item}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {exercise.diagram && (
                <div className="exercise-diagram">
                  <div className="diagram-container">
                    <div className="diagram-center">
                      {exercise.diagram.center}
                    </div>
                    <div className="diagram-branches">
                      {exercise.diagram.branches && exercise.diagram.branches.map((branch: string, branchIndex: number) => (
                        <div key={branchIndex} className="diagram-branch">
                          {branch}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {exercise.categories && (
                <div className="exercise-categories">
                  <div className="categories-container">
                    {exercise.categories.should_do && (
                      <div className="category-section">
                        <h5 className="category-title">{exercise.categories.should_do.title}</h5>
                        <ul className="category-list">
                          {exercise.categories.should_do.items && exercise.categories.should_do.items.map((item: string, itemIndex: number) => (
                            <li key={itemIndex} className="category-item should-do">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exercise.categories.should_not_do && (
                      <div className="category-section">
                        <h5 className="category-title">{exercise.categories.should_not_do.title}</h5>
                        <ul className="category-list">
                          {exercise.categories.should_not_do.items && exercise.categories.should_not_do.items.map((item: string, itemIndex: number) => (
                            <li key={itemIndex} className="category-item should-not-do">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {exercise.title && exercise.areas && (
                <div className="exercise-presentation">
                  <h5>{exercise.title}</h5>
                  <div className="presentation-areas">
                    {exercise.areas.map((area: string, areaIndex: number) => (
                      <div key={areaIndex} className="presentation-area">{area}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderApplication = (application: any): React.ReactElement => {
    if (!application) return <div></div>;
    
    return (
      <div className="lesson-application">
        <h2 className="application-title">{application.title}</h2>
        
        {/* Handle single project structure (lesson 1-3, 8) */}
        {application.project && (
          <div className="application-project">
            <h3 className="project-title">{application.project.title}</h3>
            {application.project.description && <p className="project-description">{application.project.description}</p>}
            
            {/* Handle template structure for lesson 8 */}
            {application.project.template && (
              <div className="project-template">
                <h4 className="template-title">{application.project.template.title}</h4>
                <div className="template-fields">
                  {application.project.template.fields && application.project.template.fields.map((field: string, fieldIndex: number) => (
                    <div key={fieldIndex} className="template-field">
                      <p>{field}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Handle steps structure for lesson 12 */}
            {application.project.steps && (
              <div className="project-steps">
                {application.project.steps.map((step: any, stepIndex: number) => (
                  <div key={stepIndex} className="project-step">
                    <h5 className="step-title">Bước {step.step_number}:</h5>
                    <p className="step-description">{step.description}</p>
                  </div>
                ))}
              </div>
            )}
            
            {/* Handle image in project for lesson 12 */}
            {application.project.image && (
              <div className="project-image">
                <img 
                  src={application.project.image.src} 
                  alt={application.project.image.alt || ''} 
                  className="project-img"
                />
                {application.project.image.caption && (
                  <p className="project-image-caption">{application.project.image.caption}</p>
                )}
              </div>
            )}
            
            {/* Handle tasks structure */}
            {application.project.tasks && (
              <div className="project-tasks">
                {application.project.tasks.map((task: any, index: number) => (
                  <div key={`task-${index}`} className="project-task">
                    <span className="task-number">{task.task_number}.</span>
                    <span className="task-description">{task.description}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Handle table structure */}
            {application.project.table && (
              <div className="project-table">
                <table className="application-table">
                  <thead>
                    <tr>
                      {application.project.table.headers.map((header: string, index: number) => (
                        <th key={`header-${index}`}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {application.project.table.rows.map((row: string[], rowIndex: number) => (
                      <tr key={`row-${rowIndex}`}>
                        {row.map((cell: string, cellIndex: number) => (
                          <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* Handle projects array structure (lesson 4) */}
        {application.projects && (
          <div className="application-projects">
            {application.projects.map((project: any, projectIndex: number) => (
              <div key={`project-${projectIndex}`} className="application-project">
                <h3 className="project-title">Dự án {project.project_number}</h3>
                {project.description && <p className="project-description">{project.description}</p>}
                {project.question && <p className="project-question">{project.question}</p>}
                
                {/* Handle table structure */}
                {project.table && (
                  <div className="project-table">
                    <table className="lesson-table">
                      <thead>
                        <tr>
                          {project.table.headers && project.table.headers.map((header: string, headerIndex: number) => (
                            <th key={headerIndex}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {project.table.sample_rows && project.table.sample_rows.map((row: string[], rowIndex: number) => (
                          <tr key={`row-${rowIndex}`}>
                            {row.map((cell: string, cellIndex: number) => (
                              <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAdditionalReading = (additionalReading: any): React.ReactElement => {
    if (!additionalReading) return <div></div>;
    
    return (
      <div className="lesson-additional-reading">
        <h2 className="additional-reading-title">{additionalReading.title}</h2>
        {additionalReading.topic && (
          <h3 className="additional-reading-topic">{additionalReading.topic}</h3>
        )}
        <div className="additional-reading-content">
          {additionalReading.content && additionalReading.content.map((item: any, index: number) => renderContentItem(item, index))}
        </div>
      </div>
    );
  };

  if (!lessonData || !lessonData.lesson) {
    return (
      <div className="lesson-content-empty">
        <h2>Chọn một bài học để bắt đầu</h2>
        <p>Vui lòng chọn một bài học từ danh sách bên trái</p>
      </div>
    );
  }

  const lesson = lessonData.lesson;

  return (
    <div className="lesson-content">
      <div className="lesson-header">
        <h1 className="lesson-title">{lesson.title}</h1>
        
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
            {/* Learning Objectives */}
            {lesson.learning_objectives && renderLearningObjectives(lesson.learning_objectives)}
            
            {/* Introduction */}
            {lesson.introduction && renderIntroduction(lesson.introduction)}
            
            {/* Main Content */}
            {lesson.main_content && renderMainContent(lesson.main_content)}
            
            {/* Language Practice */}
            {lesson.language_practice && renderLanguagePractice(lesson.language_practice)}
            
            {/* Practice */}
            {lesson.practice && renderPractice(lesson.practice)}
            
            {/* Application */}
            {lesson.application && renderApplication(lesson.application)}
            
            {/* Additional Reading */}
            {lesson.additional_reading && renderAdditionalReading(lesson.additional_reading)}
            
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
