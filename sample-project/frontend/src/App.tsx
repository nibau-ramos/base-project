import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import { RequireAdmin, RequireAuth } from './components/guards'
import Dashboard from './pages/admin/Dashboard'
import Profile from './pages/admin/Profile'
import Settings from './pages/admin/Settings'
import UserForm from './pages/admin/UserForm'
import Users from './pages/admin/Users'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import ResetPassword from './pages/ResetPassword'
import { Spinner } from './ui/feedback'

// The style guide is loaded on demand so the back-office doesn't download it (syntax highlighter, demos).
const StyleGuideLayout = lazy(() => import('./styleguide/layouts/StyleGuideLayout'))
const ButtonsPage = lazy(() => import('./styleguide/pages/ButtonsPage'))
const CardsPage = lazy(() => import('./styleguide/pages/CardsPage'))
const LoginExample = lazy(() => import('./styleguide/pages/examples/LoginPage'))
const UserFormExample = lazy(() => import('./styleguide/pages/examples/UserFormPage'))
const UsersListExample = lazy(() => import('./styleguide/pages/examples/UsersListPage'))
const FeedbackPage = lazy(() => import('./styleguide/pages/FeedbackPage'))
const StyleGuideHome = lazy(() => import('./styleguide/pages/HomePage'))
const InputsPage = lazy(() => import('./styleguide/pages/InputsPage'))
const NavigationPage = lazy(() => import('./styleguide/pages/NavigationPage'))
const StyleGuideSettings = lazy(() => import('./styleguide/pages/SettingsPage'))
const TablesPage = lazy(() => import('./styleguide/pages/TablesPage'))
const TypographyPage = lazy(() => import('./styleguide/pages/TypographyPage'))

export default function App() {
  return (
    <Routes>
      {/* Public zone */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ENSO style guide, public for reference (copied from base-style-guide) */}
      <Route
        path="/styleguide"
        element={
          <Suspense fallback={<Spinner />}>
            <StyleGuideLayout />
          </Suspense>
        }
      >
        <Route index element={<StyleGuideHome />} />
        <Route path="typography" element={<TypographyPage />} />
        <Route path="buttons" element={<ButtonsPage />} />
        <Route path="inputs" element={<InputsPage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="cards" element={<CardsPage />} />
        <Route path="tables" element={<TablesPage />} />
        <Route path="navigation" element={<NavigationPage />} />
        <Route path="settings" element={<StyleGuideSettings />} />
        <Route path="examples">
          <Route path="login" element={<LoginExample />} />
          <Route path="users" element={<UsersListExample />} />
          <Route path="users/new" element={<UserFormExample />} />
          <Route path="users/:id" element={<UserFormExample />} />
        </Route>
      </Route>

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
        <Route path="users/new" element={<RequireAdmin><UserForm /></RequireAdmin>} />
        <Route path="users/:id" element={<RequireAdmin><UserForm /></RequireAdmin>} />
        <Route path="settings" element={<Navigate to="email" replace />} />
        <Route path="settings/:section" element={<RequireAdmin><Settings /></RequireAdmin>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
