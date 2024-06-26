/**
 * Nếu muốn cấu hình CORS Option chuyên sâu hơn trong dự án thực tế thì xem Video số 62 trong chuỗi MERN Stack Pro của mình. Link: (https://youtu.be/iYgAWJ2Djkw)
 */
export const corsOptions = {
  origin: function (origin, callback) {
    return callback(null, true)
  },

  // Some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200,

  // CORS sẽ cho phép nhận cookies từ request
  // TH1: Dùng cookie để lưu trữ accessToken và refreshToken
  credentials: true
}
