import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => {
        if (res.ok) return res.json()
        throw new Error('No autenticado')
      })
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (username, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Error en autenticación')
    }
    const data = await res.json()
    setUser(data.user)
    return data
  }

  const register = async (username, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Error en registro')
    }
    const data = await res.json()
    setUser(data.user)
    return data
  }

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)