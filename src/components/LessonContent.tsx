import React, { useState, useEffect } from 'react';
import { generateLessonSummary, generateKeyPoints } from '../services/lessonSummaryService';

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

  // Reset summary when lesson changes
  useEffect(() => {
    setSummary('');
    setKeyPoints([]);
    setShowSummary(false);
    setSummaryError('');
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
    setIsLoadingSummary(true);
    setSummaryError('');
    setShowSummary(true);
    
    try {
      const [summaryText, points] = await Promise.all([
        generateLessonSummary(lessonData),
        generateKeyPoints(lessonData)
      ]);
      
      setSummary(summaryText);
      setKeyPoints(points);
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummaryError('Không thể tạo tóm tắt. Vui lòng thử lại sau.');
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const renderContent = (content: any): JSX.Element[] => {
    const elements: JSX.Element[] = [];

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

        {/* Show Summary Result or Original Content */}
        {showSummary && !isLoadingSummary && summary ? (
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
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonContent;
