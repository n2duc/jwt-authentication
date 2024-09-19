import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/authorizedAxios";
import config from "../../config";

export const getListUsers = createAsyncThunk(
  "admin/getListUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(config.endpoints.admin.getUsers);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);