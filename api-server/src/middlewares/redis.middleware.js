import redisClient from '../config/redis.config'
import { StatusCodes } from 'http-status-codes'

const checkCache = (req, res, next) => {
  const { page, limit } = req.query
  const cacheKey = `articles:${page}:${limit}`

  redisClient.get(cacheKey, (err, data) => {
    if (err) throw err
    if (data !== null) {
      console.log('Cache hit')
      res.status(StatusCodes.OK).json(JSON.parse(data))
    } else {
      next()
    }
  })
}

export {
  checkCache
}