import { createSlice } from "@reduxjs/toolkit";
import {
  sendMessageAsync,
  getMessageAsync,
  getChatListAsync
} from "../services/message";

interface Message {
  _id: string;
  sender: string; // or User if you want to populate
  receiver: string; // or User if you want to populate
  content: string;
  isRead: boolean;
  readAt?: Date;
  messageType: 'text' | 'image' | 'video' | 'audio' | 'document';
  status: 'sent' | 'delivered' | 'read';
  createdAt: Date;
  updatedAt: Date;
}

interface Chat {
  _id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
  updatedAt: Date;
}

interface MessagesState {
  isSubmitting: boolean;
  isLoading: boolean;
  isLoadingChats: boolean;
  messages: Message[];
  chats: Chat[];
  error: ErrorResponse | null;
}

interface ErrorResponse {
  message: string;
  error?: boolean;
  statusCode?: number;
}

const initialState: MessagesState = {
  isSubmitting: false,
  isLoading: false,
  isLoadingChats: false,
  messages: [],
  chats: [],
  error: null
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // send message
    builder
      .addCase(sendMessageAsync.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(sendMessageAsync.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessageAsync.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as ErrorResponse;
      })
      
      // get messages
      .addCase(getMessageAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMessageAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload; // assuming payload is an array of messages
      })
      .addCase(getMessageAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as ErrorResponse;
      })
      
      // get chat list
      .addCase(getChatListAsync.pending, (state) => {
        state.isLoadingChats = true;
        state.error = null;
      })
      .addCase(getChatListAsync.fulfilled, (state, action) => {
        state.isLoadingChats = false;
        state.chats = action.payload; // assuming payload is an array of chats
      })
      .addCase(getChatListAsync.rejected, (state, action) => {
        state.isLoadingChats = false;
        state.error = action.payload as ErrorResponse;
      });
  }
});

export default messagesSlice.reducer;