import { createSlice } from "@reduxjs/toolkit";
import { loginAsync, signUpAsync } from "../services/user";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
}

interface UsersState {
  isSubmitting: boolean;
  isLoading: boolean;
  user: User | null;
  error: ErrorResponse | null;
}

interface ErrorResponse {
  message: string;
  error?: boolean;
  statusCode?: number;
}

const initialState: UsersState = {
  isSubmitting: false,
  isLoading: false,
  user: null,
  error: null
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // sign-up
    builder
      .addCase(signUpAsync.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.user = action.payload;
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as ErrorResponse;
      })
      // login 
      .addCase(loginAsync.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.user = action.payload;
      })
      .addCase(loginAsync.rejected, (state, action) => {  // Fixed: Changed from signUpAsync.rejected to loginAsync.rejected
        state.isSubmitting = false;
        state.error = action.payload as ErrorResponse;
      });
  }
});

export default usersSlice.reducer;