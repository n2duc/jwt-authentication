import redisClient from '~/config/redis.config'

export const removeAllCaches = (typeCache) => {
  redisClient.keys(`${typeCache}:*`, (err, keys) => {
    if (err) return console.error(err)
    keys.forEach(key => {
      redisClient.del(key)
    })
  })
}

export const setCache = (key, data, exp = 3600) => {
  redisClient.setex(key, exp, JSON.stringify(data))
}

export const removeCache = (key) => {
  try {
    redisClient.del(key)
  } catch (err) {
    return null
  }
}

export const getCache = async (key) => {
  try {
    const cacheData = await redisClient.get(key)
    return cacheData
  } catch (error) {
    return null
  }
}