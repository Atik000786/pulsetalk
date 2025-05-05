import AxiosClient from '@/utils/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const sendMessageAsync = createAsyncThunk(
  "/message/send",
  async (data: object, toolkit) =>
    AxiosClient({
      toolkit,
      url: "/message/send",
      method: "post",
      data,
    })
);

export const getMessageAsync = createAsyncThunk(
  "/message/",
  async (data: { userId: string }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/message/${data.userId}`,
      method: "get",
      data,
    })
);



export const getChatListAsync = createAsyncThunk(
  "/message/chats/list",
  async (data: object, toolkit) =>
    AxiosClient({
      toolkit,
      url: "/message/chats/list",
      method: "get",
      data,
    })
);