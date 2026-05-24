import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import "./index.css";
import App from "./App";
import { firstLessonId } from "./data/curriculum";

inject();
injectSpeedInsights();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/lesson/:lessonId" element={<App />} />
        <Route path="*" element={<Navigate to={`/lesson/${firstLessonId}`} replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
