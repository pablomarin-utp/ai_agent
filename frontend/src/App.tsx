import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Chat } from './pages/Chat';
import { Profile } from './pages/Profile';
import { Usage } from './pages/Usage';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminLogs } from './pages/admin/AdminLogs';
import { AdminConfig } from './pages/admin/AdminConfig';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-dark-950">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/usage"
              element={
                <ProtectedRoute>
                  <Usage />
                </ProtectedRoute>
              }
            />
            
            {/* Admin Routes */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/logs"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/config"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminConfig />
                </ProtectedRoute>
              }
            />
            
            {/* Redirects */}
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
          </Routes>
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1F2937',
                color: '#F3F4F6',
                border: '1px solid #374151',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#F3F4F6',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#F3F4F6',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;