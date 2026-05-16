import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('[ERROR_SYS]: Las claves de acceso no coinciden')
      return
    }
    try {
      await register(form.username, form.password)
      navigate('/home')
    } catch (err) {
      setError(`[ERROR_SYS]: ${err.message}`)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>CREAR_CUENTA</h1>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ color: '#00ffcc', display: 'block', marginBottom: '5px' }}> ASIGNAR_USUARIO</label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              placeholder="NUEVO_ID..."
              required
            />
          </div>
          <div className="form-group">
            <label style={{ color: '#00ffcc', display: 'block', marginBottom: '5px' }}> ASIGNAR_KEY</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="NUEVA_CLAVE..."
              required
            />
          </div>
          <div className="form-group">
            <label style={{ color: '#00ffcc', display: 'block', marginBottom: '5px' }}> CONFIRMAR_KEY</label>
            <input
              type="password"
              value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              placeholder="REPETIR_CLAVE..."
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>REGISTRAR_NUEVO_NODO</button>
        </form>
        <p className="auth-link" style={{ fontSize: '0.9rem', color: '#666' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#ff00ff', textDecoration: 'none' }}>Inicia sesión_</Link>
        </p>
      </div>
    </div>
  )
}