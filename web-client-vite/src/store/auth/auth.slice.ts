import { createSlice } from '@reduxjs/toolkit';
import type { AuthState } from '../../types';
import { loadCurrentUser, loginUser } from './auth.action';

export const initialState: AuthState = Object.freeze({
  isAuthenticated: false,
  error: '',
  status: 'idle',
  user: {},
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = '';
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = {};
      localStorage.removeItem("userInfo");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadCurrentUser.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(loadCurrentUser.fulfilled, (state, { payload }) => {
        state.isAuthenticated = true;
        state.status = 'resolved';
        state.user = payload;
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.status = 'rejected';
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.isAuthenticated = true;
        state.status = 'resolved';
        state.user = payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.status = 'rejected';
        state.error = action.payload?.errorMessage || 'Login failed';
      });
  }
})

export const { clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;