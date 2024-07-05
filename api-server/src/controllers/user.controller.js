import { StatusCodes } from 'http-status-codes'
import User from '~/models/user.model'

const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.jwtDecoded.id).select('-password')
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

export const userController = {
  getUserInfo
}
