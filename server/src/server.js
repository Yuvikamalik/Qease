import 'dotenv/config'
import mongoose from 'mongoose'
import app from './app.js'
import { connectToDatabase } from './config/database.js'
import { getJwtSecret } from './middleware/auth.js'
import { validateEnvironment } from './config/environment.js'

async function startServer() {
  const port = validateEnvironment()
  getJwtSecret()
  await connectToDatabase()
  console.log('QEase backend connected to MongoDB')

  const server = app.listen(port, () => {
    console.log(`QEase backend listening on port ${port}`)
  })

  const shutdown = async (signal) => {
    console.log(`QEase backend received ${signal}; shutting down`)
    server.close(async () => {
      await mongoose.disconnect()
      process.exit(0)
    })
  }

  process.once('SIGINT', () => shutdown('SIGINT'))
  process.once('SIGTERM', () => shutdown('SIGTERM'))
}

startServer().catch((error) => {
  console.error(`QEase backend startup failed: ${error.message}`)
  process.exitCode = 1
})
