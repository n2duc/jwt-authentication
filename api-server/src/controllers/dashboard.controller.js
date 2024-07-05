import { StatusCodes } from 'http-status-codes'
import User from '~/models/user.model'

const access = async (req, res) => {
  try {
    const user = req.jwtDecoded
    // Bản thân thằng user đã được giải mã từ token ở middleware isAuthorized rồi nên không cần gán cho userInfo nữa cũng được
    const userInfo = {
      id: user.id,
      isAdmin: user.isAdmin
    }

    res.status(StatusCodes.OK).json(userInfo)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const getListUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -isAdmin')

    res.status(StatusCodes.OK).json(users)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

export const dashboardController = {
  access,
  getListUsers
}
