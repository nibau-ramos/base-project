import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './components/AdminLayout.jsx';
import { RequireAdmin, RequireAuth } from './components/guards.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Profile from './pages/admin/Profile.jsx';
import Settings from './pages/admin/Settings.jsx';
import Users from './pages/admin/Users.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public zone */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Back-office */}
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="users" element={<RequireAdmin><Users /></RequireAdmin>} />
        <Route path="settings" element={<Navigate to="email" replace />} />
        <Route path="settings/:section" element={<RequireAdmin><Settings /></RequireAdmin>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
