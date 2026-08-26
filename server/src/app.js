import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { getAllowedOrigin } from './config/environment.js'
import { getDatabaseStatus } from './config/database.js'
import catalogRoutes from './routes/catalogRoutes.js'
import queueRoutes from './routes/queueRoutes.js'
import tokenRoutes from './routes/tokenRoutes.js'
import adminQueueRoutes from './routes/adminQueueRoutes.js'
import authRoutes from './routes/authRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'

const app = express()

app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    if (getAllowedOrigin(origin)) return callback(null, true)
    const error = new Error('Origin not allowed')
    error.status = 403
    return callback(error)
  },
}))
app.use(express.json({ limit: '10kb' }))
app.use('/api', catalogRoutes)
app.use('/api', authRoutes)
app.use('/api', notificationRoutes)
app.use('/api', analyticsRoutes)
app.use('/api', queueRoutes)
app.use('/api', tokenRoutes)
app.use('/api', adminQueueRoutes)

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    message: 'QEase backend is running',
    database: getDatabaseStatus(),
  })
})

app.use((_request, _response, next) => {
  const error = new Error('Route not found')
  error.status = 404
  next(error)
})

app.use((error, _request, response, _next) => {
  const status = error.status || 500
  response.status(status).json({
    status: 'error',
    message: status === 500 ? 'Internal server error' : error.message,
  })
})

export default app
