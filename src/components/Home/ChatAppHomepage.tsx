'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  styled,
  useTheme,
  InputBase,
  Paper,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  Menu,
  Search,
  LightMode,
  DarkMode,
  MoreVert,
  ChatBubble,
  People,
  Notifications,
  Logout
} from '@mui/icons-material';

// TypeScript types
type Chat = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
};

type ThemeMode = 'light' | 'dark';

// Sample data
const chats: Chat[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    lastMessage: 'Hey, how about meeting tomorrow?',
    time: '10:30 AM',
    unread: 2,
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    name: 'Sarah Williams',
    lastMessage: 'I sent you the design files',
    time: 'Yesterday',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: '3',
    name: 'Team Standup',
    lastMessage: 'Michael: I finished the API integration',
    time: 'Yesterday',
    unread: 5,
    avatar: 'https://i.pravatar.cc/150?img=9'
  },
  {
    id: '4',
    name: 'Mom',
    lastMessage: 'Call me when you get home',
    time: '04/20/23',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?img=11'
  },
];

// Custom styled components
const SearchBar = styled(Paper)(({ theme }) => ({
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#f5f5f5',
  margin: theme.spacing(2),
  width: '100%',
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

// Sidebar component
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
      <SearchBar elevation={0}>
        <IconButton sx={{ p: '10px' }} aria-label="search">
          <Search />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search chats..."
          inputProps={{ 'aria-label': 'search chats' }}
        />
      </SearchBar>
      
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

// Main component
const ChatAppHomepage = () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleThemeMode = () => {
    setThemeMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const drawerWidth = 340;

  if (!mounted) {
    return null; // or return a loading spinner
  }

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
            <DrawerHeader>
              <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>
                QuickChat
              </Typography>
              <IconButton onClick={handleDrawerToggle}>
                <Menu />
              </IconButton>
            </DrawerHeader>
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
            <DrawerHeader>
              <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>
                QuickChat
              </Typography>
              <IconButton>
                <MoreVert />
              </IconButton>
            </DrawerHeader>
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
            backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#fafafa',
          }}
        >
          <Toolbar />
          {selectedChat ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 64px)',
              }}
            >
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h5" color="text.secondary">
                  {chats.find(c => c.id === selectedChat)?.name}'s chat
                </Typography>
              </Box>
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
              <ChatBubble sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
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
};

export default ChatAppHomepage;