/* eslint-disable no-console */
// Author: TrungQuanDev: https://youtube.com/@trungquandev

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { corsOptions } from '~/config/corsOptions'
import { APIs_V1 } from '~/routes/v1/'
import connectToMongoDB from './config/db.config'

dotenv.config()

const START_SERVER = () => {
  // Init Express App
  const app = express()

  // Fix Cache from disk from ExpressJS
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  // Use Cookie
  // TH1: Dùng cookie để lưu trữ accessToken và refreshToken
  app.use(cookieParser())

  // Allow CORS: for more info, check here: https://youtu.be/iYgAWJ2Djkw
  app.use(cors(corsOptions))

  // Enable req.body json data
  app.use(express.json())

  // Use Route APIs V1
  app.use('/v1', APIs_V1)

  const PORT = process.env.PORT || 5000
  const LOCAL_DEV_APP_HOST = 'localhost'
  const AUTHOR = 'N2Dev'
  app.listen(PORT, LOCAL_DEV_APP_HOST, async () => {
    await connectToMongoDB()
    console.log(`Local DEV: Hello ${AUTHOR}, Back-end Server is running successfully at Host: ${LOCAL_DEV_APP_HOST} and Port: ${PORT}`)
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
