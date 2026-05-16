import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      await login(form.username, form.password)
      navigate('/home')
    } catch (err) {
      setError(`[ERROR_SYS]: ${err.message}`)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>INICIAR_SESIÓN</h1>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ color: '#00ffcc', display: 'block', marginBottom: '5px' }}> USUARIO_ID</label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              placeholder="INGRESAR CREDENCIAL..."
              required
            />
          </div>
          <div className="form-group">
            <label style={{ color: '#00ffcc', display: 'block', marginBottom: '5px' }}> ACCESO_KEY</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="CONTRASENA_SECRET..."
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>EJECUTAR_ACCESO</button>
        </form>
        <p className="auth-link" style={{ fontSize: '0.9rem', color: '#666' }}>
          ¿No tienes cuenta? <Link to="/register" style={{ color: '#ff00ff', textDecoration: 'none' }}>Registrarse_</Link>
        </p>
      </div>
    </div>
  )
}