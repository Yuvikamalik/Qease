import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    message: 'QEase backend is running',
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
