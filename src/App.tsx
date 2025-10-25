
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './components/ui/toast'
import { Toaster } from 'react-hot-toast'
import LoginPage from './components/auth/login'
import Layout from './components/layout/layout'
import Dashboard from './components/pages/dashboard'
import ChatPage from './components/pages/chat'
import Documents from './components/pages/documents'
import Profile from './components/pages/profile'
import History from './components/pages/history'

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/app" element={<Layout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="documents" element={<Documents />} />
            <Route path="profile" element={<Profile />} />
            <Route path="history" element={<History />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
