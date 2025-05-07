import { createSlice } from '@reduxjs/toolkit';
import {
  sendMessageAsync,
  getMessageAsync,
  getChatListAsync,
  markMessagesAsRead,
} from '../services/message';

interface Message {
  _id: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  receiver: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  content: string;
  isRead: boolean;
  readAt?: Date;
  messageType: 'text' | 'image' | 'video' | 'audio' | 'document';
  status: 'sent' | 'delivered' | 'read';
  createdAt: Date;
  updatedAt: Date;
  __v: number;
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
  messages: {
    success: boolean;
    status: number;
    message: string;
    data: Message[];
  } | null;
  chats: Chat[];
  error: ErrorResponse | null;
  isTyping: Record<string, boolean>;
  onlineUsers: string[];
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
  messages: null,
  chats: [],
  error: null,
  isTyping: {},
  onlineUsers: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setTyping: (state, action: { payload: { userId: string; isTyping: boolean } }) => {
      state.isTyping[action.payload.userId] = action.payload.isTyping;
    },
    setUserOnline: (state, action: { payload: { userId: string } }) => {
      if (!state.onlineUsers.includes(action.payload.userId)) {
        state.onlineUsers.push(action.payload.userId);
      }
    },
    setUserOffline: (state, action: { payload: { userId: string } }) => {
      state.onlineUsers = state.onlineUsers.filter((id) => id !== action.payload.userId);
    },
    updateMessageStatus: (
      state,
      action: { payload: { messageId: string; status: 'sent' | 'delivered' | 'read' } }
    ) => {
      if (state.messages?.data) {
        state.messages.data = state.messages.data.map((msg) =>
          msg._id === action.payload.messageId
            ? { ...msg, status: action.payload.status, isRead: action.payload.status === 'read' }
            : msg
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageAsync.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(sendMessageAsync.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (state.messages?.data) {
          state.messages.data.push(action.payload.data);
        } else {
          state.messages = {
            success: true,
            status: 200,
            message: 'Message sent',
            data: [action.payload.data],
          };
        }
      })
      .addCase(sendMessageAsync.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as ErrorResponse;
      })
      .addCase(getMessageAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMessageAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(getMessageAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as ErrorResponse;
      })
      .addCase(getChatListAsync.pending, (state) => {
        state.isLoadingChats = true;
        state.error = null;
      })
      .addCase(getChatListAsync.fulfilled, (state, action) => {
        state.isLoadingChats = false;
        state.chats = action.payload;
      })
      .addCase(getChatListAsync.rejected, (state, action) => {
        state.isLoadingChats = false;
        state.error = action.payload as ErrorResponse;
      })
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        if (state.messages?.data) {
          state.messages.data = state.messages.data.map((msg) =>
            msg.sender._id === action.meta.arg.senderId &&
            msg.receiver._id === action.meta.arg.receiverId &&
            !msg.isRead
              ? { ...msg, isRead: true, status: 'read' }
              : msg
          );
        }
        state.chats = state.chats.map((chat) =>
          chat.participants.includes(action.meta.arg.senderId) &&
          chat.participants.includes(action.meta.arg.receiverId)
            ? { ...chat, unreadCount: 0 }
            : chat
        );
      });
  },
});

export const { setTyping, setUserOnline, setUserOffline, updateMessageStatus } = messagesSlice.actions;
export default messagesSlice.reducer;