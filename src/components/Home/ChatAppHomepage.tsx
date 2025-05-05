'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import QuickChatImage from '../../../public/images/QuickChat.png';
import QuickChatIcon from '../../../public/images/QuickChaticon.png';
import Image from 'next/image';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Container,
  CssBaseline,
  Stack,
  Typography,
  Divider,
  Paper,
  styled,
  useTheme,
  IconButton,
  InputBase,
  TextField,
  Button,
  Toolbar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Drawer,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  Menu,
  Search,
  LightMode,
  DarkMode,
  MoreVert,
  People,
  Notifications,
  Logout,
  Send,
  AttachFile,
  EmojiEmotions,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { getAllUserAsync } from '@/redux/services/user';
import { sendMessageAsync, getMessageAsync } from '@/redux/services/message';
import { LoadingButton } from '@mui/lab';
import toast from 'react-hot-toast';
import React from 'react';

// TypeScript types
type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type ApiUserResponse = {
  success: boolean;
  status: number;
  message: string;
  data: {
    users: User[];
    hasMore: boolean;
    lastId?: string;
  };
};

type Chat = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
};

type Message = {
  id: string;
  text: string;
  sender: string; // 'me' or 'other'
  time: string;
  status: 'sent' | 'delivered' | 'read';
  isRead?: boolean;
  senderDetails?: {
    firstName: string;
    lastName: string;
  };
};

type ApiMessage = {
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
  messageType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type ApiMessagesResponse = {
  success: boolean;
  status: number;
  message: string;
  data: ApiMessage[];
};

type MessageState = {
  messages: ApiMessagesResponse | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
};

type ThemeMode = 'light' | 'dark';

const getDesignTokens = (mode: ThemeMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#9c27b0',
          },
          background: {
            default: '#fafafa',
            paper: '#ffffff',
          },
          text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
          },
        }
      : {
          primary: {
            main: '#90caf9',
          },
          secondary: {
            main: '#ce93d8',
          },
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
          },
        }),
  },
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const MessageInputContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#f5f5f5',
  marginTop: theme.spacing(2),
}));

