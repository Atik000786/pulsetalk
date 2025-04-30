import AxiosClient from '@/utils/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
}

export const signUpAsync = createAsyncThunk(
  'user/sign-up', 
  async (data: SignUpData, { rejectWithValue }) => {
    try {
      const response = await AxiosClient({
        url: '/user/sign-up',
        method: 'POST',
        data,
        toolkit: {
          fulfillWithValue: (value) => value,
          rejectWithValue: (value) => rejectWithValue(value)
        }
      });
      return response;
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        return rejectWithValue({
          message: error.response.data.message || 'Sign up failed',
          error: true,
          statusCode: error.response.status
        });
      } else if (error.request) {
        // The request was made but no response was received
        return rejectWithValue({
          message: 'No response from server',
          error: true
        });
      } else {
        // Something happened in setting up the request
        return rejectWithValue({
          message: error.message || 'Sign up failed',
          error: true
        });
      }
    }
  }
);


export const loginAsync = createAsyncThunk(
  "/user/login",
  async (data: object, toolkit) =>
    AxiosClient({
      toolkit,
      url: "/user/login",
      method: "post",
      data,
    })
);



