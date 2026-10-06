import 'dotenv/config'
import { mkdirSync } from 'node:fs'
import express from 'express'
import cors from 'cors'
import authRoutes from './src/routes/authRoutes.js'
import reportsRoutes from './src/routes/reportsRoutes.js'
import agentRoutes from './src/routes/agentRoutes.js'
import { errorHandler } from './src/utils/apiError.js'
import { bootstrapAgentDemo } from './src/services/agentBootstrap.js'

const app = express()

const clientOrigins = (process.env.CLIENT_ORIGINS || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173'))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
if (process.env.NODE_ENV === 'production' && clientOrigins.length === 0) {
  throw new Error('Définissez CLIENT_ORIGINS avec le domaine Vercel autorisé, sans slash final.')
}
app.use(cors({
  origin(origin, callback) {
    if (!origin || clientOrigins.includes(origin)) return callback(null, true)
    callback(new Error('Origine web non autorisée par CLIENT_ORIGINS.'))
  }
}))
app.use(express.json())
const uploadsDirectory = process.env.E2C_UPLOADS_DIR || 'uploads'
mkdirSync(uploadsDirectory, { recursive: true })
app.use('/uploads', express.static(uploadsDirectory))

app.use('/api/auth', authRoutes) // AE-1 — US-01, US-02, US-03
app.use('/api/reports', reportsRoutes) // AE-2 / AE-3 — US-04 à US-13
app.use('/api/agent', agentRoutes) // AE-4 — US-14 à US-16

// Route de santé principale pour UptimeRobot & Render
app.get('/', (req, res) => res.json({ status: 'ok', message: 'ALERT E2C API is running' }))
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use(errorHandler) // middleware d'erreur toujours en dernier

const PORT = process.env.PORT || 4000
bootstrapAgentDemo()
  .then((created) => {
    if (created) console.log('Compte agent de démonstration initialisé.')
    app.listen(PORT, () => console.log(`ALERT E2C API en écoute sur le port ${PORT}`))
  })
  .catch((error) => {
    console.error(`Démarrage interrompu : ${error.message}`)
    process.exitCode = 1
  })
