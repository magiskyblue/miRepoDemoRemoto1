import { sessions } from '../sessions.js'

export function requireAuth(req, res, next) {
  const sessionId = req.cookies?.sessionId
  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(401).json({ message: 'No autenticado' })
  }
  req.user = sessions.get(sessionId)
  next()
}
