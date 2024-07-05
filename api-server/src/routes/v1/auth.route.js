import express from 'express'
import { authController } from '~/controllers/auth.controller'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// API đăng ký
Router.route('/register')
  .post(authController.register)

// API đăng nhập.
Router.route('/login')
  .post(authController.login)

// API đăng xuất.
Router.route('/logout')
  .delete(authMiddleware.isAuthorized, authController.logout)

// API Refresh Token - Cấp lại Access Token mới.
Router.route('/refresh_token')
  .put(authController.refreshToken)

export const authRoute = Router
