import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import Admin from './pages/Admin'

const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem('userInfo') as string)
  if (!user) return <Navigate to="/login" replace />
  
  return <Outlet />
}

const UnauthorizedRoute = () => {
  const user = JSON.parse(localStorage.getItem('userInfo') as string)
  if (user) return <Navigate to="/dashboard" replace />

  return <Outlet />
}

const App = () => {
  return (
    <Routes>
      <Route path='/' element={
        <Navigate to="/login" replace />
      } />

      <Route element={<UnauthorizedRoute />}>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/admin' element={<Admin />} />
        {/* Sau này có nhiều route cần check auth thì để ở dưới ... */}
      </Route>
    </Routes>
  )
}

export default App