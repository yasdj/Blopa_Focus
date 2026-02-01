import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './login/LoginPage.tsx';
import RegisterPage from './register/RegisterPage.tsx';
import HomeAfterEggPage from './dashboard/HomeAfterEggPage';
import NewMicroGoalPage from './tasks/NewMicroGoalPage';
import VerifyTaskPage from './verifyTask/VerifyTaskPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard" element={<HomeAfterEggPage />} />
        <Route path="/tasks/new" element={<NewMicroGoalPage />} />
        <Route path="/verify" element={<VerifyTaskPage />} />

        {/* Optional: catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
