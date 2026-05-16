import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { sessions } from '../sessions.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const users = []

const defaultUser = {
  id: uuidv4(),
  username: 'admin',
  password: bcrypt.hashSync('admin123', 10)
}
users.push(defaultUser)

router.post('/register', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña requeridos' })
  }
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: 'El usuario ya existe' })
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = { id: uuidv4(), username }
  users.push({ ...user, password: hashedPassword })

  const sessionId = uuidv4()
  sessions.set(sessionId, user)

  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  })
  res.status(201).json({ user })
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const found = users.find(u => u.username === username)
  if (!found || !(await bcrypt.compare(password, found.password))) {
    return res.status(401).json({ message: 'Credenciales inválidas' })
  }

  const sessionId = uuidv4()
  const { password: _, ...user } = found
  sessions.set(sessionId, user)

  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  })
  res.json({ user })
})

router.post('/logout', (req, res) => {
  const sessionId = req.cookies?.sessionId
  if (sessionId) sessions.delete(sessionId)
  res.clearCookie('sessionId')
  res.json({ message: 'Sesión cerrada' })
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})

export default router
