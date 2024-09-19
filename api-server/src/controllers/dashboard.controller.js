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
    const { page = 1, limit = 10, username = '' } = req.query
    const skip = (page - 1) * limit
    const query = username ? { username: { $regex: username, $options: 'i' } } : {}
    const users = await User.find(query).select('-password').limit(limit * 1).skip(skip).exec()

    const totalUsers = await User.countDocuments(query)
    const totalPages = Math.ceil(totalUsers / limit)

    const response = { users, totalPages, currentPage: page }

    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

export const dashboardController = {
  access,
  getListUsers
}
