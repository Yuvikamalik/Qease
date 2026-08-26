import 'dotenv/config'
import app from './app.js'
import { connectToDatabase } from './config/database.js'

const port = Number(process.env.PORT) || 5000

async function startServer() {
  await connectToDatabase()
  console.log('QEase backend connected to MongoDB')

  app.listen(port, () => {
    console.log(`QEase backend listening on port ${port}`)
  })
}

startServer().catch((error) => {
  console.error(`QEase backend startup failed: ${error.message}`)
  process.exitCode = 1
})
