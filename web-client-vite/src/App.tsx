import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'

const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem('userInfo') as string)
  if (!user) return <Navigate to="/login" replace={true} />

  return <Outlet />
}

const UnauthorizedRoute = () => {
  const user = JSON.parse(localStorage.getItem('userInfo') as string)
  if (user) return <Navigate to="/dashboard" replace={true} />

  return <Outlet />
}

const App = () => {
  return (
    <Routes>
      <Route path='/' element={
        <Navigate to="/login" replace={true} />
      } />

      <Route element={<UnauthorizedRoute />}>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path='/dashboard' element={<Dashboard />} />
        {/* Sau này có nhiều route cần check auth thì để ở dưới ... */}
      </Route>
    </Routes>
  )
}

export default App