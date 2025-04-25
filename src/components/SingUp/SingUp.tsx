'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Stack,
  TextField,
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
  Google,
  Facebook,
  Apple
} from '@mui/icons-material';

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

const SocialButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  padding: theme.spacing(1.5),
  borderRadius: '8px',
  fontWeight: 500,
  flex: 1,
  minWidth: '120px',
  [theme.breakpoints.down('sm')]: {
    minWidth: '100px',
    fontSize: '0.8rem',
    padding: theme.spacing(1)
  }
}));

const FormTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': {
      borderColor: theme.palette.divider
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main
    }
  }
}));

export default function SignUp() {
  const router = useRouter();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Changed from '/chat' to '/login' to navigate to login page after submission
    router.push('/login');
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

            <Stack direction="row" spacing={2} sx={{ width: '100%' }} useFlexGap flexWrap="wrap">
              <SocialButton
                variant="outlined"
                startIcon={<Google />}
                sx={{ color: '#DB4437', borderColor: '#DB4437' }}
              >
                Google
              </SocialButton>
              <SocialButton
                variant="outlined"
                startIcon={<Facebook />}
                sx={{ color: '#4267B2', borderColor: '#4267B2' }}
              >
                Facebook
              </SocialButton>
              <SocialButton
                variant="outlined"
                startIcon={<Apple />}
                sx={{ color: 'text.primary', borderColor: 'text.secondary' }}
              >
                Apple
              </SocialButton>
            </Stack>

            <Divider sx={{ width: '100%' }}>
              <Typography variant="body2" color="text.secondary">
                or continue with email
              </Typography>
            </Divider>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <FormTextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <FormTextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Stack>

                <FormTextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <FormTextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
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

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
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
                </Button>

                <Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
                  Already have an account?{' '}
                  <Link href="/login" underline="hover" color="primary.main" fontWeight={500}>
                    Sign in
                  </Link>
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </StyledPaper>
      </Container>
    </GradientBackground>
  );
}