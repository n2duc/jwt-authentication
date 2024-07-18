import { StatusCodes } from 'http-status-codes'
import { removeFromCloudinary, uploadToCloudinary } from '~/services/cloudinary'
import User from '~/models/user.model'
import sendEmail from '~/utils/sendEmail'
import { JwtProvider } from '~/providers/JwtProvider'
import bcrypt from 'bcryptjs'

const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.jwtDecoded.id, 'avatar _id username email isAdmin').select('-password').exec()
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const uploadAvatar = async (req, res) => {
  try {
    const userId = req.jwtDecoded.id
    const user = await User.findById(userId)

    if (user.avatar && user.avatar.public_id) {
      await removeFromCloudinary(user.avatar.public_id)
    }

    const data = await uploadToCloudinary(req.file.path, 'avatars')
    const { url, public_id } = data
    const updatedUser = await User.findByIdAndUpdate(userId, { avatar: { url, public_id } }, { new: true })
    res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const updatedUserInfo = async (req, res) => {
  try {
    const newInfoProfile = req.body
    const userId = req.jwtDecoded.id

    let existingUser = await User.findOne({ username: newInfoProfile.username })
    if (existingUser) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Username is already taken!' })
      return
    }

    existingUser = await User.findOne({ email: newInfoProfile.email })
    if (existingUser) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Email is already taken!' })
      return
    }

    const updated = await User.findByIdAndUpdate(userId, newInfoProfile, { new: true })
    res.status(StatusCodes.OK).json(updated)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.query
    if (!email) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please provide an email address' })
      return
    }

    const user = await User.findOne({ email })
    if (!user) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Email does not exist' })
      return
    }

    const secretToken = process.env.JWT_SECRET_SIGNATURE + user.password
    const resetToken = await JwtProvider.generateToken(
      { id: user._id, email: user.email },
      secretToken,
      '5m'
    )

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${user._id}/${resetToken}`

    const data = {
      username: user.username,
      resetURL
    }

    try {
      await sendEmail({
        email: email,
        subject: 'Reset Password',
        template: 'reset-password.ejs',
        data
      })

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: `Sent email to ${email} successfully! Please check your email to reset password`
      })

    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json(error)
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const resetPassword = async (req, res) => {
  try {
    const { userId, token } = req.query
    const { password } = req.body

    if (!userId || !token) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid reset password link' })
      return
    }

    const user = await User.findById(userId)
    if (!user) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'User does not exist' })
      return
    }

    const decoded = await JwtProvider.decodeToken(token, { complete: true })
    const currentTime = Math.floor(Date.now() / 1000)

    if (decoded.exp && decoded.exp < currentTime) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Reset password link has expired' })
      return
    }

    const secretToken = process.env.JWT_SECRET_SIGNATURE + user.password
    const verified = await JwtProvider.verifyToken(token, secretToken)

    if (verified.id !== user._id.toString()) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid reset password link' })
      return
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    user.password = hashedPassword

    await user.save()

    res.status(StatusCodes.OK).json({ statusCode: StatusCodes.OK, message: 'Password has been reset successfully' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

export const userController = {
  getUserInfo,
  uploadAvatar,
  updatedUserInfo,
  forgotPassword,
  resetPassword
}