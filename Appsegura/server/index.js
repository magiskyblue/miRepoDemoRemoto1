import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.js'

const app = express()
const PORT = 3001

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
