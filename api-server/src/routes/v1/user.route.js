import express from 'express'
import { userController } from '~/controllers/user.controller'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Get User Info
Router.route('/info')
  .get(authMiddleware.isAuthorized, userController.getUserInfo)

export const userRoute = Router
