import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';

const GlassCard = ({ 
  children, 
  title, 
  icon, 
  elevation = 0, 
  gradient = false,
  glassEffect = true,
  sx = {} 
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Base styles for the card
  const baseStyles = {
    p: 3,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    transition: 'all 0.3s ease',
    height: '100%',
    ...sx,
  };
  
  // Glass effect styles
  const glassStyles = glassEffect ? {
    backdropFilter: 'blur(10px)',
    backgroundColor: isDarkMode 
      ? 'rgba(30, 30, 30, 0.7)' 
      : 'rgba(255, 255, 255, 0.7)',
    border: '1px solid',
    borderColor: isDarkMode 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(255, 255, 255, 0.7)',
    boxShadow: isDarkMode 
      ? '0 8px 32px rgba(0, 0, 0, 0.2)' 
      : '0 8px 32px rgba(58, 123, 213, 0.1)',
    '&:hover': {
      boxShadow: isDarkMode 
        ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
        : '0 8px 32px rgba(58, 123, 213, 0.2)',
      transform: 'translateY(-5px)',
    },
  } : {};
  
  // Gradient background styles
  const gradientStyles = gradient ? {
    background: isDarkMode 
      ? 'linear-gradient(135deg, rgba(58, 123, 213, 0.1) 0%, rgba(0, 210, 255, 0.1) 100%)' 
      : 'linear-gradient(135deg, rgba(58, 123, 213, 0.05) 0%, rgba(0, 210, 255, 0.05) 100%)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 'inherit',
      padding: '2px',
      background: 'linear-gradient(135deg, rgba(58, 123, 213, 0.3), rgba(0, 210, 255, 0.3))',
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      pointerEvents: 'none',
    },
  } : {};
  
  return (
    <Paper 
      elevation={elevation}
      sx={{
        ...baseStyles,
        ...glassStyles,
        ...gradientStyles,
      }}
    >
      {(title || icon) && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          pb: title ? 2 : 0,
          borderBottom: title ? `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}` : 'none',
        }}>
          {icon && (
            <Box 
              sx={{ 
                mr: title ? 2 : 0,
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {icon}
            </Box>
          )}
          
          {title && (
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          )}
        </Box>
      )}
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </Box>
    </Paper>
  );
};

export default GlassCard; 