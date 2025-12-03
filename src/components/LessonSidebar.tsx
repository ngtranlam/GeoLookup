import React from 'react';
import { lessons, Lesson } from '../data/lessons';

interface LessonSidebarProps {
  selectedLessonId: number | null;
  onSelectLesson: (lessonId: number) => void;
}

const LessonSidebar: React.FC<LessonSidebarProps> = ({ selectedLessonId, onSelectLesson }) => {
  return (
    <div className="lesson-sidebar">
      <div className="lesson-sidebar-header">
        <h2>Danh sách bài học</h2>
        <p className="lesson-count">{lessons.length} bài học</p>
      </div>
      <div className="lesson-list">
        {lessons.map((lesson: Lesson) => (
          <div
            key={lesson.id}
            className={`lesson-item ${selectedLessonId === lesson.id ? 'lesson-item-active' : ''}`}
            onClick={() => onSelectLesson(lesson.id)}
          >
            <div className="lesson-number">Bài {lesson.id}</div>
            <div className="lesson-item-title">{lesson.title}</div>
            {selectedLessonId === lesson.id && (
              <div className="lesson-active-indicator">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonSidebar;
