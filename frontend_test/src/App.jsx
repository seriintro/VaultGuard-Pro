import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import ProtectedRoute from './ProtectedRoute'
import Login from './pages/Login'
import Home from './pages/Home'
import RbacAdmin from './pages/RbacAdmin'
import AccessLogs from './pages/AccessLogs'
import UserManagement from './pages/UserManagement'
import Surveillance from './pages/Surveillance'
import SurveillanceLogs from './pages/SurveillanceLogs'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/rbac" element={
          <ProtectedRoute>
            <RbacAdmin />
          </ProtectedRoute>
        } />
        <Route path="/logs" element={
          <ProtectedRoute>
            <AccessLogs />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        } />
        <Route path="/surveillance" element={
          <ProtectedRoute>
            <Surveillance />
          </ProtectedRoute>
        } />
        <Route path="/surveillance-logs" element={
          <ProtectedRoute>
            <SurveillanceLogs />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default App