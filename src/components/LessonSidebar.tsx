import React from 'react';
import { lessons, Lesson } from '../data/lessons';

interface LessonSidebarProps {
  selectedLessonId: number | null;
  onSelectLesson: (lessonId: number) => void;
  onSelectComprehensiveExercise: () => void;
  showComprehensiveExercise: boolean;
}

const LessonSidebar: React.FC<LessonSidebarProps> = ({ selectedLessonId, onSelectLesson, onSelectComprehensiveExercise, showComprehensiveExercise }) => {
  return (
    <div className="lesson-sidebar">
      <div className="lesson-sidebar-header">
        <h2>Danh sách bài học</h2>
        <p className="lesson-count">{lessons.length} bài học</p>
      </div>
      <div className="lesson-list">
        {lessons.map((lesson: Lesson) => {
          // Parse the title to extract lesson number, province, and lesson name
          const titleParts = lesson.title.split(': ');
          const lessonNumberAndProvince = titleParts[0]; // "Bài 1 - Đắk Lắk" or "Chủ đề 1 - Phú Yên"
          const lessonName = titleParts[1]; // "Đắk Lắk từ năm 1930 đến năm 1945"
          
          return (
            <div
              key={lesson.id}
              className={`lesson-item ${selectedLessonId === lesson.id ? 'lesson-item-active' : ''}`}
              onClick={() => onSelectLesson(lesson.id)}
            >
              <div className="lesson-number">{lessonNumberAndProvince}</div>
              <div className="lesson-item-title">{lessonName}</div>
              {selectedLessonId === lesson.id && (
                <div className="lesson-active-indicator">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                  </svg>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Comprehensive Exercise Option */}
        <div className="lesson-divider">
          <span>Bài tập tổng hợp</span>
        </div>
        <div
          className={`lesson-item lesson-item-exercise ${showComprehensiveExercise ? 'lesson-item-active' : ''}`}
          onClick={onSelectComprehensiveExercise}
        >
          <div className="lesson-number">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="lesson-item-title">Bài tập tổng hợp</div>
          {showComprehensiveExercise && (
            <div className="lesson-active-indicator">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonSidebar;
