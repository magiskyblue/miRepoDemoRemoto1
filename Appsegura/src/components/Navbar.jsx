import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="cyber-sidebar">
      <div className="sidebar-header">
        <Link to="/home" className="brand-logo">SYS_PKMN</Link>
      </div>
      
      {user ? (
        <div className="sidebar-menu">
          <span className="user-id">USER_ID: {user.username}</span>
          <nav className="nav-links">
            <Link to="/home" className="nav-btn"> DASHBOARD</Link>
            <Link to="/filtrar" className="nav-btn"> FILTRADO_AVANZADO</Link>
          </nav>
          <button onClick={handleLogout} className="btn-logout">[ DESCONECTAR ]</button>
        </div>
      ) : (
        <div className="sidebar-menu">
          <nav className="nav-links">
            <Link to="/login" className="nav-btn"> ACCESO_SISTEMA</Link>
          </nav>
        </div>
      )}
    </aside>
  )
}