/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import helmet from 'helmet'
import { corsOptions } from '~/config/cors.config'
import connectToMongoDB from '~/config/db.config'
import { APIs_V1 } from '~/routes/v1/'

dotenv.config()

const START_SERVER = () => {
  // Init Express App
  const app = express()

  // Fix Cache from disk from ExpressJS
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  app.use(helmet())

  // Use Cookie
  // TH1: Dùng cookie để lưu trữ accessToken và refreshToken
  app.use(cookieParser())

  app.use(cors(corsOptions))

  // Enable req.body json data
  app.use(express.json())

  // Use Route APIs V1
  app.use('/v1', APIs_V1)

  const PORT = process.env.PORT || 5000
  const LOCAL_DEV_APP_HOST = 'localhost'
  app.listen(PORT, LOCAL_DEV_APP_HOST, async () => {
    await connectToMongoDB()
    console.log('Back-end Server is running')
    console.log(`Host: ${LOCAL_DEV_APP_HOST}:${PORT}`)
  })
}

(async () => {
  try {
    // Start Back-end Server
    console.log('Starting Server...')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