const Message = ({ message }: { message: Message }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: '70%',
          p: 1.5,
          borderRadius: 4,
          backgroundColor:
            message.sender === 'me'
              ? theme.palette.primary.main
              : theme.palette.mode === 'dark'
              ? '#333'
              : '#e5e5ea',
          color: message.sender === 'me' ? '#fff' : theme.palette.text.primary,
        }}
      >
        {message.sender === 'other' && (
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {message.senderDetails?.firstName} {message.senderDetails?.lastName}
          </Typography>
        )}
        <Typography variant="body1">{message.text}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Typography
            variant="caption"
            sx={{
              mr: 1,
              color: message.sender === 'me' ? 'rgba(255,255,255,0.7)' : 'text.secondary',
            }}
          >
            {message.time}
          </Typography>
          {message.sender === 'me' && message.status && (
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {message.status === 'sent' ? '✓' : message.status === 'delivered' ? '✓✓' : '✓✓✓'}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const SidebarContent = React.memo(
  ({
    chats,
    selectedChat,
    setSelectedChat,
  }: {
    chats: Chat[];
    selectedChat: string | null;
    setSelectedChat: (id: string) => void;
  }) => {
    const theme = useTheme();

    return (
      <Box sx={{ overflow: 'auto' }}>
        <Paper
          elevation={0}
          sx={{
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#f5f5f5',
            margin: theme.spacing(2),
            width: '100%',
          }}
        >
          <IconButton sx={{ p: '10px' }} aria-label="search">
            <Search />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search chats..."
            inputProps={{ 'aria-label': 'search chats' }}
          />
        </Paper>

        <List>
          {chats.map((chat) => (
            <ListItem
              key={chat.id}
              disablePadding
              onClick={() => setSelectedChat(chat.id)}
              sx={{
                backgroundColor:
                  selectedChat === chat.id
                    ? theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.04)'
                    : 'transparent',
                '&:hover': {
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar alt={chat.name} src={chat.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={chat.name}
                  secondary={chat.lastMessage}
                  primaryTypographyProps={{
                    fontWeight: selectedChat === chat.id ? 'bold' : 'normal',
                    color: selectedChat === chat.id ? 'primary.main' : 'text.primary',
                  }}
                  secondaryTypographyProps={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Typography variant="caption" color="text.secondary">
                    {chat.time}
                  </Typography>
                  {chat.unread > 0 && (
                    <Box
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mt: 0.5,
                        fontSize: '0.75rem',
                      }}
                    >
                      {chat.unread}
                    </Box>
                  )}
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />

        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar>
                  <People />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="New Group" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    );
  }
);

SidebarContent.displayName = 'SidebarContent';

export default function ChatAppHomepage() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('themeMode');
      return savedTheme === 'dark' ? 'dark' : 'light';
    }
    return 'light';
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentUserId] = useState<string>('6812361cc0bd4b78bbfbd24d');

  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.users);
  const usersData = useSelector((state: RootState) => state.users.user) as ApiUserResponse | null;
  const messageState = useSelector((state: RootState) => state.message) as unknown as MessageState;

  // Create theme based on themeMode
  const theme = useMemo(() => {
    const validMode: ThemeMode = themeMode === 'dark' ? 'dark' : 'light';
    return createTheme(getDesignTokens(validMode));
  }, [themeMode]);

  // Fetch users
  useEffect(() => {
    dispatch(getAllUserAsync({}));
  }, [dispatch]);

  // Transform users to chats
  useEffect(() => {
    if (usersData?.success && usersData.data?.users) {
      const transformedChats = usersData.data.users.map((user) => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        lastMessage: '',
        time: '',
        unread: 0,
        avatar: `https://i.pravatar.cc/150?u=${user.email}`,
      }));
      setChats(transformedChats);
    }
  }, [usersData]);

  // Fetch messages for selected chat
  useEffect(() => {
    if (selectedChat) {
      dispatch(getMessageAsync({ userId: selectedChat }));
    }
  }, [selectedChat, dispatch]);

  // Transform and update messages
  useEffect(() => {
    if (selectedChat && messageState.messages?.data) {
      const apiMessages = messageState.messages.data;
      const transformedMessages = apiMessages.map((msg: ApiMessage) => {
        const isSenderMe = msg.sender._id === currentUserId;
        return {
          id: msg._id,
          text: msg.content,
          sender: isSenderMe ? 'me' : 'other',
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: msg.status as 'sent' | 'delivered' | 'read',
          isRead: msg.isRead,
          senderDetails: !isSenderMe
            ? {
                firstName: msg.sender.firstName,
                lastName: msg.sender.lastName,
              }
            : undefined,
        };
      });

      setMessages((prev) => ({
        ...prev,
        [selectedChat]: transformedMessages,
      }));

      // Update last message in chats only if there are messages
      if (apiMessages.length > 0) {
        const lastMessage = apiMessages[apiMessages.length - 1];
        setChats((prevChats) => {
          const chatIndex = prevChats.findIndex((c) => c.id === selectedChat);
          if (chatIndex === -1) return prevChats;
          const updatedChats = [...prevChats];
          updatedChats[chatIndex] = {
            ...updatedChats[chatIndex],
            lastMessage: lastMessage.content.substring(0, 30) + (lastMessage.content.length > 30 ? '...' : ''),
            time: new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: lastMessage.sender._id !== currentUserId && !lastMessage.isRead ? 1 : 0,
          };
          return updatedChats;
        });
      }
    }
  }, [messageState.messages, selectedChat, currentUserId]);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const toggleThemeMode = useCallback(() => {
    setThemeMode((prevMode) => {
      const newMode: ThemeMode = prevMode === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('themeMode', newMode);
      }
      return newMode;
    });
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (message.trim() === '' || !selectedChat) return;

    const newMessage: Message = {
      id: `temp-${Date.now()}`,
      text: message,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setMessages((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage],
    }));

    setChats((prevChats) => {
      const chatIndex = prevChats.findIndex((c) => c.id === selectedChat);
      if (chatIndex === -1) return prevChats;
      const updatedChats = [...prevChats];
      updatedChats[chatIndex] = {
        ...updatedChats[chatIndex],
        lastMessage: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
        time: 'Just now',
      };
      return updatedChats;
    });

    setMessage('');

    try {
      const response = await dispatch(
        sendMessageAsync({
          receiverId: selectedChat,
          content: message,
          messageType: 'text',
        })
      ).unwrap();

      if (response.success) {
        setMessages((prev) => {
          const updatedMessages = { ...prev };
          if (updatedMessages[selectedChat]) {
            const messageIndex = updatedMessages[selectedChat].findIndex(
              (m) => m.id === newMessage.id
            );
            if (messageIndex !== -1) {
              updatedMessages[selectedChat][messageIndex] = {
                ...updatedMessages[selectedChat][messageIndex],
                id: response.data._id,
                status: 'delivered',
              };
            }
          }
          return updatedMessages;
        });
      }
    } catch (error) {
      toast.error('Failed to send message');
      setMessages((prev) => {
        const updatedMessages = { ...prev };
        if (updatedMessages[selectedChat]) {
          updatedMessages[selectedChat] = updatedMessages[selectedChat].filter(
            (m) => m.id !== newMessage.id
          );
        }
        return updatedMessages;
      });
    }
  }, [message, selectedChat, dispatch]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const drawerWidth = 340;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <Menu />
            </IconButton>
            {selectedChat && (
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <Avatar 
                  src={chats.find((c) => c.id === selectedChat)?.avatar} 
                  sx={{ mr: 2 }}
                />
                <Typography variant="h6" noWrap component="div">
                  {chats.find((c) => c.id === selectedChat)?.name}
                </Typography>
              </Box>
            )}
            {!selectedChat && (
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                Select a chat
              </Typography>
            )}
            <IconButton color="inherit">
              <StyledBadge badgeContent={4} color="secondary">
                <Notifications />
              </StyledBadge>
            </IconButton>
            <IconButton color="inherit" onClick={toggleThemeMode}>
              {themeMode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
            <IconButton color="inherit">
              <Logout />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: theme.spacing(0, 1),
                ...theme.mixins.toolbar,
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ ml: 2, height: '40px', width: '150px', position: 'relative' }}>
                <Image
                  src={QuickChatImage}
                  alt="QuickChat"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </Box>
              <IconButton onClick={handleDrawerToggle}>
                <Menu />
              </IconButton>
            </Box>
            <Divider />
            <SidebarContent
              chats={chats}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
            />
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: theme.spacing(0, 1),
                ...theme.mixins.toolbar,
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ ml: 2, height: '40px', width: '120px', position: 'relative' }}>
                <Image
                  src={QuickChatImage}
                  alt="QuickChat"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </Box>
              <IconButton>
                <MoreVert />
              </IconButton>
            </Box>
            <Divider />
            <SidebarContent
              chats={chats}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
            />
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            height: '100vh',
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Toolbar />
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'calc(100vh - 64px)',
              }}
            >
              <Typography variant="h6">Loading users...</Typography>
            </Box>
          ) : error ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'calc(100vh - 64px)',
              }}
            >
              <Typography variant="h6" color="error">
                Error loading users: {error.message}
              </Typography>
            </Box>
          ) : selectedChat ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 64px)',
              }}
            >
              {/* Messages area */}
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: 'auto',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {messageState.isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body1">Loading messages...</Typography>
                  </Box>
                ) : (
                  (messages[selectedChat] || []).map((msg) => (
                    <Message key={msg.id} message={msg} />
                  ))
                )}
              </Box>

              {/* Message input area */}
              <MessageInputContainer elevation={1}>
                <IconButton>
                  <AttachFile />
                </IconButton>
                <IconButton>
                  <EmojiEmotions />
                </IconButton>
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="Type a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  sx={{
                    mx: 1,
                    '& .MuiInputBase-root': {
                      padding: '8px 0',
                    },
                  }}
                  multiline
                  maxRows={4}
                  inputProps={{ maxLength: 1000 }}
                />
                <LoadingButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || messageState.isSubmitting}
                  loading={messageState.isSubmitting}
                  loadingPosition="center"
                >
                  <Send />
                </LoadingButton>
              </MessageInputContainer>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 'calc(100vh - 64px)',
                textAlign: 'center',
              }}
            >
              <Box sx={{ width: 80, height: 80, position: 'relative', mb: 2 }}>
                <Image
                  src={QuickChatIcon}
                  alt="QuickChat Icon"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </Box>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Welcome to QuickChat
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Select a chat to start messaging
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}