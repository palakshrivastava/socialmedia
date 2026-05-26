import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, isBootstrapping } = useAuth()

  if (isBootstrapping) {
    return (
      <div className="app-loading">
        <div className="spinner" aria-hidden />
        <p>Loading your session…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
