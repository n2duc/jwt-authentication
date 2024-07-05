import { createSlice } from '@reduxjs/toolkit';
import type { AuthState } from '../../types';
import { loadCurrentUser } from './auth.action';

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
  },

  extraReducers: (builder) => {
    builder.addCase(loadCurrentUser.pending, (state) => {
      state.status = 'pending';
    });

    builder.addCase(loadCurrentUser.fulfilled, (state, { payload }) => {
      state.isAuthenticated = true;
      state.status = 'resolved';
      state.user = payload;
    });

    builder.addCase(loadCurrentUser.rejected, (state) => {
      state.isAuthenticated = false;
      state.status = 'rejected';
    });
  }
})

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;