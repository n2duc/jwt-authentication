import express from 'express'
import { geminiController } from '~/controllers/gemini.controller'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/generate')
  .post(authMiddleware.isAuthorized, geminiController.generateContent)

Router.route('/history/:userId')
  .get(authMiddleware.isAuthorized, geminiController.getChatHistory)

export const geminiRoute = Router