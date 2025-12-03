import React, { useState, useEffect } from 'react';
import LessonSidebar from './LessonSidebar';
import LessonContent from './LessonContent';
import { lessons } from '../data/lessons';

const LessonPage: React.FC = () => {
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [lessonData, setLessonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedLessonId !== null) {
      loadLessonData(selectedLessonId);
    }
  }, [selectedLessonId]);

  const loadLessonData = async (lessonId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const lesson = lessons.find(l => l.id === lessonId);
      if (!lesson) {
        throw new Error('Không tìm thấy bài học');
      }

      // Load JSON file from source_content directory
      const response = await fetch(`/source_content/${lesson.fileName}`);
      if (!response.ok) {
        throw new Error('Không thể tải nội dung bài học');
      }

      const data = await response.json();
      setLessonData(data);
    } catch (err) {
      console.error('Error loading lesson:', err);
      setError('Có lỗi xảy ra khi tải bài học. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLesson = (lessonId: number) => {
    setSelectedLessonId(lessonId);
  };

  return (
    <div className="lesson-page">
      <div className="lesson-page-container">
        <LessonSidebar 
          selectedLessonId={selectedLessonId} 
          onSelectLesson={handleSelectLesson} 
        />
        <div className="lesson-main">
          {isLoading && (
            <div className="lesson-loading">
              <div className="loading-spinner"></div>
              <p>Đang tải bài học...</p>
            </div>
          )}
          {error && (
            <div className="lesson-error">
              <h3>Lỗi</h3>
              <p>{error}</p>
            </div>
          )}
          {!isLoading && !error && (
            <LessonContent lessonData={lessonData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
