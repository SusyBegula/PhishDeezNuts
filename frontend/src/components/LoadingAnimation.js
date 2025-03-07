import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { keyframes } from '@mui/system';

// Define animations
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
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

const wave = keyframes`
  0% {
    transform: translateY(0px);
  }
  25% {
    transform: translateY(-10px);
  }
  50% {
    transform: translateY(0px);
  }
  75% {
    transform: translateY(10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const LoadingAnimation = ({ message = 'Loading...', size = 'medium' }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Size configurations
  const sizes = {
    small: {
      containerSize: 40,
      dotSize: 8,
      fontSize: '0.875rem',
      spacing: 1,
    },
    medium: {
      containerSize: 60,
      dotSize: 12,
      fontSize: '1rem',
      spacing: 2,
    },
    large: {
      containerSize: 100,
      dotSize: 16,
      fontSize: '1.25rem',
      spacing: 3,
    },
  };
  
  const { containerSize, dotSize, fontSize, spacing } = sizes[size];
  
  // Colors for the dots
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.success.main,
  ];
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: containerSize,
          height: containerSize,
          mb: spacing,
        }}
      >
        {/* Rotating ring */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
            borderTopColor: theme.palette.primary.main,
            animation: `${rotate} 1.5s linear infinite`,
          }}
        />
        
        {/* Pulsing circle */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: containerSize * 0.6,
            height: containerSize * 0.6,
            borderRadius: '50%',
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            opacity: 0.7,
            animation: `${pulse} 1.5s ease-in-out infinite`,
          }}
        />
        
        {/* Orbiting dots */}
        {colors.map((color, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
              backgroundColor: color,
              transform: `translate(-50%, -50%) rotate(${index * 90}deg) translateX(${containerSize / 2}px)`,
              animation: `${wave} ${1 + index * 0.2}s ease-in-out infinite`,
              boxShadow: `0 0 10px ${color}`,
            }}
          />
        ))}
      </Box>
      
      {message && (
        <Typography
          variant="body1"
          sx={{
            fontSize,
            fontWeight: 500,
            color: theme.palette.text.secondary,
            textAlign: 'center',
            animation: `${pulse} 2s ease-in-out infinite`,
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingAnimation; 