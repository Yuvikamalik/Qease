import express from 'express'
import cors from 'cors'
import { getDatabaseStatus } from './config/database.js'
import catalogRoutes from './routes/catalogRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', catalogRoutes)

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
