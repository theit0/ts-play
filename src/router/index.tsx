import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "../App";
import { firstLessonId, findLesson } from "../data/curriculum";

const savedLesson = localStorage.getItem("ts-play-last-lesson");
const initialLessonId = savedLesson && findLesson(savedLesson) ? savedLesson : firstLessonId;

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/lesson/:lessonId" element={<App />} />
        <Route path="*" element={<Navigate to={`/lesson/${initialLessonId}`} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
