import Redis from 'ioredis'

// const getRedisUrl = () => {
//   if (process.env.REDIS_URL) {
//     return process.env.REDIS_URL
//   }

//   throw new Error('REDIS_URL is not defined')
// }

export const redis = new Redis('rediss://default:AdsFAAIncDEwOTg1NzUxMzRhZTE0MTU2OTcxZjlkZDc4ZjMxZTJkNnAxNTYwNjk@lucky-wildcat-56069.upstash.io:6379')