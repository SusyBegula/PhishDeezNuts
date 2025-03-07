import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  AppBar, 
  Toolbar,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { loginWithGoogle } from '../services/authService';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <>
      <AppBar 
        position="static" 
        color="transparent" 
        elevation={0}
        sx={{
          background: isDarkMode 
            ? 'linear-gradient(90deg, #1e1e1e 0%, #252525 100%)' 
            : 'linear-gradient(90deg, #ffffff 0%, #f8f9fa 100%)',
        }}
      >
        <Toolbar>
          <Logo size="small" />
          <Box sx={{ flexGrow: 1 }} />
          <ThemeToggle />
        </Toolbar>
      </AppBar>
      
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          background: isDarkMode 
            ? 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)' 
            : 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: isDarkMode
              ? 'radial-gradient(circle at 25% 25%, rgba(58, 123, 213, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(0, 210, 255, 0.1) 0%, transparent 50%)'
              : 'radial-gradient(circle at 25% 25%, rgba(58, 123, 213, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(0, 210, 255, 0.05) 0%, transparent 50%)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            {/* Left side - Hero content */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3 }}>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 2,
                    background: 'linear-gradient(45deg, #3a7bd5 0%, #00d2ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.5px',
                  }}
                >
                  Protect Your Inbox
                </Typography>
                
                <Typography 
                  variant="h5" 
                  color="text.secondary" 
                  sx={{ mb: 3, fontWeight: 500 }}
                >
                  Advanced phishing detection powered by AI
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
                  PhishDeezNuts uses machine learning, AI analysis, and rule-based detection to identify and protect you from sophisticated phishing attempts.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: isDarkMode ? 'rgba(58, 123, 213, 0.1)' : 'rgba(58, 123, 213, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: 120
                  }}>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>99%</Typography>
                    <Typography variant="body2" color="text.secondary">Detection Rate</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: isDarkMode ? 'rgba(0, 210, 255, 0.1)' : 'rgba(0, 210, 255, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: 120
                  }}>
                    <Typography variant="h4" color="secondary" sx={{ fontWeight: 700 }}>24/7</Typography>
                    <Typography variant="body2" color="text.secondary">Protection</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: isDarkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: 120
                  }}>
                    <Typography variant="h4" color="success" sx={{ fontWeight: 700 }}>AI</Typography>
                    <Typography variant="body2" color="text.secondary">Powered</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            
            {/* Right side - Login form */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={isDarkMode ? 4 : 2}
                sx={{
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRadius: 4,
                  maxWidth: 450,
                  mx: 'auto',
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, #252525 0%, #1e1e1e 100%)' 
                    : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  boxShadow: isDarkMode 
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                    : '0 8px 32px rgba(0, 0, 0, 0.05)',
                  border: '1px solid',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(58, 123, 213, 0.05) 0%, rgba(0, 210, 255, 0.05) 100%)',
                    zIndex: 0,
                  },
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    <Logo size="large" />
                  </Box>
                  
                  <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 600 }}>
                    Welcome Back
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
                    Sign in to access your protected inbox
                  </Typography>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={loginWithGoogle}
                    startIcon={
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
                        alt="Google Logo" 
                        style={{ width: 20, height: 20 }}
                      />
                    }
                    sx={{ 
                      py: 1.5, 
                      px: 3, 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      width: '100%',
                      mb: 3,
                      background: 'linear-gradient(45deg, #3a7bd5 0%, #00d2ff 100%)',
                      boxShadow: '0 4px 15px rgba(58, 123, 213, 0.3)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(58, 123, 213, 0.4)',
                      }
                    }}
                  >
                    Sign in with Google
                  </Button>
                  
                  <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block' }}>
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          textAlign: 'center',
          background: isDarkMode 
            ? 'linear-gradient(90deg, #1e1e1e 0%, #252525 100%)' 
            : 'linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} PhishDeezNuts. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default Login; 