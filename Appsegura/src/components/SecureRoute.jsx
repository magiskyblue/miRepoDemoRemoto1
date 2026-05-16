import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SecureRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="auth-page">
      <div className="loading-glitch"> ESTABLECIENDO CONEXIÓN SEGURA...</div>
    </div>
  )
  
  if (!user) return <Navigate to="/login" replace />

  return children
}