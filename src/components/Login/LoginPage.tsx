'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Link,
  Paper,
  TextField,
  Typography,
  ThemeProvider,
  createTheme,
  InputAdornment,
  IconButton,
  Divider,
  Alert
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  Phone
} from '@mui/icons-material';
import NextLink from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

type LoginForm = {
  mobile: string;
  password: string;
  remember: boolean;
  showPassword: boolean;
};

type ThemeMode = 'light' | 'dark';

const LoginPage = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [form, setForm] = useState<LoginForm>({
    mobile: '',
    password: '',
    remember: false,
    showPassword: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 600);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: themeMode === 'light' ? '#f5f5f5' : '#121212',
        paper: themeMode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiTextField: {
        defaultProps: {
          size: isMobile ? 'small' : 'medium',
        },
      },
      MuiButton: {
        defaultProps: {
          size: isMobile ? 'medium' : 'large',
        },
      },
    },
  });

  const handleChange = (prop: keyof LoginForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (prop === 'remember') {
      setForm({ ...form, [prop]: event.target.checked });
    } else {
      setForm({ ...form, [prop]: event.target.value });
    }
  };

  const handleClickShowPassword = () => {
    setForm({ ...form, showPassword: !form.showPassword });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      if (form.mobile && form.password) {
        console.log('Login successful', form);
        router.push('/home');
      } else {
        setError('Please enter both mobile number and password');
      }
      setIsLoading(false);
    }, 1500);
  };

  if (!mounted) {
    // Return a basic skeleton during SSR
    return (
      <>
        <Head>
          <title>QuickChat | Login</title>
          <meta name="description" content="Login to QuickChat - Modern messaging app" />
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }} />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>QuickChat | Login</title>
        <meta name="description" content="Login to QuickChat - Modern messaging app" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box 
          component="main" 
          sx={{ 
            minHeight: '100vh',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          {/* Branding Panel - Hidden on mobile */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              width: { sm: '50%', md: '60%' },
              backgroundImage: themeMode === 'light'
                ? 'linear-gradient(to bottom right, #3f51b5, #2196f3)'
                : 'linear-gradient(to bottom right, #1a237e, #0d47a1)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 4,
            }}
          >
            <Box sx={{ 
              textAlign: 'center', 
              color: 'white',
              px: 4
            }}>
              <Lock sx={{ 
                fontSize: isMobile ? 60 : 80, 
                mb: 2 
              }} />
              <Typography 
                variant={isMobile ? 'h4' : 'h3'} 
                component="h1" 
                gutterBottom 
                sx={{ fontWeight: 'bold' }}
              >
                Welcome to QuickChat
              </Typography>
              <Typography variant={isMobile ? 'body1' : 'h6'}>
                Connect with friends and colleagues in real-time
              </Typography>
            </Box>
          </Box>

          {/* Login Form Panel */}
          <Box
            sx={{
              width: { xs: '100%', sm: '50%', md: '40%' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              backgroundColor: theme.palette.background.paper,
              p: isMobile ? 2 : 4,
            }}
            component={Paper}
            elevation={isMobile ? 0 : 6}
            square={isMobile}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 400,
                mx: 'auto',
                my: isMobile ? 2 : 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography 
                component="h1" 
                variant={isMobile ? 'h5' : 'h4'} 
                sx={{ 
                  mb: 2, 
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
                Sign in to QuickChat
              </Typography>
              
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    width: '100%', 
                    mb: 2,
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}
                >
                  {error}
                </Alert>
              )}
              
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ 
                  width: '100%',
                  mt: 1,
                }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="mobile"
                  label="Mobile Number"
                  name="mobile"
                  autoComplete="tel"
                  autoFocus
                  value={form.mobile}
                  onChange={handleChange('mobile')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone fontSize={isMobile ? 'small' : 'medium'} />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  sx={{ mb: 1.5 }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={form.showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange('password')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock fontSize={isMobile ? 'small' : 'medium'} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          size={isMobile ? 'small' : 'medium'}
                        >
                          {form.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  sx={{ mb: 1.5 }}
                />
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={form.remember}
                        onChange={handleChange('remember')}
                        color="primary"
                        size={isMobile ? 'small' : 'medium'}
                      />
                    }
                    label={
                      <Typography variant={isMobile ? 'body2' : 'body1'}>
                        Remember me
                      </Typography>
                    }
                    sx={{ mb: isMobile ? 1 : 0 }}
                  />
                  <Link 
                    component={NextLink}
                    href="/forgot-password"
                    variant="body1"
                    color="primary"
                  >
                    Forgot password?
                  </Link>
                </Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ 
                    mt: 3, 
                    mb: 2, 
                    py: isMobile ? 1 : 1.5, 
                    borderRadius: 2,
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
                
                <Box sx={{ 
                  mt: 2, 
                  textAlign: 'center',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  <Link 
                    component={NextLink}
                    href="/sign-up"
                    variant={isMobile ? 'body2' : 'body1'} 
                    color="primary"
                  >
                    Don't have an account? Sign Up
                  </Link>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default LoginPage;