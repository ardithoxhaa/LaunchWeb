import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './auth/AuthContext.jsx';
import { ProtectedRoute } from './auth/ProtectedRoute.jsx';
import { AdminRoute } from './auth/AdminRoute.jsx';

import { AppShell } from './components/layout/AppShell.jsx';

import { HomePage } from './pages/public/HomePage.jsx';
import { AboutPage } from './pages/public/AboutPage.jsx';
import { TemplatesPage } from './pages/public/TemplatesPage.jsx';
import { LoginPage } from './pages/public/LoginPage.jsx';
import { RegisterPage } from './pages/public/RegisterPage.jsx';
import { PreviewPage } from './pages/public/PreviewPage.jsx';

import { UserDashboard } from './pages/user/UserDashboard.jsx';
import { BuilderPage } from './pages/user/BuilderPage.jsx';
import { AssetsPage } from './pages/user/AssetsPage.jsx';
import { DraftPreviewPage } from './pages/user/DraftPreviewPage.jsx';
import { ProfilePage } from './pages/user/ProfilePage.jsx';
import { SettingsPage } from './pages/user/SettingsPage.jsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/preview/:slug" element={<PreviewPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/editor/:id"
            element={
              <ProtectedRoute>
                <BuilderPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/builder/:id"
            element={
              <ProtectedRoute>
                <BuilderPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/assets/:id"
            element={
              <ProtectedRoute>
                <AssetsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/draft-preview/:id"
            element={
              <ProtectedRoute>
                <DraftPreviewPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
