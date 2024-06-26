import { StatusCodes } from 'http-status-codes'

const access = async (req, res) => {
  try {
    const user = req.jwtDecoded

    const userInfo = {
      id: user.id,
      email: user.email,
      username: user.username
    }

    res.status(StatusCodes.OK).json(userInfo)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

export const dashboardController = {
  access
}
