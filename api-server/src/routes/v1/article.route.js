import express from 'express'
import { articleController } from '~/controllers/article.controller'
import { checkCache } from '~/middlewares/redis.middleware'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .get(checkCache, articleController.getArticles)
  .post(authMiddleware.isAuthorized, articleController.createArticle)

Router.route('/:id')
  .patch(authMiddleware.isAuthorized, articleController.updateArticle)
  .delete(authMiddleware.isAuthorized, articleController.removeArticle)

export const articleRoute = Router