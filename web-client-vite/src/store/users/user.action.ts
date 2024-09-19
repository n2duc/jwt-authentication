import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/authorizedAxios";
import { UpdateUserInfo } from "../../types";
import config from "../../config";
import { AsyncThunk } from '@reduxjs/toolkit';

export const uploadImage = createAsyncThunk<string, FormData>(
  "user/uploadImage",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(config.endpoints.users.upload, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.avatar.url;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUserInfo: AsyncThunk<any, UpdateUserInfo, {}> = createAsyncThunk(
  "user/updateUserInfo",
  async (data: UpdateUserInfo, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(config.endpoints.users.update, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(config.endpoints.users.forgotPassword, { params: { email } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ password, userId, token }: { password: string; userId: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(config.endpoints.users.resetPassword(userId, token), { password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);