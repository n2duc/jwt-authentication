import axios from "axios"
import config from "../config"
import axiosInstance from "../lib/authorizedAxios"
import { UpdateUserInfo } from "../types"
import type { ChatMessage } from "../types"

const BASE_ENDPOINT = import.meta.env.VITE_API_URL

export const getMeAPI = async () => {
  const res = await axiosInstance.get(config.endpoints.users.me)
  return res.data
}

export const handleLoginAPI = async (username: string, password: string) => {
  const res = await axiosInstance.post(config.endpoints.auth.login, { username, password })
  return res.data
}

export const handleLogoutAPI = async () => {
    localStorage.removeItem("userInfo")
    return await axiosInstance.delete(config.endpoints.auth.logout)
}

export const refreshTokenAPI = async () => {
  return await axiosInstance.put(config.endpoints.auth.refreshToken)
}

export const uploadImage = async (formData: FormData) => {
  const response = await axiosInstance.post(config.endpoints.users.upload, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data.avatar.url;
}


export const updateUserInfo = async (data: UpdateUserInfo) => {
  const response = await axiosInstance.put(config.endpoints.users.update, data);

  return response.data;
}

export const forgotPassword = async (email: string) => {
  const response = await axiosInstance.get(config.endpoints.users.forgotPassword, { params: { email } })
  return response.data
}

export const resetPassword = async (password: string, userId: string, token: string) => {
  const response = await axios.put(`${BASE_ENDPOINT}${config.endpoints.users.resetPassword(userId, token)}`, { password })
  return response
}

export const getListUsers = async () => {
  const response = await axiosInstance.get(config.endpoints.admin.getUsers)
  return response.data
}

export const generateChat = async (prompt: string, history: ChatMessage[]) => {
  const response = await axiosInstance.post(config.endpoints.users.chat, { prompt, history })
  return response.data
}