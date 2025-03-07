import React from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { loginWithGoogle } from '../services/authService';
import EmailIcon from '@mui/icons-material/Email';
import SecurityIcon from '@mui/icons-material/Security';

const Login = () => {
  return (
    <Container component="main" maxWidth="sm">
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
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <EmailIcon sx={{ fontSize: 40, mr: 1, color: 'primary.main' }} />
            <SecurityIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
          </Box>
          
          <Typography component="h1" variant="h4" gutterBottom>
            PhishDeezNuts
          </Typography>
          
          <Typography variant="h6" color="text.secondary" align="center" gutterBottom>
            Phishing Email Detection
          </Typography>
          
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Connect your Gmail account to scan for phishing attempts using machine learning and AI.
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
              fontSize: '1rem'
            }}
          >
            Sign in with Google
          </Button>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </Typography>
          </Box>
        </Paper>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} PhishDeezNuts. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login; 