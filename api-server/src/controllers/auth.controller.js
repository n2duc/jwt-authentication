import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'
import ms from 'ms'
import User from '~/models/user.model'
import { JwtProvider } from '~/providers/JwtProvider'
// import { redis } from '~/config/redis.config'

const ACCESS_TOKEN_EXPIRED = '1m'
const REFRESH_TOKEN_EXPIRED = '7d'

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    let existingUser = await User.findOne({ username })
    if (existingUser) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Username is already taken!' })
      return
    }

    existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Email is already taken!' })
      return
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    })

    await newUser.save()

    res.status(StatusCodes.CREATED).json({ message: 'Register success!' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || '')

    if (!user || !isPasswordCorrect) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Your username or password is incorrect!' })
      return
    }

    const userInfo = {
      id: user._id,
      isAdmin: user.isAdmin
    }

    // Tạo ra 2 loại token, accessToken và refreshToken để trả về cho phía FE
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
      ACCESS_TOKEN_EXPIRED
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      process.env.REFRESH_TOKEN_SECRET_SIGNATURE,
      REFRESH_TOKEN_EXPIRED
    )

    // Lưu refreshToken vào Redis
    // await redis.set(userInfo.id, refreshToken, 'EX', 604800)

    /**
     * Xử lý trường hợp trả về httpOnly Cookie cho phía Client
     * maxAge: thời gian sống của Cookie tính theo mili giây để tối đa 14 ngày. Cái này là thời gian sống của Cookie
     */
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('5 minutes')
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('7 days')
    })

    // Trả về thông tin user và token cho phía Client
    res.status(StatusCodes.OK).json({
      ...userInfo,
      refreshToken,
      accessToken
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const logout = async (req, res) => {
  try {
    // Xóa Cookie
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    // Xóa trên redis
    // await redis.del(req.jwtDecoded?.id)

    res.status(StatusCodes.OK).json({ message: 'Logged out successfully!' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const refreshToken = async (req, res) => {
  try {
    // Lấy refreshToken từ Redis
    // const refreshTokenRedis = await redis.get(req.jwtDecoded.id) // Chưa lấy được id để get refreshToken
    // if (!refreshTokenRedis) {
    //   return res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid refresh token' })
    // }

    const refreshTokenCookie = req.cookies?.refreshToken

    // Verify refreshToken
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      refreshTokenCookie,
      process.env.REFRESH_TOKEN_SECRET_SIGNATURE
    )

    // Tạo userInfo để lưu vào accessToken mới
    const userInfo = {
      id: refreshTokenDecoded.id,
      isAdmin: refreshTokenDecoded.isAdmin
    }

    const newAccessToken = await JwtProvider.generateToken(
      userInfo,
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
      ACCESS_TOKEN_EXPIRED
    )

    // Res lại cookie accessToken mới cho trường hợp sử dụng Cookie
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('5 minutes')
    })

    res.status(StatusCodes.OK).json({ message: 'Token refreshed' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Refresh token API failed!' })
  }
}

export const authController = {
  register,
  login,
  logout,
  refreshToken
}