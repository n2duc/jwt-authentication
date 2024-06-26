import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'
import ms from 'ms'
import User from '~/models/user.model'
import { JwtProvider } from '~/providers/JwtProvider'

const ACCESS_TOKEN_EXPIRED = '1m'
const REFRESH_TOKEN_EXPIRED = '14d'

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

    // if (req.body.email !== MOCK_DATABASE.USER.EMAIL || req.body.password !== MOCK_DATABASE.USER.PASSWORD) {
    //   res.status(StatusCodes.FORBIDDEN).json({ message: 'Your email or password is incorrect!' })
    //   return
    // }

    // Trường hợp nhập đúng thông tin tài khoản, tạo token và trả về cho phía Client
    // Tạo thông tin payload để đính kèm trong JWT Token bao gồm id và email của user
    // const userInfo = {
    //   id: MOCK_DATABASE.USER.ID,
    //   email: MOCK_DATABASE.USER.EMAIL
    // }
    const userInfo = {
      id: user._id,
      email: user.email,
      username: user.username
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

    /**
     * Xử lý trường hợp trả về httpOnly Cookie cho phía Client
     * maxAge: thời gian sống của Cookie tính theo mili giây để tối đa 14 ngày. Cái này là thời gian sống của Cookie
     */
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    // Trả về thông tin user và token cho phía Client
    res.status(StatusCodes.OK).json({
      ...userInfo,
      accessToken,
      refreshToken
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

    res.status(StatusCodes.OK).json({ message: 'Logout API success!' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const refreshToken = async (req, res) => {
  try {
    // Cách 1: Lấy refreshToken từ request cookies phía client
    const refreshTokenCookie = req.cookies?.refreshToken
    // Cách 2: Từ localStorage phía client sẽ truyền vào body khi gọi API
    // const refreshTokenBody = req.body?.refreshToken

    // Verify refreshToken
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      refreshTokenCookie,
      // refreshTokenBody,
      process.env.REFRESH_TOKEN_SECRET_SIGNATURE
    )

    // Tạo userInfo để lưu vào accessToken mới
    const userInfo = {
      id: refreshTokenDecoded.id,
      email: refreshTokenDecoded.email,
      username: refreshTokenDecoded.username
    }

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
      ACCESS_TOKEN_EXPIRED
    )

    // Res lại cookie accessToken mới cho trường hợp sử dụng Cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.OK).json({ accessToken })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Refresh token API failed!' })
  }
}

export const userController = {
  register,
  login,
  logout,
  refreshToken
}
