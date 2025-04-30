'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Link,
  Paper,
  Typography,
  ThemeProvider,
  createTheme,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  Container,
  Stack,
  styled,
  useTheme
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  Phone
} from '@mui/icons-material';
import NextLink from 'next/link';
import Head from 'next/head';
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import toast from "react-hot-toast";
import FormProvider from "@/components/hook-form/FormProvider";
import RHFTextField from "@/components/hook-form/RHFTextField";
import { LoadingButton } from "@mui/lab";
import { loginAsync } from '@/redux/services/user';

type ThemeMode = 'light' | 'dark';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  width: '100%',
  maxWidth: '500px',
  backdropFilter: 'blur(8px)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3)
  }
}));

const LoginSchema = Yup.object().shape({
  mobile: Yup.string()
    .required('Mobile number is required')
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
    .trim(),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  remember: Yup.boolean()
});

const LoginPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const dispatch: AppDispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.users);
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [showPassword, setShowPassword] = useState(false);

  const defaultValues = useMemo(
    () => ({
      mobile: '',
      password: '',
      remember: false,
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = async (formData: any) => {
    try {
      const requestData = {
        mobile: formData.mobile.trim(),
        password: formData.password,
        remember: formData.remember
      };

      const response = await dispatch(loginAsync(requestData));
      
      if (loginAsync.fulfilled.match(response)) {
        // Store auth token and user data in localStorage
        if (response.payload.data?.token) {
          localStorage.setItem('authToken', response.payload.data.token);
          
          if (response.payload.data?.user) {
            localStorage.setItem('userData', JSON.stringify(response.payload.data.user));
          }
          
          // Store remember me preference
          localStorage.setItem('rememberMe', formData.remember.toString());
        }

        toast.success('Login successful!');
        router.push('/home');
      } else if (loginAsync.rejected.match(response)) {
        const errorMessage =  'Login failed';
        toast.error(errorMessage);
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during login');
    }
  };

  const muiTheme = createTheme({
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
  });

  return (
    <>
      <Head>
        <title>QuickChat | Login</title>
        <meta name="description" content="Login to QuickChat - Modern messaging app" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Box 
          component="main" 
          sx={{ 
            minHeight: '100vh',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            backgroundColor: themeMode === 'light' ? '#f5f5f5' : '#121212'
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
                fontSize: 80, 
                mb: 2 
              }} />
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                sx={{ fontWeight: 'bold' }}
              >
                Welcome to QuickChat
              </Typography>
              <Typography variant="h6">
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
              backgroundColor: muiTheme.palette.background.paper,
              p: 4,
            }}
            component={Paper}
            elevation={6}
          >
            <Container component="main" maxWidth="sm" sx={{ padding: 0 }}>
              <StyledPaper elevation={3}>
                <Stack spacing={3}>
                  <Box textAlign="center">
                    <Typography component="h1" variant="h4" sx={{ 
                      fontWeight: 700, 
                      mb: 1,
                      background: 'linear-gradient(90deg, #3f51b5, #2196f3)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      Sign in to QuickChat
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Connect with your friends and colleagues
                    </Typography>
                  </Box>

                  <Divider sx={{ width: '100%' }}>
                    <Typography variant="body2" color="text.secondary">
                      Sign in with Mobile Number
                    </Typography>
                  </Divider>

                  <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2}>
                      <RHFTextField
                        name="mobile"
                        label="Mobile Number"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone />
                            </InputAdornment>
                          ),
                          inputProps: {
                            maxLength: 10,
                            pattern: "[0-9]{10}",
                          }
                        }}
                      />

                      <RHFTextField
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
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
                              name="remember"
                              color="primary"
                            />
                          }
                          label="Remember me"
                        />
                        <Link 
                          component={NextLink}
                          href="/forgot-password"
                          variant="body2"
                          color="primary"
                        >
                          Forgot password?
                        </Link>
                      </Box>

                      <LoadingButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        loading={isLoading}
                        sx={{
                          mt: 2,
                          py: 1.5,
                          borderRadius: '8px',
                          background: 'linear-gradient(90deg, #3f51b5, #2196f3)',
                          '&:hover': {
                            background: 'linear-gradient(90deg, #3949ab, #1976d2)',
                          },
                        }}
                      >
                        Sign In
                      </LoadingButton>

                      <Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
                        Don't have an account?{' '}
                        <Link 
                          component={NextLink}
                          href="/sign-up"
                          underline="hover" 
                          color="primary.main" 
                          fontWeight={500}
                        >
                          Sign up
                        </Link>
                      </Typography>
                    </Stack>
                  </FormProvider>
                </Stack>
              </StyledPaper>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default LoginPage;