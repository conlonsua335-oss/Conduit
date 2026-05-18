import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SettingsPage from "./pages/SettingsPage";
import EditorPage from "./pages/EditorPage";
import ArticlePage from "./pages/ArticlePage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/article/:slug" element={<ArticlePage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/profile/:username/favorites" element={<ProfilePage />} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/editor" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
        <Route path="/editor/:slug" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;