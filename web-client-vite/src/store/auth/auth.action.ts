import { createAsyncThunk, AsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/authorizedAxios";
import { User } from "../../types";

interface RejectValue {
  errorMessage: string;
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