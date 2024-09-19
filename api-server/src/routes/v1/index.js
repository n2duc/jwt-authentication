import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from '~/routes/v1/user.route'
import { dashboardRoute } from '~/routes/v1/dashboard.route'
import { authRoute } from '~/routes/v1/auth.route'
import { taskRoute } from './task.route'
import { geminiRoute } from './gemini.route'
import { articleRoute } from './article.route'

const Router = express.Router()

/** Check APIs v1/status */
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
})

Router.use('/auth', authRoute)

/** User APIs */
Router.use('/users', userRoute)

/** Dashboard APIs */
Router.use('/dashboards', dashboardRoute)

/** Task APIs */
Router.use('/tasks', taskRoute)

/** Gemini APIs */
Router.use('/ai', geminiRoute)

Router.use('/articles', articleRoute)

export const APIs_V1 = Router
