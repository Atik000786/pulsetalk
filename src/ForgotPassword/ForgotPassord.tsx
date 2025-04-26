"use client" // Add this at the top to make it a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Changed from 'next/router'
import { 
  Box, 
  Button, 
  Container, 
  CssBaseline, 
  TextField, 
  Typography,
  Paper,
  Avatar,
  CircularProgress,
  Stack,
  Link
} from '@mui/material';
import { LockReset as LockResetIcon } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Head from 'next/head';
import React from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
    },
    secondary: {
      main: '#10b981',
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h5: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>QuickChat - Forgot Password</title>
        <meta name="description" content="Reset your QuickChat password" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: '100%',
              backgroundColor: 'background.paper',
            }}
          >
            <Stack direction="column" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 56,
                  height: 56,
                }}
              >
                <LockResetIcon fontSize="large" />
              </Avatar>
              <Typography component="h1" variant="h5" sx={{ fontWeight: 600 }}>
                Forgot Password
              </Typography>
            </Stack>
            
            {success ? (
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography color="success.main" sx={{ mb: 2 }}>
                  Password reset link sent to your email!
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => router.push('/login')}
                  sx={{ mt: 2 }}
                >
                  Back to Login
                </Button>
              </Box>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2, mb: 3 }}>
                  Enter your email address and we'll send you a link to reset your password.
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    error={!!error}
                    helperText={error}
                  />
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    sx={{ mt: 3, mb: 2, py: 1.5 }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link
                      href="/login"
                      variant="body2"
                      color="primary"
                      sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      Remember your password? Sign in
                    </Link>
                  </Box>
                </Box>
              </>
            )}
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}