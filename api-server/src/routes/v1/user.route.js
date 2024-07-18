import express from 'express'
import { userController } from '~/controllers/user.controller'
import { authMiddleware } from '~/middlewares/authMiddleware'
import upload from '~/middlewares/upload'

const Router = express.Router()

// Get User Info
Router.route('/info')
  .get(authMiddleware.isAuthorized, userController.getUserInfo)

// Upload Avatar
Router.route('/upload')
  .post(authMiddleware.isAuthorized, upload.single('image'), userController.uploadAvatar)

// Update User Info
Router.route('/update')
  .put(authMiddleware.isAuthorized, userController.updatedUserInfo)

// Forgot Password
Router.route('/forgot_password')
  .get(userController.forgotPassword)

// Reset Password
Router.route('/reset_password')
  .put(userController.resetPassword)

export const userRoute = Router