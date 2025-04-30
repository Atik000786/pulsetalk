'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Stack,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Paper,
  styled,
  useTheme,
  Link
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import FormProvider from "@/components/hook-form/FormProvider";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import toast from "react-hot-toast";
import RHFTextField from "@/components/hook-form/RHFTextField";
import { LoadingButton } from "@mui/lab";
import { signUpAsync } from "@/redux/services/user";

const GradientBackground = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem'
});

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

// In SignUp.tsx
const SignUpSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .trim()
    .matches(/^[a-zA-Z]+$/, 'First name can only contain letters'),
  lastName: Yup.string()
    .required('Last name is required')
    .trim()
    .matches(/^[a-zA-Z]+$/, 'Last name can only contain letters'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format')
    .trim()
    .lowercase(),
  mobile: Yup.string()
    .required('Mobile number is required')
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
    .trim(),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
});

export default function SignUp() {
  const router = useRouter();
  const theme = useTheme();
  const { isSubmitting, error } = useSelector((state: RootState) => state.users);
  const dispatch: AppDispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const defaultValues = useMemo(
    () => ({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(SignUpSchema),
    defaultValues,
  });

  const { handleSubmit, reset } = methods;

 const onSubmit = async (formData: any) => {
  try {
    // Prepare data exactly as server expects
    const requestData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      mobile: formData.mobile.trim(),
      password: formData.password // No trim here as passwords might contain spaces
    };

    console.log("Sending data:", requestData); // For debugging

    const response = await dispatch(signUpAsync(requestData));
    
    if (response.meta.requestStatus === 'fulfilled') {
      toast.success('Account created successfully!');
      reset();
      router.push('/login');
    } else if (response.meta.requestStatus === 'rejected') {
      const errorMessage = response.payload?.message || 'Sign up failed';
      toast.error(errorMessage);
    }
  } catch (error: any) {
    toast.error(error.message || 'An error occurred during sign up');
  }
};

  return (
    <GradientBackground>
      <Container component="main" maxWidth="sm" sx={{ padding: 0 }}>

        <CssBaseline />
        <StyledPaper elevation={3}>
          <Stack spacing={3}>
            <Box textAlign="center">
              <Typography component="h1" variant="h4" sx={{ 
                fontWeight: 700, 
                mb: 1,
                background: 'linear-gradient(90deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Join QuickChat
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start connecting with friends in seconds
              </Typography>
            </Box>

            <Divider sx={{ width: '100%' }}>
              <Typography variant="body2" color="text.secondary">
                Sign up with Mobile Number
              </Typography>
            </Divider>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <RHFTextField
                    name="firstName"
                    label="First Name"
                    autoFocus
                    fullWidth
                  />
                  <RHFTextField
                    name="lastName"
                    label="Last Name"
                    fullWidth
                  />
                </Stack>

                <RHFTextField
                  name="email"
                  label="Email Address"
                  fullWidth
                />

                <RHFTextField
                  name="mobile"
                  label="Mobile Number"
                  fullWidth
                  inputProps={{
                    maxLength: 10,
                    pattern: "[0-9]{10}",
                  }}
                />

                <RHFTextField
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  InputProps={{
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

                <LoadingButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: '8px',
                    background: 'linear-gradient(90deg, #667eea, #764ba2)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #5a6fd1, #6a4299)',
                    },
                  }}
                >
                  Create Account
                </LoadingButton>

                <Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
                  Already have an account?{' '}
                  <Link href="/login" underline="hover" color="primary.main" fontWeight={500}>
                    Sign in
                  </Link>
                </Typography>
              </Stack>
            </FormProvider>
          </Stack>
        </StyledPaper>
      </Container>
    </GradientBackground>
  );
}