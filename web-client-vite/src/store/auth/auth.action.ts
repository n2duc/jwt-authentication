import { createAsyncThunk, AsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/authorizedAxios";
import { User } from "../../types";

interface RejectValue {
  errorMessage: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export const loadCurrentUser: AsyncThunk<
  User,
  void,
  { rejectValue: RejectValue }
> = createAsyncThunk<User, void, { rejectValue: RejectValue }>(
  "auth/loadCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get<{ data: User }>("/users/info");
      return data as User
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ errorMessage: error.message });
      }
      return rejectWithValue({ errorMessage: 'An unknown error occurred' });
    }
  }
);

export const loginUser: AsyncThunk<
  User,
  LoginCredentials,
  { rejectValue: RejectValue }
> = createAsyncThunk<User, LoginCredentials, { rejectValue: RejectValue }>(
  "auth/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post<{ data: User }>("/auth/login", { username, password });
      const userInfo = { id: data.data._id, isAdmin: data.data.isAdmin };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      return data as User;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ errorMessage: error.message });
      }
      return rejectWithValue({ errorMessage: 'Login failed' });
    }
  }
);