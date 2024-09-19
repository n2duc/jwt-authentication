import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import toast from 'react-hot-toast'
import { handleLogoutAPI, refreshTokenAPI } from '../apis'

const isDevelopment = import.meta.env.MODE === "development"

const logOnDev = (message: string) => isDevelopment && console.log(message)

const createLogMessage = (method: string | undefined, url: string | undefined, status?: number) =>
  `[${method?.toUpperCase()}] ${url}${status ? ` - ${status}` : ''}`

const onResponse = (response: AxiosResponse): AxiosResponse => {
  logOnDev(createLogMessage(response.config.method, response.config.url, response.status))
  return response
}

const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  logOnDev(createLogMessage(config.method, config.url))
  if (config.method === 'get') {
    config.timeout = 1000 * 60 * 10
  }
  return config
}

let refreshTokenPromise: Promise<void> | null = null

const handleRefreshToken = async () => {
  if (!refreshTokenPromise) {
    refreshTokenPromise = refreshTokenAPI()
      .then((res) => {
        logOnDev(res.data.message)
        return
      })
      .catch((error: AxiosError) => {
        handleLogoutAPI().then(() => { location.href = '/login' })
        return Promise.reject(error)
      })
      .finally(() => { refreshTokenPromise = null })
  }
  return refreshTokenPromise
}

const onErrorResponse = async (error: AxiosError) => {
  if (axios.isAxiosError(error)) {
    logOnDev(createLogMessage(error.config?.method, error.config?.url, error.response?.status))

    if (error.response?.status === 401) {
      await handleLogoutAPI()
      location.href = '/login'
      return
    }

    if (error.response?.status === 410 && error.config) {
      await handleRefreshToken()
      return axiosInstance(error.config)
    }

    if (error.response?.status !== 410) {
      toast.error((error.response?.data as { message?: string })?.message || error.message)
    }
  } else {
    logOnDev(`🚨 [API] | Error ${(error as Error)?.message || 'Unknown error'}`)
  }

  return Promise.reject(error)
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: { 'Content-type': 'application/json' },
  withCredentials: true,
  timeout: 1000 * 60 * 10,
})

axiosInstance.interceptors.request.use(onRequest, onErrorResponse)
axiosInstance.interceptors.response.use(onResponse, onErrorResponse)

export default axiosInstance