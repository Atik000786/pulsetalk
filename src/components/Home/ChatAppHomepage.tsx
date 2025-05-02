'use client';

import { useMemo, useState, useEffect } from 'react';
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
  createTheme
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
  EmojiEmotions
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { getAllUserAsync } from '@/redux/services/user';
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

type ApiResponse = {
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
  sender: 'me' | 'other';
  time: string;
};

type ThemeMode = 'light' | 'dark';

const getDesignTokens = (mode: ThemeMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode palette
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
          // Dark mode palette
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
        backgroundColor: message.sender === 'me' 
          ? theme.palette.primary.main 
          : (theme.palette.mode === 'dark' ? '#333' : '#e5e5ea'),
        color: message.sender === 'me' ? '#fff' : theme.palette.text.primary,
        }}
      >
        <Typography variant="body1">{message.text}</Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            textAlign: 'right',
            color: message.sender === 'me' ? 'rgba(255,255,255,0.7)' : 'text.secondary'
          }}
        >
          {message.time}
        </Typography>
      </Box>
    </Box>
  );
};

const SidebarContent = React.memo(({
  chats,
  selectedChat,
  setSelectedChat
}: {
  chats: Chat[];
  selectedChat: string | null;
  setSelectedChat: (id: string) => void;
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ overflow: 'auto' }}>
      <Paper elevation={0} sx={{
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#f5f5f5',
        margin: theme.spacing(2),
        width: '100%',
      }}>
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
              backgroundColor: selectedChat === chat.id 
                ? theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.08)' 
                  : 'rgba(0, 0, 0, 0.04)'
                : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.08)' 
                  : 'rgba(0, 0, 0, 0.04)'
              }
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
});

SidebarContent.displayName = 'SidebarContent';

export default function ChatAppHomepage() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [chats, setChats] = useState<Chat[]>([]);
  
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.users);
  const usersData = useSelector((state: RootState) => state.users.user) as ApiResponse | null;

  // Create theme based on themeMode
  const theme = useMemo(() => createTheme(getDesignTokens(themeMode)), [themeMode]);

  useEffect(() => {
    // Fetch all users when component mounts
    dispatch(getAllUserAsync({}));
  }, [dispatch]);

  useEffect(() => {
    if (usersData?.success && usersData.data?.users) {
      // Transform the users into chat format
      const transformedChats = usersData.data.users.map((user) => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        lastMessage: '',
        time: '',
        unread: 0,
        avatar: `https://i.pravatar.cc/150?u=${user.email}`
      }));
      setChats(transformedChats);
    }
  }, [usersData]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleThemeMode = () => {
    setThemeMode(prevMode => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      // Optional: Save to localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('themeMode', newMode);
      }
      return newMode;
    });
  };

  // Check for saved theme preference on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('themeMode') as ThemeMode;
      if (savedTheme) {
        setThemeMode(savedTheme);
      }
    }
  }, []);

  const handleSendMessage = () => {
    if (message.trim() === '' || !selectedChat) return;

    const newMessage: Message = {
      id: `${selectedChat}-${Date.now()}`,
      text: message,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage]
    }));

    // Update last message in chats
    const chatIndex = chats.findIndex(c => c.id === selectedChat);
    if (chatIndex !== -1) {
      const updatedChats = [...chats];
      updatedChats[chatIndex] = {
        ...updatedChats[chatIndex],
        lastMessage: message,
        time: 'Just now'
      };
      setChats(updatedChats);
    }

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const drawerWidth = 340;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {/* App Bar */}
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
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              {selectedChat ? chats.find(c => c.id === selectedChat)?.name : 'Select a chat'}
            </Typography>
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

        {/* Sidebar Drawer */}
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
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              padding: theme.spacing(0, 1),
              ...theme.mixins.toolbar,
              justifyContent: 'space-between',
            }}>
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
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              padding: theme.spacing(0, 1),
              ...theme.mixins.toolbar,
              justifyContent: 'space-between',
            }}>
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

        {/* Main Content */}
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
                {(messages[selectedChat] || []).map((msg) => (
                  <Message key={msg.id} message={msg} />
                ))}
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
                />
                <IconButton 
                  color="primary" 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <Send />
                </IconButton>
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