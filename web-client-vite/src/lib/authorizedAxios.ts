import axios from 'axios'
import type { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestHeaders, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios'
import toast from 'react-hot-toast'
import { handleLogoutAPI, refreshTokenAPI } from '../apis'

interface CustomAxiosError extends AxiosError {
  config: AxiosRequestConfig & { headers: AxiosRequestHeaders };
  response?: AxiosResponse;
}

const logOnDev = (message: string) => {
  if (import.meta.env.MODE === "development") {
    console.log(message);
  }
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  const { method, url } = response.config
  const { status } = response

  logOnDev(`[${method?.toUpperCase()}] ${url} - ${status}`)

  return response
}

const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const { method, url } = config

  // TH2: Trường hợp lưu accessToken vào localStorage và muốn thêm vào header của mỗi request
  // const accessToken = localStorage.getItem('accessToken')
  // if (accessToken) {
  //   // Bearer Token: Cần thêm Bearer trước accessToken để tuân theo chuẩn OAuth2 trong việc xác định loại token đang sử dụng
  //   // Bearer là định nghĩa loại token dành cho việc xác thực và ủy quyền. Các loại token cần khác như: Basic token, Digest token, ...
  //   config.headers.Authorization = `Bearer ${accessToken}`
  // }

  logOnDev(`[${method?.toUpperCase()}] ${url}`)

  if (method === 'get') {
    config.timeout = 1000 * 60 * 10
  }

  return config
}

let refreshTokenPromise: Promise<void> | null = null;

const onErrorResponse = async (error: CustomAxiosError) => {
  if (axios.isAxiosError(error)) {
    const { message } = error
    const { method, url } = error.config as AxiosRequestConfig

    logOnDev(`[${method?.toUpperCase()}] ${url} - ${message}`)

    // Xử lý refreshToken tự động khi accessToken hết hạn
    // API trả về lỗi 401 thì gọi API Logout
    if (error.response?.status === 401) {
      await handleLogoutAPI()
      location.href = '/login'
      return
    }

    // Nếu API trả về lỗi 410 thì gọi api refresh token để lại mới lại accessToken
    const originalRequest = error.config // Lấy các request API đang bị lỗi thông qua error.config
    if (error.response?.status === 410 && originalRequest) {

      if (!refreshTokenPromise) {
        // Gọi API refresh token để lấy lại accessToken mới
        refreshTokenPromise = refreshTokenAPI()
          .then((res) => {
            console.log(res.data.message)
            // Dùng cho TH Cookie: accessToken đã được update lại trong Cookie rồi (ở phía BE) nên không cần xử lý tác vụ gì cả
          })
          .catch((_error: AxiosError) => {
            // Nếu nhận lỗi từ API refreshToken thì logout luôn
            handleLogoutAPI().then(() => {
              location.href = '/login'
            })
            return Promise.reject(_error)
          })
          .finally(() => {
            // Dù API refreshToken có thành công hay lỗi thì vẫn luôn gán lại cái refreshTokenPromise về null như ban đầu
            refreshTokenPromise = null
          })
      }

      // Cuối cùng mới return refreshTokenPromise trong trường hợp success ở đây
      return refreshTokenPromise.then(() => {
        // return lại axios instance của chúng ta kết hợp cái originalConfig để gọi lại nhưng api ban đầu bị lỗi
        return axiosInstance(originalRequest)
      })
    }

    if (error.response?.status !== 410) {
      toast.error(`🚨 [API] | Error ${error.response?.data?.message || message}`);
    }
  } else {
    const errorMessage = (error as Error)?.message || 'Unknown error';
    logOnDev(`🚨 [API] | Error ${errorMessage}`);
  }

  return Promise.reject(error);
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    'Content-type': 'application/json',
  },
  // withCredentials: true - cho phép gửi cookie kèm theo request lên server (phục vụ trường hợp sủ dụng JWT theo cơ chế httpOnly Cookie)
  // TH1: Dùng cookie để lưu trữ accessToken và refreshToken
  withCredentials: true,
  // Thời gian chờ tối đa khi gửi request lên server
  timeout: 1000 * 60 * 10,
})

/**
 * Cấu hình Interceptors cho Axios Instance
 */
// Add a request interceptor: Can thiệp vào request trước khi nó được gửi đi
axiosInstance.interceptors.request.use(onRequest, onErrorResponse)
// Add a response interceptor: Can thiệp vào response trước khi nó được trả về cho phía Client
axiosInstance.interceptors.response.use(onResponse, onErrorResponse)

export default axiosInstance