import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'

const isAuthorized = async (req, res, next) => {
  const accessTokenCookie = req.cookies?.accessToken

  if (!accessTokenCookie) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
    return
  }

  try {
    const accessTokenDecoded = await JwtProvider.verifyToken(
      accessTokenCookie,
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE
    )

    if (!accessTokenDecoded) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Access token is not valid' })
      return
    }

    req.jwtDecoded = accessTokenDecoded

    next()
  } catch (error) {
    if (error.message?.includes('jwt expired')) {
      res.status(StatusCodes.GONE).json({ message: 'Token expired. Need to refresh token' })
      return
    }
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
  }
}

// Check ADMIN
const isAdmin = (req, res, next) => {
  const role = req.jwtDecoded?.isAdmin
  try {
    if (!role) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden - You are not allowed to access this route' })
    }
    next()
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
  }
}

const isUser = (req, res, next) => {
  const role = req.jwtDecoded?.isAdmin
  try {
    if (role) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden - You are not allowed to access this route' })
    }
    next()
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
  }
}

export const authMiddleware = {
  isAdmin,
  isUser,
  isAuthorized
}