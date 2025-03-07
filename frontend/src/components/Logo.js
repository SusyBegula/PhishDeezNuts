import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import { Security as SecurityIcon, Email as EmailIcon } from '@mui/icons-material';

// Define animations
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const Logo = ({ variant = 'default', showText = true, size = 'medium' }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Size configurations
  const sizes = {
    small: {
      iconSize: 24,
      fontSize: '1rem',
      spacing: 0.5,
    },
    medium: {
      iconSize: 40,
      fontSize: '1.5rem',
      spacing: 1,
    },
    large: {
      iconSize: 60,
      fontSize: '2rem',
      spacing: 1.5,
    },
  };
  
  const { iconSize, fontSize, spacing } = sizes[size];
  
  // Gradient for the logo
  const gradient = 'linear-gradient(45deg, #3a7bd5 0%, #00d2ff 100%)';
  
  // Render different logo variants
  if (variant === 'icon') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: iconSize,
          height: iconSize,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: gradient,
            animation: `${pulse} 3s infinite ease-in-out`,
            boxShadow: `0 0 20px rgba(58, 123, 213, ${isDarkMode ? '0.5' : '0.3'})`,
          }}
        />
        <SecurityIcon
          sx={{
            position: 'absolute',
            fontSize: iconSize * 0.6,
            color: 'white',
            animation: `${rotate} 10s infinite linear`,
            zIndex: 1,
          }}
        />
        <EmailIcon
          sx={{
            position: 'absolute',
            fontSize: iconSize * 0.4,
            color: 'white',
            animation: `${float} 3s infinite ease-in-out`,
            zIndex: 2,
          }}
        />
      </Box>
    );
  }
  
  // Default logo with text
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: iconSize,
          height: iconSize,
          mr: showText ? spacing : 0,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: gradient,
            animation: `${pulse} 3s infinite ease-in-out`,
            boxShadow: `0 0 20px rgba(58, 123, 213, ${isDarkMode ? '0.5' : '0.3'})`,
          }}
        />
        <SecurityIcon
          sx={{
            position: 'absolute',
            fontSize: iconSize * 0.6,
            color: 'white',
            animation: `${rotate} 10s infinite linear`,
            zIndex: 1,
          }}
        />
        <EmailIcon
          sx={{
            position: 'absolute',
            fontSize: iconSize * 0.4,
            color: 'white',
            animation: `${float} 3s infinite ease-in-out`,
            zIndex: 2,
          }}
        />
      </Box>
      
      {showText && (
        <Typography
          variant={size === 'large' ? 'h4' : size === 'medium' ? 'h6' : 'body1'}
          component="div"
          sx={{
            fontWeight: 700,
            background: gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.5px',
          }}
        >
          PhishDeezNuts
        </Typography>
      )}
    </Box>
  );
};

export default Logo; 