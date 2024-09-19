import express from 'express'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { taskController } from '~/controllers/task.controller'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized, taskController.getTasks)
  .post(authMiddleware.isAuthorized, taskController.addTask)

Router.route('/:id')
  .put(authMiddleware.isAuthorized, taskController.updateTask)

export const taskRoute = Router