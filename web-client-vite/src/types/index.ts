import { Action, ThunkAction } from '@reduxjs/toolkit';
import { store } from '../store';

export interface CreateAccountData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface User {
  _id?: string;
  username?: string;
  email?: string;
  isAdmin?: boolean;
}

type Status = 'idle' | 'pending' | 'resolved' | 'rejected';

export interface AuthState {
  status: Status;
  isAuthenticated: boolean;
  error: string;
  user: User;
}

export interface ErrorState {
  message: string | null;
}

//==============================================================================
// Redux Utilities data types
//==============================================================================

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;