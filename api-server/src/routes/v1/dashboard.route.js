import express from 'express'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { dashboardController } from '~/controllers/dashboard.controller'

const Router = express.Router()

Router.route('/access')
  .get(authMiddleware.isAuthorized, dashboardController.access)

Router.route('/users')
  .get(authMiddleware.isAuthorized, authMiddleware.isAdmin, dashboardController.getListUsers)

export const dashboardRoute = Router