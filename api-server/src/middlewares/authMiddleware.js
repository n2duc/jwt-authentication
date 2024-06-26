import { StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'

// Middleware sẽ đảm nhận việc quan trọng là: Lấy và xác thực cái JWT accessToken nhận được từ client có hợp lệ hay không.
// Nếu hợp lệ thì sẽ gán thông tin user vào req.user và cho phép tiếp tục xử lý ở các middleware tiếp theo.

const isAuthorized = async (req, res, next) => {
  // Cách 1: Lấy accessToken từ request cookies phía client - withCredentials trong file authorizeAxios và credentials trong CORS
  const accessTokenCookie = req.cookies?.accessToken

  if (!accessTokenCookie) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
    return
  }
  // Cách 2: Lấy accessToken trong trường hợp phái client lưu ở localStorage và gửi lên thông qua header Authorization
  // const accessTokenHeader = req.headers.authorization.split(' ')[1] // req.headers.authorization = Bearer <accessToken> => [Bearer, <accessToken>] => Lấy phần tử thứ 2

  // if (!accessTokenHeader) {
  //   res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
  //   return
  // }

  try {
    // B1: Thực hiện giải mã token xem nó có hợp lệ không
    const accessTokenDecoded = await JwtProvider.verifyToken(
      accessTokenCookie, // Dùng theo cách 1
      // accessTokenHeader, // Dùng theo cách 2
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE
    )
    // console.log('Token Decoded: ', accessTokenDecoded)

    // B2: Nếu hợp lệ thì gán thông tin giải mã và cái req.jwtDecoded, để sử dụng cho các tầng cần xử lý ở phía sau
    // Giải mã xong thì accessTokenDecoded có giá trị chính là userInfo mà ta đã bỏ vào payload khi tạo token
    req.jwtDecoded = accessTokenDecoded

    // B3: Cho phép request đi tiếp
    next()
  } catch (error) {
    // TH lỗi 1: accessToken hết hạn, thì mình phải trả về cho client 1 response status 410 - GONE để gọi api refreshToken
    if (error.message?.includes('jwt expired')) {
      res.status(StatusCodes.GONE).json({ message: 'Token expired. Need to refresh token' })
      return
    }
    // TH lỗi 2: Nếu như cái accessToken không hợp lệ, thì mình trả về cho client 1 response status 401 - UNAUTHORIZED để bắt client phải logout
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
  }
}

export const authMiddleware = { isAuthorized }