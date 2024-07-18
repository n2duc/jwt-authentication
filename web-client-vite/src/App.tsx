import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from './pages/Login'
import HomePage from './pages/HomePage'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AuthenLayout from './layouts/AuthenLayout'
import AccessDenied from './pages/AccessDenied'
import AuthProvider from './contexts/AuthContext'

const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem('userInfo') as string)
  if (!user) return <Navigate to="/login" replace />
  
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}

const UnauthorizedRoute = () => {
  const user = JSON.parse(localStorage.getItem('userInfo') as string)
  if (user) return <Navigate to="/" replace />

  return <Outlet />
}

const ProtectedRouteAdmin = () => {
  const user = JSON.parse(localStorage.getItem('userInfo') as string)
  if (!user || !user.isAdmin) {
    return <AccessDenied />
  }
  
  return <Outlet />
}

const App = () => {
  return (
    <Routes>
      {/* <Route path='/' element={
        <Navigate to="/login" replace />
      } /> */}

      <Route element={<UnauthorizedRoute />}>
        <Route element={<AuthenLayout />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:userId/:token' element={<ResetPassword />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<HomePage />} />
        <Route element={<ProtectedRouteAdmin />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App