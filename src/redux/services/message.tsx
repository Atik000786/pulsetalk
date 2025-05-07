import AxiosClient from '@/utils/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const sendMessageAsync = createAsyncThunk(
  '/message/send',
  async (data: { receiverId: string; content: string; messageType: string }, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/message/send',
      method: 'post',
      data,
    })
);

export const getMessageAsync = createAsyncThunk(
  '/message/',
  async (data: { userId: string }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/message/${data.userId}`,
      method: 'get',
      data,
    })
);

export const markMessagesAsRead = createAsyncThunk(
  '/message/markAsRead',
  async (data: { senderId: string; receiverId: string }, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/message/markAsRead',
      method: 'put',
      data,
    })
);

export const getChatListAsync = createAsyncThunk(
  '/message/chats/list',
  async (data: object, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/message/chats/list',
      method: 'get',
      data,
    })
);